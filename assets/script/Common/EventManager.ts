import { isValid } from "cc";
import { Singleton } from "./Singleton";

/** 单个监听器包装，保存回调及其状态。 */
class Listener {
    private _target: any = null;
    private _func: Function | null = null;
    private _priority: number = 0;
    private _bRemoved: boolean = false;

    /**
     * 创建一个事件监听包装器。
     * @param target 回调执行对象
     * @param func 回调函数
     * @param priority 监听优先级，值越大越先触发
     */
    constructor(target: any, func: Function, priority: number = 0) {
        const self = this;
        self._target = target;
        self._func = func;
        self._priority = priority;
        self._bRemoved = false;
    }

    /** 获取回调执行对象。 */
    public get target() {
        return this._target;
    }

    /** 获取回调函数。 */
    public get func() {
        return this._func;
    }

    /** 获取监听优先级。 */
    public get priority() {
        return this._priority;
    }

    /** 获取监听是否已被标记移除。 */
    public get removed() {
        return this._bRemoved;
    }

    /** 设置监听移除标记。 */
    public set removed(value: boolean) {
        this._bRemoved = value;
    }

    /**
     * 触发监听回调。
     * @param data 事件参数
     */
    public onEvent(data?: any) {
        const self = this;
        if (self._bRemoved == true) return;
        if (self._func == null) return;
        if (self._target == null) return;
        if (!isValid(self._target)) return;
        self._func.call(self._target, data);
    }

    /** 标记当前监听为已移除。 */
    public onRemove() {
        const self = this;
        self._bRemoved = true;
    }
}

/** 同一事件名下的监听集合与分发控制。 */
class LisenterGroup {
    private _eventName: number | string = 0;
    private _listeners: Listener[] = [];
    private _arrAddListeners: Listener[] = [];
    private _bDispatch: boolean = false;
    private _eventDatas: any[] = [];

    /**
     * 创建事件组。
     * @param eventName 事件名称
     */
    constructor(eventName: number | string) {
        const self = this;
        self._eventName = eventName;

        self._listeners = [];
        self._arrAddListeners = [];
        self._bDispatch = false;
        self._eventDatas = [];
    }

    /** 获取当前组对应的事件名称。 */
    public get eventName() {
        return this._eventName;
    }

    /**
     * 判断指定监听是否存在于目标列表中。
     * @param listeners 监听列表
     * @param target 回调执行对象
     * @param func 回调函数
     */
    public isExist(listeners: Listener[], target: any, func: Function) {
        return this.getListener(listeners, target, func) != null;
    }

    /**
     * 添加监听器；分发中添加会先暂存，分发结束后合并。
     * @param target 回调执行对象
     * @param func 回调函数
     * @param priority 监听优先级
     */
    public addListener(target: any, func: Function, priority: number = 0) {
        const self = this;
        if (self._bDispatch == false) {
            if (self.isExist(self._listeners, target, func)) return;
            self._listeners.push(new Listener(target, func, priority));
            self.sortListener();
        } else {
            if (self.isExist(self._listeners, target, func)) return;
            if (self.isExist(self._arrAddListeners, target, func)) return;
            self._arrAddListeners.push(new Listener(target, func, priority));
        }
    }

    /** 按优先级从高到低排序监听器。 */
    public sortListener() {
        this._listeners.sort(function (a, b) {
            return b.priority - a.priority;
        });
    }

    /**
     * 在监听列表中查找匹配监听。
     * @param listeners 监听列表
     * @param target 回调执行对象
     * @param func 回调函数
     */
    public getListener(listeners: Listener[], target: any, func: Function) {
        for (let listener of listeners) {
            if (listener.target != target) continue;
            if (listener.func != func) continue;
            if (listener.removed == true) continue;
            return listener;
        }
        return null;
    }

    /**
     * 移除监听器。
     * @param target 回调执行对象
     * @param func 回调函数；为空时移除该 target 的所有监听
     */
    public removeListener(target: any, func?: Function) {
        if (func != null) {
            for (let i = 0; i < this._arrAddListeners.length; ) {
                let listener = this._arrAddListeners[i];
                if (listener.target == target && listener.func == func) {
                    this._arrAddListeners.splice(i, 1);
                } else {
                    ++i;
                }
            }

            for (let listener of this._listeners) {
                if (listener.target == target && listener.func == func) {
                    listener.onRemove();
                    return;
                }
            }
        } else {
            for (let i = 0; i < this._arrAddListeners.length; ) {
                let listener = this._arrAddListeners[i];
                if (listener.target == target) {
                    this._arrAddListeners.splice(i, 1);
                } else {
                    ++i;
                }
            }

            for (let listener of this._listeners) {
                if (listener.target == target) {
                    listener.onRemove();
                    return;
                }
            }
        }
    }

    /** 判断当前事件组是否为空。 */
    public empty() {
        return this._listeners.length <= 0;
    }

