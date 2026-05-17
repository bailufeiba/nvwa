import { Enum } from "cc";
import { _decorator, Component } from "cc";

const { ccclass, property } = _decorator;

export enum EI18AssetType {
    SpriteFrame,
    SkeletonData,
    SpriteAtlas,
}

@ccclass(`I18UrlInfo`)
class I18UrlInfo {
    @property({ type: Enum(EI18AssetType) })
    assetType: EI18AssetType = EI18AssetType.SpriteFrame;

    @property
    url: string = ``;
}

@ccclass(`I18PreUrl`)
export class I18PreUrl extends Component {
    @property({ type: [I18UrlInfo], visible: true })
    _infos: Array<I18UrlInfo> = [];

    getUrls() {
        const self = this;

        const mapUrl: Map<EI18AssetType, Array<string>> = new Map();
        for (const info of self._infos) {
            let szUrl: Array<string> = mapUrl.get(info.assetType)!;
            if (szUrl == null) {
                szUrl = [];
                mapUrl.set(info.assetType, szUrl);
            }
            if (szUrl.indexOf(info.url) == -1) {
                szUrl.push(info.url);
            }
        }

        return mapUrl;
    }
}
