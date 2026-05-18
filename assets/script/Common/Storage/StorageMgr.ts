import { EventName } from "../../Game/EventID";
import { emitEvent, onEvent } from "../EventManager";
import { Singleton } from "../Singleton";

/**
 * 本地存储
 *
 * 核心接口:
 *
 * 读取数据
 * getData( key: string, defaultData : any = null, isSysData: boolean = false ) : any
 *
 * 存储数据
 * setData( key: string, data: any, isSysData: boolean = false, flush: boolean = false ) : void
 *
 * 删除数据
 * removeData( key: string, isSysData: boolean = false ) : void
 *
 * 读取系统数据
 * getSysData( key: string, defaultData : any = null ) : any
 *
 * 存储系统数据
 * setSysData( key: string, data: any, flush: boolean = false ) : void
 *
 * 删除系统数据
 * removeSysData( key: string ) : void
 *
 * 读取用户数据
 * getUserData( key: string, defaultData : any = null ) : any
 *
 * 存储用户数据
 * setUserData( key: string, data: any, flush: boolean = false ) : void
 *
 * 删除用户数据
 * removeUserData( key: string ) : void
 *
 * 写出数据
 * flush(): void
 *
 * 简介:
 * 按用户进行存储,用户登录后立即初始化数据, 用户登出后立即写出数据
 * 用户退出子游戏时,立即写出
 * 每5分钟自动写出数据
 *
 * 注意:
 * 存储的数据未进行加密,切勿储存敏感数据
 *
 */
export default class StorageMgr extends Singleton<StorageMgr>() {
    private _sysData: any = null;

    private _curUserID: string | number = ``;
    private _curUserData: any = null;

    private _bNeedFlush: boolean = false;
    private _autoFlushTimer: number = 0;

    constructor() {
        super();

        const self: StorageMgr = this;
        onEvent(EventName.USER_LOGIN, self, self.onUserLogin);
        onEvent(EventName.USER_LOGOUT, self, self.onUserLogout);

        self.initSysData();
    }

    private initSysData(): void {
        const self: StorageMgr = this;
        if (self._sysData != null) return;

        let strData: any = localStorage.getItem(`SysData`);
        if (strData == null) {
            strData = `{}`;
        }
        self._sysData = JSON.parse(strData);
    }

    /**
     * 获取系统数据
     * @param key 存储key
     * @param defaultData   默认返回
     */
    public getSysData(key: string, defaultData: any = null): any {
        const self: StorageMgr = this;
        self.initSysData();
        return self._sysData[key] || defaultData;
    }

    /**
     * 存储系统数据
     * @param key 存储key
     * @param data 存储数据
     * @param flush 是否立即写出
     */
    public setSysData(key: string, data: any, flush: boolean = false): void {
        const self: StorageMgr = this;
        self.initSysData();
        self._sysData[key] = data;
        if (flush) {
            self.flush();
        }
    }

    /**
     * 删除系统数据
     * @param key 存储Key
     */
    public removeSysData(key: string): void {
        const self: StorageMgr = this;
        delete self._sysData[key];
        self.flush();
    }

    /**
     * 响应用户登录事件
     * @param userId 用户ID
     */
    private onUserLogin(userId: string | number): void {
        const self: StorageMgr = this;
        self.flush();

        self._curUserID = userId;
        self._curUserData = null;
        self.initUserData();
    }

    /**
     * 响应用户登出事件
     * @param userId 用户ID
     */
    private onUserLogout(userId: string | number): void {
        const self: StorageMgr = this;
        self.flush();
        self._curUserID = ``;
        self._curUserData = null;
    }

    /**
     * 初始化用户数据
     */
    private initUserData(): void {
        const self: StorageMgr = this;
        if (self._curUserData != null) return;

        if (self._curUserID == ``) {
            console.warn(`StorageMgr: initUserData failed, userId is empty`);
        } else {
            console.log(
                `StorageMgr: initUserData, userId = ${self._curUserID}`
            );
        }

        let strData: any = localStorage.getItem(`UserData_${self._curUserID}`);
        if (strData == null) {
            strData = `{}`;
        }
        self._curUserData = JSON.parse(strData);
        self._bNeedFlush = false;
        self.startAutoFlush();

        emitEvent(EventName.STORAGE_UPDATE);
    }

    /**
     * 获取用户数据
     * @param key 存储key值
     * @param defaultData 默认返回
     * @returns 获得数据 或者 默认返回
     */
    public getUserData(key: string, defaultData: any = null): any {
        const self: StorageMgr = this;
        self.initUserData();
        return self._curUserData[key] || defaultData;
    }

    /**
     * 存储用户数据
     * @param key 存储Key值
     * @param data 存储数据
     * @param flush 是否立即写出
     */
    public setUserData(key: string, data: any, flush: boolean = false): void {
        const self: StorageMgr = this;
        self.initUserData();
        self._curUserData[key] = data;
        self._bNeedFlush = true;

        if (flush) {
            self.flush();
        }
    }

    /**
     * 删除用户数据
     * @param key 存储Key值
     */
    public removeUserData(key: string): void {
        const self: StorageMgr = this;
        if (self._curUserData == null) return;
        delete self._curUserData[key];
        self.flush();
    }

    public getData(
        key: string,
        defaultData: any = null,
        isSysData: boolean = false
    ): any {
        const self: StorageMgr = this;
        if (isSysData) {
            return self.getSysData(key, defaultData);
        } else {
            return self.getUserData(key, defaultData);
        }
    }

    public setData(
        key: string,
        data: any,
        isSysData: boolean = false,
        flush: boolean = false
    ): void {
        const self: StorageMgr = this;
        if (isSysData) {
            self.setSysData(key, data, flush);
        } else {
            self.setUserData(key, data, flush);
        }
    }

    public removeData(key: string, isSysData: boolean = false): void {
        const self: StorageMgr = this;
        if (isSysData) {
            self.removeSysData(key);
        } else {
            self.removeUserData(key);
        }
    }

    /**
     * 写出数据,一般不需要手动调用,有定时器定时写出
     */
    public flush(): void {
        const self: StorageMgr = this;

        const strSysData: string = JSON.stringify(self._sysData, null, 2);
        localStorage.setItem(`SysData`, strSysData);

        if (self._curUserID != `` && self._curUserData != null) {
            const strUserData: string = JSON.stringify(
                self._curUserData,
                null,
                2
            );
            localStorage.setItem(`UserData_${self._curUserID}`, strUserData);
        }

        self._bNeedFlush = false;
    }

    /**
     * 响应定时写出
     */
    private onAutoFlush(): void {
        const self: StorageMgr = this;
        if (!self._bNeedFlush) return;
        self.flush();
    }

    /**
     * 启动定时写出
     */
    private startAutoFlush(): void {
        const self: StorageMgr = this;
        self.stopAutoFlush();
        self._autoFlushTimer = setInterval(self.onAutoFlush.bind(self), 300000);
    }

    /**
     * 停止定时写出
     */
    private stopAutoFlush(): void {
        const self: StorageMgr = this;
        if (self._autoFlushTimer <= 0) return;
        clearInterval(self._autoFlushTimer);
        self._autoFlushTimer = 0;
    }

    // 销毁实例时写出数据
    protected onDestroyInstance() {
        const self: StorageMgr = this;
        self.flush();
        self.stopAutoFlush();
    }
}
