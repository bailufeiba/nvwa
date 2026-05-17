/* eslint-disable @typescript-eslint/naming-convention */
export function Singleton<T>() {
    class SingletonE {
        protected constructor() {}
        protected onDestroyInstance() {}

        private static _instance: SingletonE | null = null;
        public static get Inst(): T {
            if (SingletonE._instance == null) {
                SingletonE._instance = new this();
            }
            return SingletonE._instance as T;
        }

        public static destroyInstance() {
            if (SingletonE._instance) {
                SingletonE._instance.onDestroyInstance();
                SingletonE._instance = null;
            }
        }
    }
    return SingletonE;
}
