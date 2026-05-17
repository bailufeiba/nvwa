export default class GameData extends Singleton<GameData>() {
    private _timeSpeed: number = 1;

    public get timeSpeed(): number {
        return this._timeSpeed;
    }

    public set timeSpeed(value: number) {
        this._timeSpeed = value;
    }

    public getSpeedValue(value: number): number {
        return value / this._timeSpeed;
    }
}
