import { _decorator } from "cc";
import LouTi from "./Room/LouTi";
import { BaseView } from "../Common/BaseView";
import MapBuilder from "./Room/MapBuilder";
import { Room } from "./Room/Room";
import GameData from "./GameData";
import Humen from "./Room/Humen";

const { ccclass, property } = _decorator;
@ccclass(`GameView`)
export default class GameView extends BaseView {
    @property({ type: Humen, visible: true })
    _humen: Humen | null = null;

    @property({ type: Room, visible: true })
    _room: Room[] = [];

    @property({ type: LouTi, visible: true })
    _louTi: LouTi | null = null;

    protected start(): void {
        const self = this;
        self._louTi!.doUp(() => {
            console.log(`up end`);
        });
    }

    public initRoom() {
        const self = this;

        self._humen!.enterRoom();

        const map = MapBuilder.Inst.getMap(GameData.Inst.floor);
        console.log(`map: `, map);

        for (let i = 0; i < self._room.length; ++i) {
            self._room[i].roomInfo = map[i];
        }
    }
}
