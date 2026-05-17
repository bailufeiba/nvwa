import { _decorator } from "cc";
import LouTi from "./Room/LouTi";
import { BaseView } from "../Common/BaseView";

const { ccclass, property } = _decorator;
@ccclass(`GameView`)
export default class GameScene extends BaseView {
    @property({ type: LouTi, visible: true })
    _louTi: LouTi | null = null;

    protected start(): void {
        const self = this;
        self._louTi!.doUp(() => {
            console.log(`up end`);
        });
    }
}
