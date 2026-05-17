export enum EBundleName {
    NONE = ``,
    CN = `CN`,
    EN = `EN`,
    Default = `CN`,
}

export default class I18LanguageHelper {
    static getBundleByStr(str: string) {
        switch (str) {
            case `CN`:
                return EBundleName.CN;
            case `EN`:
                return EBundleName.EN;
            default:
                return EBundleName.Default;
        }
    }
}
