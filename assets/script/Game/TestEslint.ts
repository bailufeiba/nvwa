import { color } from "cc";
import {
    EAttrType,
    ERoomColorType,
    ERoomType,
    ESuiPianType,
    EZhuFuType
} from "./GameDefine";

enum ETest {
    Test1,
    Test2,
    Test3
}

const TestObj = {
    None: color(255, 255, 255, 255),
    Blue: color(176, 221, 240, 255),
    Red: color(250, 217, 212, 255),
    Gray: color(220, 220, 220, 255),
    Yellow: color(255, 242, 205, 255)
};

export default class TestEslint {
    private _e: ETest = ETest.Test1;
    private _obj = TestObj;

    private _allSuiPian = [
        ESuiPianType.ShenNong,
        ESuiPianType.YaoJi,
        ESuiPianType.JingWei,
        ESuiPianType.ChangQin,
        ESuiPianType.ShaoHao,
        ESuiPianType.TaiYi,
        ESuiPianType.JiGong
    ];

    private _roomType: ERoomType = ERoomType.ShengJi;
    private _zhufuType: EZhuFuType = EZhuFuType.FuXi;
    private _suiPianType: ESuiPianType = ESuiPianType.ShenNong;
    private _attrType: EAttrType = EAttrType.None;
    private _colorType: ERoomColorType = ERoomColorType.None;

    public testFunc(
        param1: number,
        param2: number,
        param3: number,
        param4: number
    ) {}
}
