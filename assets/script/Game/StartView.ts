import { _decorator } from "cc";
import { BaseComponent } from "../Common/BaseComponent";
import { EventName } from "./EventID";

const { ccclass, property } = _decorator;
@ccclass(`StartView`)
export default class StartView extends BaseComponent {
    onBtnStart() {
        const self = this;
        self.emitEvent(EventName.StartGame);
    }
}
