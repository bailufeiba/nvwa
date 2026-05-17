import {
    AssetManager,
    assetManager,
    Director,
    director,
    error,
    errorID,
    JsonAsset,
    Node,
    Prefab,
    resources,
    SceneAsset,
    Sprite,
    SpriteFrame,
    sys,
    warnID,
} from "cc";
import { sp } from "cc";
import { Asset } from "cc";
import { SpriteAtlas } from "cc";

import { I18BtnUrl } from "./I18BtnUrl";
import I18LanguageHelper, { EBundleName } from "./I18LanguageHelper";
import { EI18AssetType, I18PreUrl } from "./I18PreUrl";
import TxtMgr from "./TxtMgr";
import { emitEvent } from "../Common/EventManager";

export default class I18Mgr extends Singleton<I18Mgr>() {
    _currBundleName: EBundleName = EBundleName.NONE;
    _currBundle: AssetManager.Bundle | null = null;

    _mapPrefabResInfo: Map<string, Map<EI18AssetType, string[]>> = new Map();
    _mapRes = new Map<EI18AssetType, Map<string, any>>();

    initDefaultLanguage(completeCllaback?: Function) {
        const self = this;
        self.changeBundle(self.getConfigBundleName(), completeCllaback);
    }

    isDefaultBundle() {
        return this._currBundleName == EBundleName.Default;
    }

    changeBundle(bundle: EBundleName, completeCallback?: Function) {
        const self = this;

        console.log(`I18Mgr changeLanguage ${bundle}`);
        if (self._currBundleName == bundle) {
            if (completeCallback) {
                completeCallback(null);
            }
            return;
        }

        self._currBundleName = bundle;
        self._mapRes.clear();
        self._mapPrefabResInfo.clear();

        if (self._currBundleName == EBundleName.Default) {
            // 有正在使用的情况,不能立即释放,切换语言包应当重启
            // if( self._currBundle != null ){
            //     self._currBundle.releaseAll();
            //     assetManager.removeBundle( self._currBundle );
            // }
            self._currBundle = null;

            console.log(`I18Mgr load resources`);
            const url: string = `${EBundleName.Default}/${TxtMgr.url}`;
            // @ts-ignore
            resources.load(url, JsonAsset, (err: Error, data: JsonAsset) => {
                if (err) {
                    console.error(`I18Mgr load ${url} error`);
                    console.error(err);

                    if (completeCallback) {
                        completeCallback(err);
                    }
                    return;
                }
                self.onLoadTxt(data);

                if (completeCallback) {
                    completeCallback(null);
                }
            });
        } else {
            console.log(`I18Mgr loadBundle ${self._currBundleName}`);
            assetManager.loadBundle(
                self._currBundleName,
                (err: Error | null, bundle: AssetManager.Bundle) => {
                    if (err) {
                        console.log(
                            `I18Mgr loadBundle ${self._currBundleName} error`,
                        );
                        console.error(err);
                        self.changeBundle(
                            EBundleName.Default,
                            completeCallback,
                        );
                        return;
                    }

                    // 有正在使用的情况,不能立即释放,切换语言包应当重启
                    // if( self._currBundle != null ){
                    //     self._currBundle.releaseAll();
                    //     assetManager.removeBundle( self._currBundle );
                    // }
                    self._currBundle = bundle;
                    bundle.load(
                        // @ts-ignore
                        TxtMgr.url,
                        JsonAsset,
                        (err: Error, data: JsonAsset) => {
                            if (err) {
                                console.error(
                                    `I18Mgr load ${TxtMgr.url} error`,
                                );
                                console.error(err);

                                if (completeCallback) {
                                    completeCallback(err);
                                }
                                return;
                            }
                            self.onLoadTxt(data);

                            if (completeCallback) {
                                completeCallback(null);
                            }
                        },
                    );
                },
            );
        }
    }

    onLoadTxt(data: JsonAsset) {
        TxtMgr.getInstance().setData(data);
        emitEvent(`I18BundleReady`);
    }

    isReady() {
        const self = this;
        return (
            self._currBundleName == EBundleName.Default ||
            self._currBundle != null
        );
    }

    getCurrBundleName() {
        return this._currBundleName;
    }

    getCurrBundle(): AssetManager.Bundle {
        return this._currBundle!;
    }

    getRes(
        name: string,
        assetType: any,
        callback: (err: Error | null, data: any) => void,
    ) {
        const self = this;

        const map = self._mapRes.get(assetType);
        if (map != null) {
            const resData = map.get(name);
            if (resData != null) {
                callback(null, resData);
                return;
            }
        }

        if (self._currBundleName == EBundleName.Default) {
            resources.load(
                `${EBundleName.Default}/${name}`,
                assetType,
                (err, data) => {
                    if (err == null) {
                        let map = self._mapRes.get(assetType);
                        if (map == null) {
                            map = new Map();
                            self._mapRes.set(assetType, map);
                        }
                        map.set(name, data);
                    }
                    callback(err, data);
                },
            );
        } else {
            if (self._currBundle) {
                self._currBundle.load(name, assetType, (err, data) => {
                    if (err == null) {
                        let map = self._mapRes.get(assetType);
                        if (map == null) {
                            map = new Map();
                            self._mapRes.set(assetType, map);
                        }
                        map.set(name, data);
                    }
                    callback(err, data);
                });
            } else {
                callback(
                    new Error(`${self._currBundleName}bundle is null`),
                    null,
                );
            }
        }
    }