    /**
     * 深拷贝事件数据，避免分发重入时引用被外部修改。
     * @param obj 原对象
     */
    public clone(obj: any) {
        if (Object.prototype.toString.call(obj) == `[object Object]`) {
            let newObj: any = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = this.clone(obj[key]);
                }
            }
            return newObj;
        } else if (Object.prototype.toString.call(obj) == `[object Array]`) {
            let newObj: any = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    newObj[key] = this.clone(obj[key]);
                }
            }
            return newObj;
        }
        return obj;
    }

    /**
     * 触发当前组的所有监听。
     * @param data 事件参数
     */
    public onEvent(data?: any) {
        if (this._bDispatch) {
            this._eventDatas.push(this.clone(data));
            return;
        }

        this._bDispatch = true;
        this.discard();
        this.merge();

        for (let listener of this._listeners) {
            listener.onEvent(data);
        }

        this._bDispatch = false;

        if (this._eventDatas.length > 0) {
            let data2 = this._eventDatas[0];
            this._eventDatas.splice(0, 1);
            this.onEvent(data2);
        }
    }

    /** 将分发期间暂存的新监听合并到正式列表。 */
    public merge() {
        if (this._arrAddListeners.length <= 0) return;
        for (let listener of this._arrAddListeners) {
            this._listeners.push(listener);
        }
        this.sortListener();
        this._arrAddListeners.splice(0, this._arrAddListeners.length);
    }

    /** 丢弃已标记为移除的监听。 */
    public discard() {
        for (let i = 0; i < this._listeners.length; ) {
            if (this._listeners[i].removed) {
                this._listeners.splice(i, 1);
            } else {
                ++i;
            }
        }
    }
}

/** 全局事件中心，管理监听注册、移除和派发。 */
export default class EventManager extends Singleton<EventManager>() {
    private _listenerGroup: LisenterGroup[];

    /** 初始化事件管理器。 */
    constructor() {
        super();
        this._listenerGroup = [];
    }

    /**
     * 添加事件监听。
     * @param eventName 事件名称
     * @param target 回调执行对象
     * @param func 回调函数
     * @param priority 优先级，值越大越先执行
     */
    public addListener(
        eventName: number | string,
        target: any,
        func: Function,
        priority: number = 0
    ) {
        let group = this.getListenerGroup(eventName);
        if (group == null) {
            group = new LisenterGroup(eventName);
            this._listenerGroup.push(group);
        }

        group.addListener(target, func, priority);
    }

    /**
     * 移除指定事件的监听。
     * @param eventName 事件名称
     * @param target 回调执行对象
     * @param func 回调函数；为空时移除该 target 在该事件下的全部监听
     */
    public removeListener(
        eventName: number | string,
        target: any,
        func?: Function
    ) {
        for (let i = 0; i < this._listenerGroup.length; ++i) {
            let group = this._listenerGroup[i];
            if (group.eventName == eventName) {
                group.removeListener(target, func);

                if (group.empty()) {
                    this._listenerGroup.splice(i, 1);
                }
                return;
            }
        }
    }

    /**
     * 移除 target 在所有事件上的监听。
     * @param target 回调执行对象
     */
    public removeTarget(target: any) {
        for (let i = 0; i < this._listenerGroup.length; ) {
            let group = this._listenerGroup[i];
            group.removeListener(target);

            if (group.empty()) {
                this._listenerGroup.splice(i, 1);
            } else {
                ++i;
            }
        }
    }

    /**
     * 获取事件组。
     * @param eventName 事件名称
     */
    public getListenerGroup(eventName: number | string) {
        for (let group of this._listenerGroup) {
            if (group.eventName == eventName) {
                return group;
            }
        }
        return null;
    }

    /**
     * 派发事件。
     * @param eventName 事件名称
     * @param data 事件参数
     */
    public emitEvent(eventName: number | string, data?: any) {
        let group = this.getListenerGroup(eventName);
        if (group != null) {
            group.onEvent(data);
        }
    }

    /** 销毁单例时清空全部事件组。 */
    protected onDestroyInstance() {
        this._listenerGroup.splice(0, this._listenerGroup.length);
    }
}

/**
 * 注册事件监听。
 * @param eventName 事件名称
 * @param target 回调执行对象
 * @param func 回调函数
 * @param priority 优先级，值越大越先执行
 */
export let onEvent = function (
    eventName: number | string,
    target: any,
    func: Function,
    priority: number = 0
) {
    EventManager.Inst.addListener(eventName, target, func, priority);
};

/**
 * 移除监听器
 * @param nameOrTarget 事件名称 || target
 * @param target obj
 * @param func 处理函数
 * @example
 * offEvent( "event1", this, this.func1 );
 * offEvent( this );
 */
export let offEvent = function (
    nameOrTarget: (number | string) | any,
    target?: any,
    func?: Function
) {
    if (target != null) {
        EventManager.Inst.removeListener(nameOrTarget, target, func);
    } else {
        EventManager.Inst.removeTarget(nameOrTarget);
    }
};

/**
 * 派发事件。
 * @param eventName 事件名称
 * @param data 事件参数
 */
export let emitEvent = function (eventName: number | string, data?: any) {
    EventManager.Inst.emitEvent(eventName, data);
};
