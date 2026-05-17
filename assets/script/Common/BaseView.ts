import { _decorator, Node } from "cc";
import { BaseComponent } from "./BaseComponent";
import { ViewTop } from "./ViewTop";

const { ccclass, property } = _decorator;
@ccclass(`BaseView`)
export class BaseView extends BaseComponent {
    @property({ type: ViewTop, visible: true })
    _topView: ViewTop | null = null;

    @property({ type: Node, visible: true })
    _content: Node | null = null;

    public set topTitle(value: string) {
        const self = this;
        self._topView!.title = value;
    }

    public set topDesc(value: string) {
        const self = this;
        self._topView!.desc = value;
    }

    public get content() {
        return this._content!;
    }

    public addChild(child: Node) {
        const self = this;
        self._content!.addChild(child);
    }
}
