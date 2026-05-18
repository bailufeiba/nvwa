import { Singleton } from "../Common/Singleton";
import {
    EStorageKey,
    ESuiPianType,
    EZhuFuType,
    GongPinValue,
    SuiPianValue,
} from "./GameDefine";
import StorageMgr from "../Common/Storage/StorageMgr";

export class UserData extends Singleton<UserData>() {
    private _load: boolean = false;

    private _gold: number = 0;
    private _gongPin: number = 0;
    private _arrZhuFu: Array<GongPinValue> = [];
    private _arrSuiPian: Array<SuiPianValue> = [];

    constructor() {
        super();
        const self = this;
        self.loadData();
    }

    public get gold() {
        return this._gold;
    }

    public set gold(value: number) {
        const self = this;
        if (self._gold == value) return;
        self._gold = value;
        self.writeGold();
    }

    private loadData() {
        const self = this;
        if (self._load) return;
        self._load = true;

        self.loadGold();

        self.loadGongPin();
        if (!self.loadZhuFu()) {
            self.initZhuFu();
        }

        if (!self.loadSuiPian()) {
            self.initSuiPian();
        }
    }

    public get gongPin() {
        return this._gongPin;
    }

    public set gongPin(value: number) {
        const self = this;
        if (self._gongPin != value) {
            self._gongPin = value;
            self.writeGongPin();
        }
    }

    private loadGongPin() {
        const self = this;
        const str = StorageMgr.Inst.getUserData(EStorageKey.GongPin);
        self._gongPin = str ? +str : 0;
    }

    private writeGongPin() {
        StorageMgr.Inst.setUserData(EStorageKey.GongPin, this._gongPin);
    }

    private loadGold() {
        const self = this;
        const str = StorageMgr.Inst.getUserData(EStorageKey.UserData);
        self._gold = str ? +str : 0;
    }

    private writeGold() {
        const self = this;
        StorageMgr.Inst.setUserData(EStorageKey.Gold, self._gold);
    }

    public getAllZhuFu() {
        return this._arrZhuFu;
    }

    public getZhuFu(type: EZhuFuType) {
        const self = this;
        for (const gongPin of self._arrZhuFu) {
            if (gongPin.type == type) {
                return gongPin.value;
            }
        }
        return 0;
    }

    public setZhuFu(type: EZhuFuType, value: number) {
        const self = this;

        let bFound = false;
        for (const gongPin of self._arrZhuFu) {
            if (gongPin.type == type) {
                gongPin.value = value;
                bFound = true;
                break;
            }
        }

        if (bFound) {
            self.writeZhuFu();
        }
    }

    private loadZhuFu() {
        const self = this;
        const str = StorageMgr.Inst.getUserData(EStorageKey.ZhuFu);
        if (str == null) return false;

        const arr = str.split(`|`);
        if (arr.length != 8) return false;

        self._arrZhuFu = [];
        for (const subStr of arr) {
            const rate = GongPinValue.deserialization(subStr);
            if (rate == null) return false;

            self._arrZhuFu.push(rate);
        }
        return true;
    }

    private writeZhuFu() {
        const self = this;
        if (self._arrZhuFu.length != 8) return;

        let str = ``;
        for (let i = 0; i < self._arrZhuFu.length - 1; ++i) {
            str += `${self._arrZhuFu[i].serialization()}|`;
        }
        str += self._arrZhuFu[self._arrZhuFu.length - 1];

        StorageMgr.Inst.setUserData(EStorageKey.ZhuFu, str);
    }

    private initZhuFu() {
        const self = this;
        self._arrZhuFu = [];

        const fuxi = new GongPinValue();
        fuxi.type = EZhuFuType.FuXi;
        fuxi.value = 1;
        self._arrZhuFu.push(fuxi);

        const change = new GongPinValue();
        change.type = EZhuFuType.ChangE;
        change.value = 1;
        self._arrZhuFu.push(change);

        const houyi = new GongPinValue();
        houyi.type = EZhuFuType.HouYi;
        houyi.value = 1;
        self._arrZhuFu.push(houyi);

        const pangu = new GongPinValue();
        pangu.type = EZhuFuType.PanGu;
        pangu.value = 1;
        self._arrZhuFu.push(pangu);

        const long = new GongPinValue();
        long.type = EZhuFuType.QingLong;
        long.value = 1;
        self._arrZhuFu.push(long);

        const hu = new GongPinValue();
        hu.type = EZhuFuType.BaiHu;
        hu.value = 1;
        self._arrZhuFu.push(hu);

        const que = new GongPinValue();
        que.type = EZhuFuType.ZhuQue;
        que.value = 1;
        self._arrZhuFu.push(que);

        const gui = new GongPinValue();
        gui.type = EZhuFuType.XuanWu;
        gui.value = 1;
        self._arrZhuFu.push(gui);
    }

    public getAllSuiPian() {
        return this._arrSuiPian;
    }

    public getSuiPian(type: ESuiPianType) {
        const self = this;
        for (const suiPian of self._arrSuiPian) {
            if (suiPian.type == type) {
                return suiPian.value;
            }
        }
        return 0;
    }

    public setSuiPian(type: ESuiPianType, value: number) {
        const self = this;
        for (const suiPian of self._arrSuiPian) {
            if (suiPian.type == type) {
                suiPian.value = value;
                self.writeSuiPian();
                break;
            }
        }
    }

    private loadSuiPian() {
        const self = this;
        const str = StorageMgr.Inst.getUserData(EStorageKey.SuiPian);
        if (str == null) return false;

        const arr = str.split(`|`);
        if (arr.length != 7) return false;

        self._arrSuiPian = [];
        for (const subStr of arr) {
            const rate = SuiPianValue.deserialization(subStr);
            if (rate == null) return false;

            self._arrSuiPian.push(rate);
        }
        return true;
    }

    private writeSuiPian() {
        const self = this;
        if (self._arrSuiPian.length != 7) return;

        let str = ``;
        for (let i = 0; i < self._arrSuiPian.length - 1; ++i) {
            str += `${self._arrSuiPian[i].serialization()}|`;
        }
        str += self._arrSuiPian[self._arrSuiPian.length - 1];

        StorageMgr.Inst.setUserData(EStorageKey.SuiPian, str);
    }

    private initSuiPian() {
        const self = this;
        self._arrSuiPian = [];

        const shenNong = new SuiPianValue();
        shenNong.type = ESuiPianType.ShenNong;
        shenNong.value = 0;
        self._arrSuiPian.push(shenNong);

        const yaoji = new SuiPianValue();
        yaoji.type = ESuiPianType.YaoJi;
        yaoji.value = 0;
        self._arrSuiPian.push(yaoji);

        const jingWei = new SuiPianValue();
        jingWei.type = ESuiPianType.JingWei;
        jingWei.value = 0;
        self._arrSuiPian.push(jingWei);

        const changQin = new SuiPianValue();
        changQin.type = ESuiPianType.ChangQin;
        changQin.value = 0;
        self._arrSuiPian.push(changQin);

        const shaoHao = new SuiPianValue();
        shaoHao.type = ESuiPianType.ShaoHao;
        shaoHao.value = 0;
        self._arrSuiPian.push(shaoHao);

        const taiYi = new SuiPianValue();
        taiYi.type = ESuiPianType.TaiYi;
        taiYi.value = 0;
        self._arrSuiPian.push(taiYi);

        const jiGong = new SuiPianValue();
        jiGong.type = ESuiPianType.JiGong;
        jiGong.value = 0;
        self._arrSuiPian.push(jiGong);
    }
}
