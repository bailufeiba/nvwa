import { Component } from "cc";

import EventManager from "./EventManager";

export interface IBaseComponent {
    onInit(): void;
    onDeinit(): void;
}

export class BaseComponent extends Component implements IBaseComponent {

    public onInit(): void { }
    public onDeinit(): void { }

    protected onLoad(): void {
        const self = this;
        self.onInit();
    }

    public onEvent(eventName: number | string, target: any, func: Function, priority: number = 0) {
        EventManager.Inst.addListener(eventName, target, func, priority);
    }

    public offEvent(nameOrTarget: (number | string) | any, target?: any, func?: Function) {
        if (target != null) {
            EventManager.Inst.removeListener(nameOrTarget, target, func);
        } else {
            EventManager.Inst.removeTarget(nameOrTarget);
        }
    }

    protected onDestroy(): void {
        const self = this;
        self.offEvent(self);
        self.onDeinit();
    }

}