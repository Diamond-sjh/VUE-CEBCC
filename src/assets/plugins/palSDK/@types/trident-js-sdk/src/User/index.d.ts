/**
 * 统一封装 SignIn 模块，通过 AIFORCE 进行用户的登录鉴权等操作
 * 如果不需要 AIFORCE 模块，那需要自定义token的获取
 */
import { Request } from '../request';
export declare const USER_INFO = "TRIDENT-JS-SDK_USER_INFO";
interface IUserInfo {
    email: string;
    password: string;
}
export interface IUserSetting {
    signinMethod: "get" | "GET" | "delete" | "DELETE" | "head" | "HEAD" | "options" | "OPTIONS" | "post" | "POST" | "put" | "PUT" | "patch" | "PATCH" | undefined;
    signinUrl: string;
    signoutUrl: string;
    $http: Request;
}
export declare class User {
    setting: IUserSetting;
    $http: Request;
    constructor(setting: IUserSetting);
    /**
     * 统一的后台鉴权接口（登录接口）
     * TIPS: 为了确保进行底层操作，需要新建一个 axios 避免全局的拦截器影响
     * TODO: 暂时没有去兼容用户自定义 reject 的情况
     * @param data
     * @returns 返回用户鉴权的token、
     */
    signin(data: IUserInfo): Promise<any>;
    /**
     * 退出时调用删除 localstrage 的方法 暂时未实现删除后台 session 和 cookie
     */
    signout(): Promise<void>;
}
export {};
