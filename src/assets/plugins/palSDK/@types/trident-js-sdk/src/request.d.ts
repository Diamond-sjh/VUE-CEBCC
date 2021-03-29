/**
 * 统一封装 axios 主要用于处理一些统一的逻辑，方便子类做继承关系扩展 api 接口
 * 比如统一跨域 CORS 的设计
 */
import { AxiosInstance, AxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";
export { AxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosInstance };
export interface IRequestSetting extends AxiosRequestConfig {
    [propName: string]: any;
}
export declare class Request {
    /**
     * 自定义拦截器的执行方式，传入一个 axios 实例，借用其拦截器功能
     * @param $http
     * @param response
     */
    static interceptorResSuccessExec($http: AxiosInstance, response: AxiosResponse): any;
    /**
     * 自定义拦截器的执行方式，传入一个 axios 实例，借用其拦截器功能
     * @param $http
     * @param response
     */
    static extendInterceptorReq(oldHttp: AxiosInstance, newHttp: AxiosInstance): any;
    setting: IRequestSetting;
    $http: AxiosInstance;
    constructor(setting: IRequestSetting);
    request(config: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    get(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    delete(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    post(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    put(url: string, data?: any, options?: AxiosRequestConfig): Promise<AxiosResponse<any>>;
    /**
     * 全局提供拦截器的功能，业务复用可以覆写该方法覆盖掉父类的实现
     */
    private requestInterceptors;
    /**
     * 全局提供拦截器的功能，业务复用可以覆写该方法覆盖掉父类的实现
     */
    private responseInterceptors;
}
