import { IRequestSetting, Request } from '@cloud/trident-js-sdk/src/index';
/**
 * 提供一个 Request 的单例模式使得 Exam、History等共用同一个api。
 * 拦截器的使用：
 *    1. 可以覆盖父类的 requestInterceptors/responseInterceptors 方法取消默认的拦截器
 *    2. 或在getInstance()加一层拦截器的二次处理
 */
export declare class RequestSingleton extends Request {
    static getInstance(settings?: IRequestSetting): RequestSingleton;
    private static singleton;
    private constructor();
}
