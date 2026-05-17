import { _decorator, Label } from "cc";
import { BaseComponent } from "./BaseComponent";
import { EventName } from "../Game/EventID";

const { ccclass, property } = _decorator;
@ccclass(`ViewTop`)
export class ViewTop extends BaseComponent {
    @property({ type: Label, visible: true })
    _lbTitle: Label | null = null;

    @property({ type: Label, visible: true })
    _lbDesc: Label | null = null;

    public set title(value: string) {
        const self = this;
        self._lbTitle!.string = value;
    }

    public set desc(value: string) {
        const self = this;
        self._lbDesc!.string = value;
    }

    onBtnClose() {
        const self = this;
        self.emitEvent(EventName.CloseView, self.node.parent);
    }
}
