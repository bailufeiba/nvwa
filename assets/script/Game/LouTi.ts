import { _decorator, Component, Label, Sprite, SpriteFrame } from "cc";

const { ccclass, property } = _decorator;

@ccclass('LouTi')
export default class LouTi extends Component {

    @property({ type: Label, visible: true })
    _lbTip: Label | null = null;

    @property({ type: Sprite, visible: true })
    _img: Sprite | null = null;

    @property({ type: SpriteFrame, visible: true })
    _spriteFrames: SpriteFrame[] = [];

    @property({ type: SpriteFrame, visible: true })
    _defaultFrame: SpriteFrame | null = null;

    protected onLoad(): void {
        const self = this;
        self._img!.spriteFrame = self._defaultFrame!;
    }

}