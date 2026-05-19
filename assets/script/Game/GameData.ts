import { Singleton } from "../Common/Singleton";
import { GameConst, RoomInfo } from "./GameDefine";
import MapBuilder from "./Room/MapBuilder";

export default class GameData extends Singleton<GameData>() {
    private _timeSpeed: number = 1;
    private _floor: number = -1;
    private _hard: number = 0;
    private _roomInfo: RoomInfo[] = [];

    public get timeSpeed(): number {
        return this._timeSpeed;
    }

    public set timeSpeed(value: number) {
        this._timeSpeed = value;
    }

    public getSpeedValue(value: number): number {
        return value / this._timeSpeed;
    }

    public get floor(): number {
        return this._floor;
    }

    public set floor(value: number) {
        const self = this;

        value = Math.max(1, Math.min(GameConst.maxFloor, value));
        if (self._floor == value) return;

        self._floor = value;
        self.initRoomInfo(value);
    }

    public get hard(): number {
        return this._hard;
    }

    public set hard(value: number) {
        this._hard = value;
    }

    private initRoomInfo(floor: number) {
        const self = this;
        self._roomInfo.splice(0, self._roomInfo.length);
        const map = MapBuilder.Inst.getMap(floor);
        for (let i = 0; i < map.length; ++i) {
            self._roomInfo.push(map[i]);
        }
    }

    public resetGame() {
        const self = this;
        self._roomInfo.splice(0, self._roomInfo.length);
        self._floor = 1;
    }

    public resetAll() {
        const self = this;
        self.resetGame();
        self._hard = 0;
    }
}
