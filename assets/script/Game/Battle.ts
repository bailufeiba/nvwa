import { Singleton } from "../Common/Singleton";
import GameData from "./GameData";
import { Room } from "./Room/Room";

enum EBattleState {
    None,
    Fight
}

export default class Battle extends Singleton<Battle>() {
    private _room: Room[] = [];
    private _roomIdx: number = -1;

    constructor() {
        super();
        const self = this;
    }

    public setRooms(rooms: Room[]) {
        const self = this;
        self._room = rooms;
        self._roomIdx = -1;
    }

    private _battleTimer: number = 0;
    private _lastUpdateTime: number = 0;
    private _updateInterval: number = 0.3;
    private startActionBattle() {
        const self = this;
        self.stopActionBattle();

        const interval = GameData.Inst.getSpeedValue(self._updateInterval);
        self._lastUpdateTime = Date.now() / 1000;
        self._battleTimer = setInterval(() => {
            const now = Date.now() / 1000;
            const dt = now - self._lastUpdateTime;
            self._lastUpdateTime = now;
            self.update(dt);
        }, interval);
    }

    private stopActionBattle() {
        const self = this;
        if (self._battleTimer != 0) {
            clearInterval(self._battleTimer);
            self._battleTimer = 0;
        }
    }

    private update(dt: number) {}
}
