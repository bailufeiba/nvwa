import { Singleton } from "../../Common/Singleton";
import {
    EMonsterType,
    ERoomColorType,
    ERoomType,
    ESuiPianType,
    EZhuFuType,
    RoomInfo
} from "../GameDefine";
import { UserData } from "../UserData";
import Utils from "../Utils";
import { RoomRate } from "./RoomRate";

class RoomRateData {
    info: RoomInfo | null = null;
    minValue: number = 0;
    maxValue: number = 0;
}

class ZhuFuRateData {
    type: EZhuFuType = EZhuFuType.None;
    minValue: number = 0;
    maxValue: number = 0;
}

export default class MapBuilder extends Singleton<MapBuilder>() {
    _arrRoomRate: Array<Array<RoomRateData>> = [[], [], []];
    _arrZhuFuRate: Array<ZhuFuRateData> = [];

    constructor() {
        super();
        const self = this;
        self.init();
    }

    public init() {
        const self = this;
        self.initRoom();
        self.initZhuFuRate();
    }

    public getMap(floor: number): RoomInfo[] {
        const self = this;
        const map: Array<RoomInfo> = [];
        for (let i = 0; i < self._arrRoomRate.length; ++i) {
            const info = self.randRoom(i)!;
            if (info.type == ERoomType.ZhuFu) {
                info.id = self.randZhuFu();
            } else if (info.type == ERoomType.SuiPian) {
                info.id = self.randSuiPian();
                info.id2 = 1;
            }
            map.push(info);
        }
        return map;
    }

    public initRoom() {
        const self = this;
        for (let i = 0; i < self._arrRoomRate.length; ++i) {
            self.initRoomRate(self._arrRoomRate[i], i);
        }
    }

    public randRoom(idx: number) {
        const self = this;
        if (idx < 0 || idx >= self._arrRoomRate.length) return null;

        const lastData =
            self._arrRoomRate[idx][self._arrRoomRate[idx].length - 1];
        const value = lastData.maxValue;
        const rand = Math.random() * value;

        for (const data of self._arrRoomRate[idx]) {
            if (data.minValue > rand) continue;
            if (data.maxValue < rand) continue;
            return data.info;
        }
        return null;
    }

    public initRoomRate(arr: Array<RoomRateData>, idx: number) {
        const self = this;
        arr.splice(0, arr.length);

        let curMax = 0;
        let curMin = curMax;
        curMax += RoomRate.ZhuFu[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.ZhuFu,
                ERoomColorType.Yellow,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.ShangDian[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.ShangDian,
                ERoomColorType.Yellow,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.GouHuo[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GouHuo,
                ERoomColorType.Yellow,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.JinBi[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.JinBi,
                ERoomColorType.Yellow,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.ShengJi[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.ShengJi,
                ERoomColorType.Yellow,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.KongDi[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.None,
                ERoomColorType.None,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.SuiPian[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.SuiPian,
                ERoomColorType.Yellow,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.GongPin[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GongPin,
                ERoomColorType.Yellow,
                0,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.BlueYeZhu[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GuaiWu,
                ERoomColorType.Blue,
                EMonsterType.YeZhu,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.RedYeZhu[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GuaiWu,
                ERoomColorType.Red,
                EMonsterType.YeZhu,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.BlueShiXiang[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GuaiWu,
                ERoomColorType.Blue,
                EMonsterType.ShiXiang,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.RedShiXiang[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GuaiWu,
                ERoomColorType.Red,
                EMonsterType.ShiXiang,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.GrayBaoJun[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GuaiWu,
                ERoomColorType.Gray,
                EMonsterType.BaoJun,
                curMin,
                curMax
            )
        );

        curMin = curMax;
        curMax += RoomRate.GrayZhuZai[idx];
        arr.push(
            self.buildRoomData(
                ERoomType.GuaiWu,
                ERoomColorType.Gray,
                EMonsterType.ZhuZai,
                curMin,
                curMax
            )
        );
    }

    public buildRoomData(
        type: ERoomType,
        color: ERoomColorType,
        id: number,
        min: number,
        max: number
    ) {
        const info = new RoomInfo();
        info.type = type;
        info.id = id;
        info.id2 = 0;
        info.colorType = color;
        info.color = Utils.getRoomColor(color);

        const data = new RoomRateData();
        data.info = info;
        data.minValue = min;
        data.maxValue = max;
        return data;
    }

    public initZhuFuRate() {
        const self = this;

        const allZhuFu = UserData.Inst.getAllZhuFu();
        self._arrZhuFuRate = [];
        let minValue = 0;
        let maxValue = minValue;
        for (const zhufu of allZhuFu) {
            const rate = new ZhuFuRateData();
            rate.type = zhufu.type;
            rate.minValue = minValue;
            rate.maxValue = maxValue;
            self._arrZhuFuRate.push(rate);

            minValue = maxValue;
            maxValue += zhufu.value;
        }
    }

    public randZhuFu() {
        const self = this;
        const value =
            Math.random() *
            self._arrZhuFuRate[self._arrZhuFuRate.length - 1].maxValue;
        for (const rate of self._arrZhuFuRate) {
            if (rate.minValue > value) continue;
            if (rate.maxValue < value) continue;
            return rate.type;
        }
        return EZhuFuType.None;
    }

    public randSuiPian() {
        const allSuiPian = [
            ESuiPianType.ShenNong,
            ESuiPianType.YaoJi,
            ESuiPianType.JingWei,
            ESuiPianType.ChangQin,
            ESuiPianType.ShaoHao,
            ESuiPianType.TaiYi,
            ESuiPianType.JiGong
        ];
        const idx = Math.floor(Math.random() * allSuiPian.length);
        return allSuiPian[idx];
    }
}
