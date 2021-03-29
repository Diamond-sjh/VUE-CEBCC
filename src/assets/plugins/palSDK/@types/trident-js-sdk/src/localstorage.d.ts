export declare class LocalStorage {
    static canUseLocalStorage: boolean;
    static getJson(key: string): object | undefined;
    static get(key: string): string;
    static setJson(key: string, obj: object): string | void | null;
    static set(key: string, value: object | string): string | void | null;
    static remove(key: string): string | void | null;
    static getKeys(): string[];
    private static invoke;
}
