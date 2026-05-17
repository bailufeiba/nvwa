import {
    _decorator,
    Component,
    isValid,
    Label,
    resources,
    Sprite,
    SpriteFrame,
} from "cc";
import { RoomInfo } from "../GameDefine";
import ResPath from "../ResPath";
import Utils from "../Utils";

const { ccclass, property } = _decorator;
@ccclass(`Room`)
export class Room extends Component {
    @property({ type: Sprite, visible: true })
    _bg: Sprite | null = null;

    @property({ type: Sprite, visible: true })
    _icon: Sprite | null = null;

    @property({ type: Label, visible: true })
    _lbName: Label | null = null;

    @property({ type: Label, visible: true })
    _lbHp: Label | null = null;

    @property({ type: Label, visible: true })
    _lbAttack: Label | null = null;

    private _roomInfo: RoomInfo | null = null;

    public set name(name: string) {
        const self = this;
        self._lbName!.string = name;
    }

    public set hp(hp: number) {
        const self = this;
        self._lbHp!.string = `${hp}`;
    }

    public set attack(attack: number) {
        const self = this;
        self._lbAttack!.string = `${attack}`;
    }

    public get roomInfo(): RoomInfo | null {
        return this._roomInfo;
    }

    public set roomInfo(info: RoomInfo) {
        const self = this;
        self._roomInfo = info;
        self.updateRoomIcon();
        self.updateRoomColor();
        self.updateRoomName();
    }

    private updateRoomIcon() {
        const self = this;
        if (!self._roomInfo) {
            self._icon!.spriteFrame = null;
            return;
        }

        const res = ResPath.getRes(
            self._roomInfo.type,
            self._roomInfo.id,
            self._roomInfo.id2,
        );
        resources.load(res, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                console.warn(`Room updateRoomIcon load res:${res} failed!`);
                return;
            }

            if (!self.isValid || !isValid(self._icon)) return;
            self._icon!.spriteFrame = spriteFrame;
        });
    }

    private updateRoomColor() {
        const self = this;
        self._bg!.color = Utils.getRoomColor(self._roomInfo!.colorType);
    }

    private updateRoomName() {
        const self = this;
        self.showRoomName(Utils.getRoomName(self._roomInfo!));
    }

    public showRoomName(name: string) {
        const self = this;
        self._lbName!.string = name;
    }
}
