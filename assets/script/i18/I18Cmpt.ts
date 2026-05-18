import {
    _decorator,
    Component,
    Label,
    RichText,
    sp,
    Sprite,
    SpriteFrame,
} from "cc";
import { SpriteAtlas } from "cc";

import I18Mgr from "./I18Mgr";
import { txt } from "./TxtMgr";
import { offEvent, onEvent } from "../Common/EventManager";

const { ccclass, property } = _decorator;

@ccclass(`I18Cmpt`)
export class I18Cmpt extends Component {
    @property
    _key: string = ``;

    @property
    get key() {
        return this._key;
    }

    set key(v: string) {
        const self = this;
        if (self._key == v) return;
        self._key = v;

        self.refreshByI18();
    }

    @property({
        visible: true,
        tooltip: `是否自动刷新\n如果代码控制显示内容,则为false`,
    })
    _refresh = true;

    _refreshedByI18 = false;

    protected onLoad(): void {
        const self = this;
        onEvent(`I18BundleReady`, self, self.onI18BundleReady);
    }

    protected onEnable() {
        const self = this;
        const sprite: Sprite | null = self.node.getComponent(Sprite);
        if (sprite) {
            sprite.sizeMode = Sprite.SizeMode.RAW;
            sprite.trim = false;
        }

        if (self._refresh) {
            this.refreshByI18();
        }
    }

    protected onDestroy(): void {
        const self = this;
        offEvent(self);
    }

    onI18BundleReady() {
        const self = this;
        if (!self.isValid) return;
        if (!self._refresh) return;

        self._refreshedByI18 = false;
        self.refreshByI18();
    }

    refreshByI18() {
        const self = this;

        if (self._refreshedByI18) return;
        self._refreshedByI18 = true;

        self.refresh(() => {
            self.node.emit(`I18Cmpt_Changed`);
        });
    }

    refresh(callback?: Function) {
        const self = this;

        if (self._key == ``) return;

        const i18 = I18Mgr.Inst;
        if (!i18.isReady()) return;

        const lb = self.node.getComponent(Label);
        if (lb) {
            lb.string = txt(self._key);
            callback?.();
            return;
        }

        const lbRich = self.node.getComponent(RichText);
        if (lbRich) {
            lbRich.string = txt(self._key);
            callback?.();
            return;
        }

        const sprite: Sprite | null = self.node.getComponent(Sprite);
        if (sprite) {
            if (sprite.spriteAtlas == null) {
                i18.getRes(
                    `${self._key}/spriteFrame`,
                    SpriteFrame,
                    (err, spriteFrame: SpriteFrame) => {
                        if (err) return;
                        if (!self.isValid) return;
                        sprite.spriteFrame = spriteFrame;
                        sprite.sizeMode = Sprite.SizeMode.RAW;
                        sprite.trim = false;
                        callback?.();
                    }
                );
            } else {
                i18.getRes(
                    self._key,
                    SpriteAtlas,
                    (err, atlas: SpriteAtlas) => {
                        if (err) return;
                        if (!self.isValid) return;
                        if (sprite.spriteFrame == null) return;
                        if (sprite.spriteFrame.name == ``) return;
                        sprite.spriteFrame = atlas.getSpriteFrame(
                            sprite.spriteFrame.name
                        );
                        sprite.sizeMode = Sprite.SizeMode.RAW;
                        sprite.trim = false;
                        callback?.();
                    }
                );
            }
            return;
        }

        const spine = self.node.getComponent(`sp.Skeleton`) as sp.Skeleton;
        if (spine) {
            i18.getRes(
                self._key,
                sp.SkeletonData,
                (err: Error | null, skeletonData: sp.SkeletonData) => {
                    if (err) return;
                    if (!self.isValid) return;

                    let animName = ``;
                    let loop = false;
                    const trackEntry = spine.getCurrent(0);
                    if (trackEntry) {
                        loop = trackEntry.loop;
                        if (trackEntry.animation) {
                            animName = trackEntry.animation.name;
                        }
                    }
                    if (animName == ``) {
                        animName = spine.animation;
                    }

                    spine.skeletonData = skeletonData;
                    if (spine._skeleton && spine._skeleton.skin) {
                        const skin = spine._skeleton.skin.name;
                        spine.setSkin(skin);
                    }

                    if (animName != ``) {
                        spine.setAnimation(0, animName, loop);
                    }
                    callback?.();
                }
            );
            return;
        }
    }
}
