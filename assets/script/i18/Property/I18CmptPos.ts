import { _decorator } from "cc";
import { Vec2 } from "cc";
import { v2 } from "cc";
import { v3 } from "cc";

import { I18CmptPropertyBase, I18PropertyBase } from "./I18CmptProperty";

const { ccclass, property } = _decorator;

@ccclass(`I18Pos`)
class I18Pos extends I18PropertyBase {
    @property({ type: Vec2, tooltip: `位置` })
    pos: Vec2 = v2(0, 0);
}

@ccclass(`I18CmptPos`)
export class I18CmptPos extends I18CmptPropertyBase {
    @property({ type: [I18Pos], visible: true })
    _property: Array<I18Pos> = [];

    onChangeProperty(proty: I18PropertyBase) {
        const self = this;
        const pos = (proty as I18Pos).pos;
        self.node.setPosition(v3(pos.x, pos.y));
    }
}
