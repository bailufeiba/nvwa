import { Singleton } from "../../Common/Singleton";
import { EMonsterType } from "../GameDefine";
import Utils from "../Utils";

export class MonsterBaseAttr {
    type: EMonsterType = EMonsterType.None;
    hp: number = 0;
    attack: number = 0;
}

export default class AttrBuilder extends Singleton<AttrBuilder>() {
    private _arrMonsterBaseAttr: Array<MonsterBaseAttr> = [
        { type: EMonsterType.YeZhu, hp: 40, attack: 3 },
        { type: EMonsterType.ShiXiang, hp: 30, attack: 5 },
        { type: EMonsterType.ZhuZai, hp: 20, attack: 10 },
        { type: EMonsterType.BaoJun, hp: 20, attack: 10 },
        { type: EMonsterType.ZhouWang, hp: 1500, attack: 20 },
        { type: EMonsterType.ChiYou, hp: 3000, attack: 50 },
        { type: EMonsterType.GongGong, hp: 6000, attack: 100 }
    ];

    //根据怪物类型、层数和难度获得怪物属性
    public getMonsterAttr(
        type: EMonsterType,
        floor: number,
        hard: number = 0
    ): MonsterBaseAttr | null {
        const self = this;
        const baseAttr = self.getMonsterAttrWithFloor(type, floor);
        if (baseAttr == null) return null;

        if (hard > 0) {
            //TODO 难度增加属性
        }

        return baseAttr;
    }

    //根据层数获得怪物属性
    public getMonsterAttrWithFloor(
        type: EMonsterType,
        floor: number
    ): MonsterBaseAttr | null {
        const self = this;
        const baseAttr = self.getMonsterBaseAttr(type);
        if (baseAttr == null) return null;

        //BOSS怪物属性不随层数增加
        if (
            baseAttr.type == EMonsterType.ZhouWang ||
            baseAttr.type == EMonsterType.ChiYou ||
            baseAttr.type == EMonsterType.GongGong
        ) {
            return baseAttr;
        }

        let addHp = 0;
        let addAttack = 0;

        //1~20层，每层增加2点HP
        addHp += (Math.min(20, floor) - 1) * 2;
        if (floor <= 20) {
            baseAttr.hp += addHp;
            baseAttr.attack += addAttack;
            return baseAttr;
        }

        //21~100层，每层增加3点HP，每10层增加2点攻击
        addHp += (Math.min(100, floor) - 20) * 3;
        addAttack += Math.floor((Math.min(100, floor) - 20) / 10) * 2;
        if (floor <= 100) {
            baseAttr.hp += addHp;
            baseAttr.attack += addAttack;
            return baseAttr;
        }

        //101~200层，每层增加5点HP，每10层增加2点攻击
        addHp += (Math.min(200, floor) - 100) * 5;
        addAttack += Math.floor((Math.min(200, floor) - 100) / 10) * 2;
        if (floor <= 200) {
            baseAttr.hp += addHp;
            baseAttr.attack += addAttack;
            return baseAttr;
        }

        //201~300层，每层增加8点HP，每10层增加3点攻击
        addHp += (Math.min(300, floor) - 200) * 8;
        addAttack += Math.floor((Math.min(300, floor) - 200) / 10) * 3;
        baseAttr.hp += addHp;
        baseAttr.attack += addAttack;
        return baseAttr;
    }

    //怪物基础属性
    public getMonsterBaseAttr(type: EMonsterType): MonsterBaseAttr | null {
        const self = this;
        const attr = self._arrMonsterBaseAttr.find((attr) => attr.type == type);
        if (!attr) {
            return null;
        }

        return Utils.clone(attr);
    }
}
