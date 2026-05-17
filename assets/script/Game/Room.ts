import { _decorator, Component, Label, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Room')
export class Room extends Component {

    @property({ type: Sprite, visible: true })
    _bg: Sprite | null = null;

    @property({ type: Label, visible: true })
    _lbName: Label | null = null;

    @property({ type: Label, visible: true })
    _lbHp: Label | null = null;

    @property({ type: Label, visible: true })
    _lbAttack: Label | null = null;


    public set name(name: string) {
        const self = this;
        self._lbName!.string = name;
    }

    public set hp(hp: number) {
        const self = this;
        self._lbHp!.string = `${hp}`;
    }

    public set attack(attack: number) {
        const self = this;
        self._lbAttack!.string = `${attack}`;
    }

}


