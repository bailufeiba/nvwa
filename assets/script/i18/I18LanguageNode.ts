import { Component } from "cc";
import { _decorator } from "cc";

import EventCenter from "../kernel/core/event/EventCenter";
import I18Mgr from "./I18Mgr";

const { ccclass, property } = _decorator;
@ccclass('I18LanguageNode')
export class I18LanguageNode extends Component {

    @property({visible: true})
    _language: string = "";

    protected onLoad(): void {
        const self = this;
        EventCenter.getInstance().listen( "I18BundleReady", self.onI18BundleReady, self );
        self.checkActive();
    }

    onI18BundleReady(){
        this.checkActive();
    }

    checkActive(){
        const self = this;
        const language = I18Mgr.getInstance().getCurrBundleName();
        self.node.active = self._language == language;
    }

    protected onDestroy(): void {
        EventCenter.getInstance().removeByTarget( this );
    }

}