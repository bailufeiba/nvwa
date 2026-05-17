import { _decorator, Font, Label } from "cc";

import { I18Cmpt } from "./I18Cmpt";
import I18Mgr from "./I18Mgr";

const { ccclass } = _decorator;

@ccclass(`I18Font`)
export class I18Font extends I18Cmpt {
    refresh() {
        const self = this;
        if (self._key == ``) return;

        const lb = self.node.getComponent(Label);
        if (lb == null) return;
        if (lb.useSystemFont) return;

        I18Mgr.Inst.getRes(self._key, Font, (err, font) => {
            if (err) return;
            if (!self.isValid) return;
            lb.font = font;
            lb.updateRenderData(true);
        });
    }
}
