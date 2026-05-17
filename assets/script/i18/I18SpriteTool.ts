import { Sprite, SpriteFrame } from "cc";

import { I18Cmpt } from "./I18Cmpt";
import I18Mgr from "./I18Mgr";

export default class I18SpriteTool {
    static changeI18SpriteFrame(
        sprite: Sprite,
        spriteFrame: SpriteFrame,
        callback?: Function,
    ) {
        const i18 = sprite.node.getComponent(I18Cmpt);
        if (i18 == null) {
            sprite.spriteFrame = spriteFrame;
            return;
        }

        let i18Name =
            i18.key.substring(0, i18.key.lastIndexOf(`/`) + 1) +
            spriteFrame.name;
        I18SpriteTool.changeSpriteFrame(sprite, i18Name, spriteFrame, callback);
    }

    static changeSpriteFrame(
        sprite: Sprite,
        url: string,
        defaultSpriteFrame?: SpriteFrame,
        callback?: Function,
    ) {
        I18Mgr.Inst.getRes(
            `${url}/spriteFrame`,
            SpriteFrame,
            (err, i18SpriteFrame) => {
                if (!sprite.isValid) return;
                if (err) {
                    if (defaultSpriteFrame) {
                        sprite.spriteFrame = defaultSpriteFrame;
                    }
                } else {
                    sprite.spriteFrame = i18SpriteFrame;
                }
                sprite.sizeMode = Sprite.SizeMode.RAW;
                sprite.trim = false;
                if (callback) {
                    callback();
                }
            },
        );
    }
}
