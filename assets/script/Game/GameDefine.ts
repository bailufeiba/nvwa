import { Color, color } from "cc";

export enum ERoomType {
    None = 0, //空地
    ShengJi, //升级
    JinBi, //金币
    SuiPian, //碎片
    GongPin, //贡品
    GouHuo, //篝火
    ShangDian, //商店
    GuaiWu, //野怪
    ZhuFu, //祝福
    Ren, //人
}

export enum EMonsterType {
    None = 0,
    YeZhu, //野猪
    ShiXiang, //石像
    BaoJun, //暴君
    ZhuZai, //主宰

    ZhouWang, //纣王
    ChiYou, //蚩尤
    GongGong, //共工
}

export enum EZhuFuType {
    None = 0,
    FuXi, //伏羲
    ChangE, //嫦娥
    HouYi, //后羿
    PanGu, //盘古
    QingLong, //青龙
    BaiHu, //白虎
    ZhuQue, //朱雀
    XuanWu, //玄武
}

export enum ESuiPianType {
    None = 0,
    ShenNong, //神农
    YaoJi, //瑶姬
    JingWei, //精卫
    ChangQin, //长琴
    ShaoHao, //少昊
    TaiYi, //太乙
    JiGong, //济公
}

export enum EAttrType {
    None = 0,
    Hp, //生命
    GongJi, //攻击
    HuiFu, //恢复
    BaoJi, //暴击效果
    BaoJiLv, //暴击率
    FuHuo, //复活
    GongPin, //贡品
    SuiPian, //碎片
    ZhuFu, //祝福
    JinBi, //金币
    JingYan, //经验
}

export enum ERoomColorType {
    None, //无
    Blue, //蔚蓝
    Red, //猩红
    Gray, //暗影
    Yellow, //奖励
}

export const RoomColor = {
    None: color(255, 255, 255, 255),
    Blue: color(176, 221, 240, 255),
    Red: color(250, 217, 212, 255),
    Gray: color(220, 220, 220, 255),
    Yellow: color(255, 242, 205, 255),
};

export class RoomInfo {
    type: ERoomType = ERoomType.None;
    id: number = 0;
    id2: number = 0;
    name: string = ``;
    colorType: ERoomColorType = ERoomColorType.None;
    color: Color = RoomColor.None;
}

export enum EStorageKey {
    UserData = `UserData`,
    Gold = `Gold`,
    SuiPian = `SuiPian`,
    GongPin = `GongPin`,
    ZhuFu = `ZhuFu`,
    ShangDian = `ShangDian`,
}

export class GongPinValue {
    type: EZhuFuType = EZhuFuType.None;
    value: number = 0;

    static deserialization(str: string) {
        const arr = str.split(`,`);
        if (arr.length != 2) return null;

        const type = +arr[0];
        if (type < EZhuFuType.FuXi || type > EZhuFuType.XuanWu) return null;

        const value = +arr[1];
        if (value < 0) return null;

        const obj = new GongPinValue();
        obj.type = type;
        obj.value = value;
        return obj;
    }

    serialization(obj?: GongPinValue) {
        if (obj == null) {
            obj = this;
        }
        return `${obj.type.toString()},${obj.value.toString()}`;
    }
}

export class SuiPianValue {
    type: ESuiPianType = ESuiPianType.None;
    value: number = 0;

    static deserialization(str: string) {
        const arr = str.split(`,`);
        if (arr.length != 2) return null;

        const type = +arr[0];
        if (type < ESuiPianType.ShenNong || type > ESuiPianType.JiGong)
            return null;

        const value = +arr[1];
        if (value < 0) return null;

        const obj = new SuiPianValue();
        obj.type = type;
        obj.value = value;
        return obj;
    }

    serialization(obj?: SuiPianValue) {
        if (obj == null) {
            obj = this;
        }
        return `${obj.type.toString()},${obj.value.toString()}`;
    }
}
