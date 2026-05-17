import { _decorator } from "cc";
import { BaseComponent } from "../Common/BaseComponent";
import LouTi from "./LouTi";

const { ccclass, property } = _decorator;
@ccclass(`GameScene`)
export default class GameScene extends BaseComponent {
    @property({ type: LouTi, visible: true })
    _louTi: LouTi | null = null;

    protected start(): void {
        const self = this;
        self._louTi!.doUp(() => {
            console.log(`up end`);
        });
    }
}
