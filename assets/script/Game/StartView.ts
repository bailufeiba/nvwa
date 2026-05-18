import { _decorator } from "cc";
import { BaseComponent } from "../Common/BaseComponent";
import { EventName } from "./EventID";
import GameData from "./GameData";

const { ccclass, property } = _decorator;
@ccclass(`StartView`)
export default class StartView extends BaseComponent {
    protected onLoad(): void {
        const self = this;
        GameData.Inst.floor = 1;
        GameData.Inst.hard = 0;
    }

    onBtnStart() {
        const self = this;
        self.emitEvent(EventName.StartGame);
    }
}
