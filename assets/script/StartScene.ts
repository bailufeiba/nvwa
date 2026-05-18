import { _decorator, Node } from "cc";
import { BaseComponent } from "./Common/BaseComponent";
import I18Mgr from "./i18/I18Mgr";
import { EventName } from "./Game/EventID";
import GameView from "./Game/GameView";

const { ccclass, property } = _decorator;
@ccclass(`StartScene`)
export class StartScene extends BaseComponent {
    @property({ type: Node, visible: true })
    _startView: Node | null = null;

    @property({ type: GameView, visible: true })
    _gameView: GameView | null = null;

    protected onInit(): void {
        const self = this;

        self.onEvent(EventName.StartGame, self, self.startGame);
        self.onEvent(EventName.CloseView, self, self.onEventViewClose);

        self._startView!.active = false;
        self._gameView!.node.active = false;

        I18Mgr.Inst.initDefaultLanguage(() => {
            self._startView!.active = true;
        });
    }

    onEventViewClose(viewNode: Node) {
        const self = this;
        if (viewNode == null) return;

        if (viewNode == self._gameView!.node) {
            self._gameView!.node.active = false;
            self._startView!.active = true;
        }
    }

    startGame() {
        const self = this;
        self._startView!.active = false;
        self._gameView!.node.active = true;
        self._gameView!.initRoom();
    }
}
