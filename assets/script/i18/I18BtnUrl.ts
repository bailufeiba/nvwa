import { _decorator, Component } from "cc";
import { Button } from "cc";
import { SpriteFrame } from "cc";

import { EBundleName } from "./I18LanguageHelper";
import I18Mgr from "./I18Mgr";
import { offEvent, onEvent } from "../Common/EventManager";

const { ccclass, property } = _decorator;

@ccclass(`I18BtnUrl`)
export class I18BtnUrl extends Component {
    @property({ visible: true })
    _urlNor: string = ``;

    @property({ visible: true })
    _urlPressed: string = ``;

    @property({ visible: true })
    _urlHover: string = ``;

    @property({ visible: true })
    _urlDisable: string = ``;

    protected onLoad(): void {
        const self = this;
        onEvent(`I18BundleReady`, self, self.onI18BundleReady);
        self.refresh();
    }

    onI18BundleReady() {
        const self = this;
        if (!self.isValid) return;
        self.refreshByI18();
    }

    refreshByI18() {
        const self = this;

        self.refresh();
    }

    refresh() {
        const self = this;

        const btn = self.node.getComponent(Button);
        if (btn == null) return;

        const i18 = I18Mgr.Inst;
        if (i18.getCurrBundleName() == EBundleName.Default) return;

        if (self._urlNor != null && self._urlNor.length > 0) {
            i18.getRes(
                `${self._urlNor}/spriteFrame`,
                SpriteFrame,
                (err, spriteFrame: SpriteFrame) => {
                    if (err) return;
                    if (!self.isValid) return;
                    btn.normalSprite = spriteFrame;
                },
            );
        }

        if (self._urlPressed != null && self._urlPressed.length > 0) {
            i18.getRes(
                `${self._urlPressed}/spriteFrame`,
                SpriteFrame,
                (err, spriteFrame: SpriteFrame) => {
                    if (err) return;
                    if (!self.isValid) return;
                    btn.pressedSprite = spriteFrame;
                },
            );
        }

        if (self._urlHover != null && self._urlHover.length > 0) {
            i18.getRes(
                `${self._urlHover}/spriteFrame`,
                SpriteFrame,
                (err, spriteFrame: SpriteFrame) => {
                    if (err) return;
                    if (!self.isValid) return;
                    btn.hoverSprite = spriteFrame;
                },
            );
        }

        if (self._urlDisable != null && self._urlDisable.length > 0) {
            i18.getRes(
                `${self._urlDisable}/spriteFrame`,
                SpriteFrame,
                (err, spriteFrame: SpriteFrame) => {
                    if (err) return;
                    if (!self.isValid) return;
                    btn.disabledSprite = spriteFrame;
                },
            );
        }
    }

    getUrls() {
        const self = this;
        const arrUrl = [];

        if (self._urlNor != null && self._urlNor.length > 0)
            arrUrl.push(self._urlNor);

        if (self._urlPressed != null && self._urlPressed.length > 0)
            arrUrl.push(self._urlPressed);

        if (self._urlHover != null && self._urlHover.length > 0)
            arrUrl.push(self._urlHover);

        if (self._urlDisable != null && self._urlDisable.length > 0)
            arrUrl.push(self._urlDisable);

        return arrUrl;
    }

    protected onDestroy(): void {
        const self = this;
        offEvent(self);
    }
}
