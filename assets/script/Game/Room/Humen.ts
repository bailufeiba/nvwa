import { _decorator, Label, Sprite } from "cc";
import { BaseComponent } from "../../Common/BaseComponent";
import { txt } from "../../i18/TxtMgr";
const { ccclass, property } = _decorator;
@ccclass(`Humen`)
export default class Humen extends BaseComponent {
    @property({ type: Sprite, visible: true })
    _icon: Sprite | null = null;

    @property({ type: Label, visible: true })
    _lbTip: Label | null = null;

    protected onInit(): void {
        const self = this;
        self._icon!.node.active = false;
        self._lbTip!.node.active = false;
        self._lbTip!.string = txt(`room_name_ren`);
    }

    public leaveRoom() {
        const self = this;
        self._icon!.node.active = false;
        self._lbTip!.node.active = false;
    }

    public enterRoom() {
        const self = this;
        self._icon!.node.active = true;
        self._lbTip!.node.active = true;
    }

    protected onDeinit(): void {}
}
