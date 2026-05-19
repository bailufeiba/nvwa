import { EMonsterType, ERoomType, EZhuFuType } from "./GameDefine";

export let ResDefine = {
    KongDi: `icon/ditu_kongdi`,
    ShengJi: `icon/ditu_shengji`,
    JinBi: `icon/ditu_jinbi`,
    SuiPian: `icon/ditu_suipian`,
    SuiPian2: `icon/ditu_suipian2`,
    GongPin: `icon/ditu_ongpin`,
    GouHuo: `icon/ditu_gouhuo`,
    ShangDian: `icon/ditu_shangdian`,
    NieRen: `icon/ren`,

    Monster_YeZhu: `icon/guai_yezhu`,
    Monster_ShiXiang: `icon/guai_shenxiang`,
    Monster_BaoJun: `icon/guai_baojun`,
    Monster_ZhuZai: `icon/guai_zhuzai`,
    Monster_ZhouWang: `icon/boss_zhouwang`,
    Monster_ChiYou: `icon/boss_chiyou`,
    Monster_GongGong: `icon/boss_gonggong`,

    Shen_FuXi: `icon/shen_fuxi`,
    Shen_FuXChangE: `icon/shen_change`,
    Shen_HouYi: `icon/shen_houyi`,
    Shen_PanGu: `icon/shen_pangu`,
    Shen_QingLong: `icon/shen_qinglong`,
    Shen_BaiHu: `icon/shen_baihu`,
    Shen_ZhuQue: `icon/shen_zhuque`,
    Shen_XuanWu: `icon/shen_xuanwu`
};

export default class ResPath {
    static getRes(type: ERoomType, id: number = 0, id2: number = 0): string {
        switch (type) {
            case ERoomType.None:
                return ResDefine.KongDi;

            case ERoomType.ShengJi:
                return ResDefine.ShengJi;

            case ERoomType.JinBi:
                return ResDefine.JinBi;

            case ERoomType.SuiPian:
                return ResPath.getSuiPian(id2 >= 1);

            case ERoomType.GongPin:
                return ResDefine.GongPin;

            case ERoomType.GouHuo:
                return ResDefine.GouHuo;

            case ERoomType.ShangDian:
                return ResDefine.ShangDian;

            case ERoomType.GuaiWu:
                return ResPath.getMonster(id, id2);

            case ERoomType.ZhuFu:
                return ResPath.getShen(id);

            case ERoomType.Ren:
                return ResPath.getNieRen();

            default:
                console.warn(`ResPath getRes id:${type} id2:${id}, id3:${id2}`);
                return ``;
        }
    }

    static getNieRen(): string {
        return ResDefine.NieRen;
    }

    static getSuiPian(got: boolean = false): string {
        return got ? ResDefine.SuiPian2 : ResDefine.SuiPian;
    }

    static getMonster(id: number, id2: number = 0): string {
        switch (id) {
            case EMonsterType.YeZhu:
                return ResDefine.Monster_YeZhu;
            case EMonsterType.ShiXiang:
                return ResDefine.Monster_ShiXiang;
            case EMonsterType.BaoJun:
                return ResDefine.Monster_BaoJun;
            case EMonsterType.ZhuZai:
                return ResDefine.Monster_ZhuZai;

            case EMonsterType.ZhouWang:
                return ResDefine.Monster_ZhouWang;
            case EMonsterType.ChiYou:
                return ResDefine.Monster_ChiYou;
            case EMonsterType.GongGong:
                return ResDefine.Monster_GongGong;

            default:
                console.warn(`ResPath getMonster id:${id} id2:${id2}`);
                return ``;
        }
    }

    static getShen(id: number): string {
        switch (id) {
            case EZhuFuType.FuXi:
                return ResDefine.Shen_FuXi;
            case EZhuFuType.ChangE:
                return ResDefine.Shen_FuXChangE;
            case EZhuFuType.HouYi:
                return ResDefine.Shen_HouYi;
            case EZhuFuType.PanGu:
                return ResDefine.Shen_PanGu;

            case EZhuFuType.QingLong:
                return ResDefine.Shen_QingLong;
            case EZhuFuType.BaiHu:
                return ResDefine.Shen_BaiHu;
            case EZhuFuType.ZhuQue:
                return ResDefine.Shen_ZhuQue;
            case EZhuFuType.XuanWu:
                return ResDefine.Shen_XuanWu;

            default:
                console.warn(`ResPath getShen id:${id}`);
                return ``;
        }
    }
}
