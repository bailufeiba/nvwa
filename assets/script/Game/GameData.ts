import { Singleton } from "../Common/Singleton";

export default class GameData extends Singleton<GameData>() {
    private _timeSpeed: number = 1;
    private _floor: number = 1;
    private _hard: number = 0;

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
        this._floor = value;
    }

    public get hard(): number {
        return this._hard;
    }

    public set hard(value: number) {
        this._hard = value;
    }
}
