import { _decorator } from "cc";
import LouTi from "./Room/LouTi";
import { BaseView } from "../Common/BaseView";
import MapBuilder from "./Room/MapBuilder";
import { Room } from "./Room/Room";
import GameData from "./GameData";

const { ccclass, property } = _decorator;
@ccclass(`GameView`)
export default class GameView extends BaseView {
    @property({ type: LouTi, visible: true })
    _louTi: LouTi | null = null;

    @property({ type: Room, visible: true })
    _room: Room[] = [];

    protected start(): void {
        const self = this;
        self._louTi!.doUp(() => {
            console.log(`up end`);
        });
    }

    public initRoom() {
        const self = this;

        const map = MapBuilder.Inst.getMap(GameData.Inst.floor);
        console.log(`map: `, map);

        for (let i = 0; i < self._room.length; ++i) {
            self._room[i].roomInfo = map[i];
        }
    }
}