    getConfigBundleName() {
        const self = this;

        let language: string | null = ``;
        //浏览器语言参数
        if (sys.isBrowser) {
            const params: any = self.getURLParam();
            if (params != null && params[`l`] != null) {
                language = params[`l`];
            }
        }
        if (language != `` && language != null) {
            console.log(`I18Mgr get language by browser ${language}`);
            return I18LanguageHelper.getBundleByStr(language.toUpperCase());
        }

        language = localStorage.getItem(`language`);
        if (language != `` && language != null) {
            console.log(`I18Mgr get language by localStorage ${language}`);
            return I18LanguageHelper.getBundleByStr(language);
        }

        console.log(`I18Mgr get language by default ${EBundleName.Default}`);
        return EBundleName.Default;
    }

    getURLParam() {
        if (!sys.isBrowser) return null;

        const arrStr = window.location.href.split(`?`);
        if (arrStr.length <= 1) return null;

        const strParams = arrStr[1];
        const arrParam = strParams.split(`&`);
        const params: any = {};
        for (const str of arrParam) {
            const arr = str.split(`=`);
            if (arr.length != 2) continue;
            params[arr[0]] = arr[1];
        }
        return params;
    }

    preloadScene(
        sceneName: string,
        bundle?: AssetManager.Bundle | null,
        onProgress?: (
            completedCount: number,
            totalCount: number,
            item: any,
        ) => void,
        onLoaded?: Director.OnSceneLoaded,
    ): void {
        const self = this;
        let loadCountTmp = 0;
        let totalCountTmp = 1;

        if (bundle == null) {
            bundle = assetManager.bundles.find(
                (bundle): boolean => !!bundle.getSceneInfo(sceneName),
            );
        }

        if (bundle) {
            bundle.loadScene(
                sceneName,
                null,
                (finished: number, total: number, item: any) => {
                    loadCountTmp = finished;
                    totalCountTmp = total;
                    onProgress?.(finished, total * 1.3, item);
                },

                (err: Error | null, data: SceneAsset) => {
                    self.loadResByNode(
                        data.scene as Node,
                        onLoaded,
                        (finished: number, total: number) => {
                            onProgress?.(
                                loadCountTmp + finished,
                                totalCountTmp + total,
                                null,
                            );
                        },
                    );
                },
            );
        } else {
            const err = `Can not preload the scene "${sceneName}" because it is not in the build settings.`;
            if (onLoaded) {
                onLoaded(new Error(err));
            }
            error(`preloadScene: ${err}`);
        }
    }

    loadScene(
        sceneName: string,
        onLaunched?: Director.OnSceneLaunched,
        onUnloaded?: Director.OnUnload,
    ): boolean {
        const self = this;
        const direct: any = director;
        if (direct[`_loadingScene`]) {
            warnID(1208, sceneName, direct[`_loadingScene`]);
            return false;
        }
        const bundle = assetManager.bundles.find(
            (bundle): boolean => !!bundle.getSceneInfo(sceneName),
        );
        if (bundle) {
            direct.emit(`director_before_scene_loading`, sceneName);
            direct[`_loadingScene`] = sceneName;

            console.time(`LoadScene ${sceneName}`);
            bundle.loadScene(sceneName, (err, scene): void => {
                console.timeEnd(`LoadScene ${sceneName}`);
                direct[`_loadingScene`] = ``;
                if (err) {
                    error(err);
                    if (onLaunched) {
                        onLaunched(err);
                    }
                } else {
                    self.loadResByNode(scene.scene as Node, () => {
                        direct.runSceneImmediate(scene, onUnloaded, onLaunched);
                    });
                }
            });
            return true;
        } else {
            errorID(1209, sceneName);
            return false;
        }
    }

    loadResByNode(
        loadNode: Node,
        loadFinishedCallback?: Function,
        progressCallback?: Function,
    ) {
        const self = this;
        const mapResInfo = self.getAllResInfoInNode(loadNode);
        self.loadResByUrls(mapResInfo, loadFinishedCallback, progressCallback);
    }

    loadResByPrefab(
        prefab: Prefab,
        loadFinishedCallback?: Function,
        progressCallback?: Function,
    ) {
        const self = this;
        let mapResInfo = this.getAllResInfoInPrefab(prefab);
        self.loadResByUrls(mapResInfo!, loadFinishedCallback, progressCallback);
    }

