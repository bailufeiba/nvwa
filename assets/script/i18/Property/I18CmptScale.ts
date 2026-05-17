import { _decorator } from "cc";
import { Vec3 } from "cc";
import { v3 } from "cc";

import { I18CmptPropertyBase, I18PropertyBase } from "./I18CmptProperty";

const { ccclass, property } = _decorator;

@ccclass(`I18Scale`)
class I18Scale extends I18PropertyBase {
    @property
    scale: Vec3 = v3(1, 1, 1);
}

@ccclass(`I18CmptScale`)
export class I18CmptScale extends I18CmptPropertyBase {
    @property({ type: [I18Scale], visible: true })
    _property: Array<I18Scale> = [];

    onChangeProperty(proty: I18PropertyBase) {
        const self = this;
        const scale = (proty as I18Scale).scale;
        self.node.scale = scale;
    }
}
