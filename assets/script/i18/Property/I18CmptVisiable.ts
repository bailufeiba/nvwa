import { _decorator } from "cc";
import { Tween } from "cc";
import { tween } from "cc";

import { I18CmptPropertyBase, I18PropertyBase } from "./I18CmptProperty";

const { ccclass, property } = _decorator;

@ccclass('I18Visible')
class I18Visible extends I18PropertyBase {
    @property({tooltip: "显示"})
    active: boolean = true;
}

@ccclass('I18CmptVisiable')
export class I18CmptVisiable extends I18CmptPropertyBase {

    @property({ type:[I18Visible], visible: true })
    _property :Array<I18Visible> = [];

    _twActive: Tween = null;

    onChangeProperty( proty: I18PropertyBase ){
        const self = this;
        const active = (proty as I18Visible).active;
        self.stopActive();

        if( active ){
            self._twActive = tween(self.node).delay(0).show().start();
        }else{
            self._twActive = tween(self.node).delay(0).hide().start();
        }
    }

    stopActive(){
        const self = this;
        if( self._twActive ){
            self._twActive.stop();
            self._twActive = null;
        }
    }

}