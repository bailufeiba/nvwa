import { _decorator } from "cc";
import { Label } from "cc";

import { I18CmptPropertyBase, I18PropertyBase } from "./I18CmptProperty";

const { ccclass, property } = _decorator;

@ccclass('I18Font')
class I18FontSize extends I18PropertyBase {
    @property
    fontSize: number = 20;

    @property
    lineHeight: number = 24;
}

@ccclass('I18CmptFontSize')
export class I18CmptFontSize extends I18CmptPropertyBase {

    @property({ type:[I18FontSize], visible: true })
    _property :Array<I18FontSize> = [];

    onChangeProperty( proty: I18PropertyBase ){
        const self = this;
        
        const lb = self.node.getComponent(Label);
        if( lb == null ) return;

        lb.fontSize = (proty as I18FontSize).fontSize;
        lb.lineHeight = (proty as I18FontSize).lineHeight;
    }

}