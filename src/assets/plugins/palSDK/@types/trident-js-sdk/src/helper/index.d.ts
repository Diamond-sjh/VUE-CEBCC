/**
 * 判断对象是否是一个空对象的方法
 * @param obj 任意对象
 */
export declare function hasKeys(obj?: object): boolean;
/**
 * 返回一个抛错的方法，这个主要是用于 settimeout的情况下进行抛错
 * @param ex Error 错误对象
 */
export declare function throwException(ex: Error): () => never;
export declare function classApplyMixins(derivedCtor: any, baseCtors: any[]): void;
