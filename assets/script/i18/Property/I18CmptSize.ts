import { _decorator } from "cc";
import { Size } from "cc";
import { size } from "cc";
import { UITransform } from "cc";

import { I18CmptPropertyBase, I18PropertyBase } from "./I18CmptProperty";

const { ccclass, property } = _decorator;

@ccclass('I18Size')
class I18Size extends I18PropertyBase {
    @property({type:Size, tooltip: "宽高"})
    size: Size = size( 0, 0 );
}

@ccclass('I18CmptSize')
export class I18CmptSize extends I18CmptPropertyBase {

    @property({ type:[I18Size], visible: true })
    _property :Array<I18Size> = [];

    onChangeProperty( proty: I18PropertyBase ){
        const self = this;
        const uiTrans = self.node.getComponent(UITransform);
        if( !uiTrans ) return;

        const sz = (proty as I18Size).size;
        uiTrans.contentSize = size( sz.width, sz.height );
    }

}