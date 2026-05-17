import { JsonAsset } from "cc";

export default class TxtMgr {
    static url: string = `txt`;
    private static _instance: TxtMgr | null = null;
    static getInstance(): TxtMgr {
        if (TxtMgr._instance == null) {
            TxtMgr._instance = new TxtMgr();
        }
        return TxtMgr._instance;
    }

    data: any = null;
    setData(data: JsonAsset) {
        this.data = data.json;
    }

    getTxt(key: string, ...params: any[]): string {
        const self = this;

        if (self.data == null) {
            let result = key;
            for (const str of params) {
                result += ` ${str}`;
            }
            return result;
        }

        let txtData = null;
        if (key.indexOf(`etxt`) != 0) {
            txtData = self.data;
        } else {
            txtData = self.data[`zzz___editor_txt___`];
        }

        if (txtData == null || txtData[key] == null) {
            let result = key;
            for (const str of params) {
                result += ` ${str}`;
            }
            return result;
        }

        let result = txtData[key].replace(`'`, `"`);
        for (let i = 0; i < params.length; ++i) {
            result = result.replace(`{${i + 1}}`, params[i].toString());
        }
        return result;
    }
}

export const txt = function (key: string, ...params: any[]) {
    return TxtMgr.getInstance().getTxt(key, ...params);
};
