import { Color } from "cc";
import { txt } from "../i18/TxtMgr";
import {
    EMonsterType,
    ERoomColorType,
    ERoomType,
    EZhuFuType,
    RoomColor,
    RoomInfo,
} from "./GameDefine";

export default class Utils {
    public static getRoomName(roomInfo: RoomInfo): string {
        switch (roomInfo.type) {
            case ERoomType.None: //空地
                return txt(`room_name_none`);

            case ERoomType.ShengJi: //升级
                return txt(`room_name_shengji`);

            case ERoomType.JinBi: //金币
                return txt(`room_name_jinbi`);

            case ERoomType.SuiPian: //碎片
                return txt(`room_name_suipian`);

            case ERoomType.GongPin: //贡品
                return txt(`room_name_gongpin`);

            case ERoomType.GouHuo: //篝火
                return txt(`room_name_gouhuo`);

            case ERoomType.ShangDian: //商店
                return txt(`room_name_shangdian`);

            case ERoomType.ZhuFu: //祝福
                return Utils.getZhuFuName(roomInfo.id!);

            case ERoomType.Ren: //捏人
                return txt(`room_name_ren`);

            case ERoomType.GuaiWu: //怪物
                return Utils.getMonsterName(roomInfo.id!, roomInfo.colorType!);

            case ERoomType.ZhuFu: //祝福
                return Utils.getZhuFuName(roomInfo.id!);

            default:
                console.warn(
                    `Utils getRoomName type:${roomInfo.type} id:${roomInfo.id}, id2:${roomInfo.id2}, colorType:${roomInfo.colorType}`
                );
                return ``;
        }
    }

    public static getMonsterName(
        id: number,
        colorType: ERoomColorType
    ): string {
        switch (id) {
            case EMonsterType.YeZhu:
                return txt(
                    `color_monster`,
                    Utils.getMonsterColorStr(colorType),
                    txt(`monster_yezhu`)
                );
            case EMonsterType.ShiXiang:
                return txt(
                    `color_monster`,
                    Utils.getMonsterColorStr(colorType),
                    txt(`monster_shixiang`)
                );
            case EMonsterType.BaoJun:
                return txt(
                    `color_monster`,
                    Utils.getMonsterColorStr(colorType),
                    txt(`monster_baojun`)
                );
            case EMonsterType.ZhuZai:
                return txt(
                    `color_monster`,
                    Utils.getMonsterColorStr(colorType),
                    txt(`monster_zhuzai`)
                );

            case EMonsterType.ZhouWang:
                return txt(`monster_zhouwang`);
            case EMonsterType.ChiYou:
                return txt(`monster_chiyou`);
            case EMonsterType.GongGong:
                return txt(`monster_gonggong`);

            default:
                console.warn(
                    `Utils getMonsterName id:${id} colorType:${colorType}`
                );
                return ``;
        }
    }

    public static getMonsterColorStr(colorType: ERoomColorType): string {
        switch (colorType) {
            case ERoomColorType.Blue:
                return txt(`color_blue`);
            case ERoomColorType.Red:
                return txt(`color_red`);
            case ERoomColorType.Gray:
                return txt(`color_gray`);

            default:
                console.warn(`Utils getMonsterColorStr colorType:${colorType}`);
                return ``;
        }
    }

    public static getZhuFuName(id: number): string {
        switch (id) {
            case EZhuFuType.FuXi:
                return txt(`zhufu_fuxi`);
            case EZhuFuType.ChangE:
                return txt(`zhufu_change`);
            case EZhuFuType.HouYi:
                return txt(`zhufu_houyi`);
            case EZhuFuType.PanGu:
                return txt(`zhufu_pangu`);
            case EZhuFuType.QingLong:
                return txt(`zhufu_long`);
            case EZhuFuType.BaiHu:
                return txt(`zhufu_baihu`);
            case EZhuFuType.ZhuQue:
                return txt(`zhufu_zhuque`);
            case EZhuFuType.XuanWu:
                return txt(`zhufu_xuanwu`);

            default:
                console.warn(`Utils getZhuFuName id:${id}`);
                return ``;
        }
    }

    public static getRoomColor(colorType: ERoomColorType): Color {
        switch (colorType) {
            case ERoomColorType.None:
                return RoomColor.None;
            case ERoomColorType.Blue:
                return RoomColor.Blue;
            case ERoomColorType.Red:
                return RoomColor.Red;
            case ERoomColorType.Gray:
                return RoomColor.Gray;
            case ERoomColorType.Yellow:
                return RoomColor.Yellow;

            default:
                console.warn(`Utils getRoomColor colorType:${colorType}`);
                return RoomColor.None;
        }
    }

    /**
     * 深拷贝事件数据，避免分发重入时引用被外部修改。
     * @param obj 原对象
     */
    public static clone(obj: any) {
        if (Object.prototype.toString.call(obj) == `[object Object]`) {
            let newObj: any = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = Utils.clone(obj[key]);
                }
            }
            return newObj;
        } else if (Object.prototype.toString.call(obj) == `[object Array]`) {
            let newObj: any = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = Utils.clone(obj[key]);
                }
            }
            return newObj;
        }
        return obj;
    }
}