    loadResByUrls(
        mapResInfo: Map<EI18AssetType, string[]>,
        loadFinishedCallback?: Function,
        progressCallback?: Function,
    ) {
        if (mapResInfo.size == 0) {
            if (loadFinishedCallback) {
                loadFinishedCallback();
            }
            return;
        }

        const self = this;

        let totalCount = 0;
        for (const resInfo of mapResInfo) {
            totalCount += resInfo[1].length;
        }

        let loadCount = 0;
        for (const resInfo of mapResInfo) {
            const resType = self.getAssetType(resInfo[0]);
            const szUrl = resInfo[1];
            for (const url of szUrl) {
                //console.log( "i18Mgr loadResByUrls start " + url );
                const assetUrl =
                    resInfo[0] == EI18AssetType.SpriteFrame
                        ? `${url}/spriteFrame`
                        : url;
                // eslint-disable-next-line unused-imports/no-unused-vars
                self.getRes(assetUrl, resType, (err, assetData: Asset) => {
                    if (err) {
                        if (loadFinishedCallback) {
                            loadFinishedCallback(err);
                        }
                        return;
                    }
                    //console.log( "i18Mgr loadResByUrls end " + assetData.name );
                    ++loadCount;
                    if (progressCallback) {
                        progressCallback(loadCount, totalCount);
                    }
                    if (loadCount >= totalCount) {
                        if (loadFinishedCallback) {
                            loadFinishedCallback(null);
                        }
                    }
                });
            }
        }
    }

    getAssetType(assetType: EI18AssetType) {
        switch (assetType) {
            case EI18AssetType.SpriteFrame:
                return SpriteFrame;
            case EI18AssetType.SkeletonData:
                return sp.SkeletonData;
            case EI18AssetType.SpriteAtlas:
                return SpriteAtlas;
            default:
                return Asset;
        }
    }

    getAllResInfoInNode(node: Node) {
        const self = this;

        let mapResInfo = self.getNodePreUrl(node);
        if (mapResInfo == null) {
            mapResInfo = new Map<EI18AssetType, string[]>();
        }

        const addUrl = function (type: any, url: string) {
            let szUrl = mapResInfo.get(type);
            if (szUrl == null) {
                szUrl = [];
                mapResInfo.set(type, szUrl);
            }
            if (szUrl.indexOf(url) == -1) {
                szUrl.push(url);
            }
        };

        const i18CmptInfo = self.getI18CmptInfo(node);
        if (i18CmptInfo) {
            addUrl(i18CmptInfo[0], i18CmptInfo[1]);
        }

        const i18BtnUrls = self.getBtnUrls(node);
        for (const url of i18BtnUrls) {
            addUrl(EI18AssetType.SpriteFrame, url);
        }

        const cmpts: any = node.components;
        for (const cmpt of cmpts) {
            for (const k in cmpt) {
                const obj = cmpt[k];
                if (obj instanceof Array) {
                    for (const objTmp of obj) {
                        if (objTmp instanceof Prefab) {
                            self.mergeResInfo(
                                mapResInfo,
                                self.getAllResInfoInPrefab(objTmp)!,
                            );
                        }
                    }
                } else if (obj instanceof Prefab) {
                    self.mergeResInfo(
                        mapResInfo,
                        self.getAllResInfoInPrefab(obj)!,
                    );
                }
            }
        }

        const children = node.children;
        for (const n of children) {
            self.mergeResInfo(mapResInfo, self.getAllResInfoInNode(n));
        }

        return mapResInfo;
    }

    mergeResInfo(
        mainResInfo: Map<EI18AssetType, Array<string>>,
        addResInfo: Map<EI18AssetType, Array<string>>,
    ) {
        addResInfo.forEach((urls, type) => {
            const mainUrls = mainResInfo.get(type);
            if (mainUrls == null) {
                mainResInfo.set(type, urls);
                return;
            }

            for (const url of urls) {
                if (mainUrls.indexOf(url) == -1) {
                    mainUrls.push(url);
                }
            }
        });
    }

    getAllResInfoInPrefab(prefab: Prefab) {
        const self = this;
        if (self._mapPrefabResInfo.has(prefab.uuid)) {
            return self._mapPrefabResInfo.get(prefab.uuid);
        }

        const mapResInfo = this.getAllResInfoInNode(prefab.data);
        self._mapPrefabResInfo.set(prefab.uuid, mapResInfo);
        return mapResInfo;
    }

    getNodePreUrl(node: Node) {
        if (node == null) return null;

        const cmpt = node.getComponent(I18PreUrl);
        if (cmpt == null) return null;

        return cmpt.getUrls();
    }

    getBtnUrls(node: Node) {
        if (node == null) return [];

        const cmpt = node.getComponent(I18BtnUrl);
        if (cmpt == null) return [];

        return cmpt.getUrls();
    }

    getI18CmptInfo(node: Node) {
        if (node == null) return null;

        const cmpt: any = node.getComponent(`I18Cmpt`);
        if (cmpt == null) return null;

        const sprite = node.getComponent(Sprite);
        if (sprite != null) {
            if (sprite.spriteAtlas == null) {
                return [EI18AssetType.SpriteFrame, cmpt[`_key`]];
            } else {
                return [EI18AssetType.SpriteAtlas, cmpt[`_key`]];
            }
        }

        const spine = node.getComponent(sp.Skeleton);
        if (spine != null) {
            return [EI18AssetType.SkeletonData, cmpt[`_key`]];
        }

        return null;
    }
}
