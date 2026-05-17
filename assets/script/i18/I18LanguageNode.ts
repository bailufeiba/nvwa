import { Component } from "cc";
import { _decorator } from "cc";

import I18Mgr from "./I18Mgr";
import { offEvent, onEvent } from "../Common/EventManager";

const { ccclass, property } = _decorator;
@ccclass(`I18LanguageNode`)
export class I18LanguageNode extends Component {
    @property({ visible: true })
    _language: string = ``;

    protected onLoad(): void {
        const self = this;
        onEvent(`I18BundleReady`, self, self.onI18BundleReady);
        self.checkActive();
    }

    onI18BundleReady() {
        this.checkActive();
    }

    checkActive() {
        const self = this;
        const language = I18Mgr.Inst.getCurrBundleName();
        self.node.active = self._language == language;
    }

    protected onDestroy(): void {
        offEvent(this);
    }
}
