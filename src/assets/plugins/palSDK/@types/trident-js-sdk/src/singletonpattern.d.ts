/**
 * 单例模式的设计，可以使用继承的方式来进行扩展功能
 */
export declare class SingletonPattern {
    static getInstance(...params: [any]): SingletonPattern;
    private static singleton;
    private constructor();
}
