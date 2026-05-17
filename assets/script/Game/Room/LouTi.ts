import { _decorator, Label, Sprite, SpriteFrame, Tween, tween } from "cc";

import { BaseComponent } from "../../Common/BaseComponent";
import GameData from "../GameData";

const { ccclass, property } = _decorator;

@ccclass(`LouTi`)
export default class LouTi extends BaseComponent {
    @property({ type: Label, visible: true })
    _lbTip: Label | null = null;

    @property({ type: Sprite, visible: true })
    _img: Sprite | null = null;

    @property({ type: SpriteFrame, visible: true })
    _spriteFrames: SpriteFrame[] = [];

    @property({ type: SpriteFrame, visible: true })
    _defaultFrame: SpriteFrame | null = null;

    private _twUp: Tween | null = null;
    private _twBlink: Tween | null = null;
    private _curIndex: number = -1;
    private _interval: number = 0.1;

    protected onInit(): void {
        const self = this;
        self._img!.spriteFrame = self._defaultFrame!;
        self._interval = GameData.Inst.getSpeedValue(0.1);
    }

    public doUp(callback?: Function) {
        const self = this;
        self.stopActionUp();
        self._curIndex = -1;
        self._twUp = tween(self)
            .call(() => {
                self.nextFrame(callback);
            })
            .delay(self._interval)
            .union()
            .repeatForever()
            .start();

        self._twBlink = tween(self)
            .call(() => {
                self._img!.node.active = true;
            })
            .delay(self._interval)
            .call(() => {
                self._img!.node.active = false;
            })
            .union()
            .repeatForever()
            .start();
    }

    private nextFrame(endCallback?: Function) {
        const self = this;
        self._curIndex++;
        if (self._curIndex >= self._spriteFrames.length) {
            self.stopActionUp();
            self._curIndex = -1;
            self._img!.spriteFrame = self._defaultFrame!;
            endCallback?.();
            return;
        }

        self._img!.spriteFrame = self._spriteFrames[self._curIndex];
    }

    private stopActionUp() {
        const self = this;
        if (self._twUp) {
            self._twUp.stop();
            self._twUp = null;
        }

        if (self._twBlink) {
            self._twBlink.stop();
            self._img!.node.active = true;
            self._twBlink = null;
        }
    }
}
