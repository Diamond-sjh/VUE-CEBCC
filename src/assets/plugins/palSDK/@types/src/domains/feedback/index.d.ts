import { RequestSingleton } from '../../data-source/common/requestSingleton';
import { ICreateFeedbackOptions } from '../../data-source/feedback/index';
import { AxiosResponse } from '@cloud/trident-js-sdk/src/request';
export interface IFeedbackInitOptions {
    $http?: RequestSingleton;
}
/**
 * 意见反馈模块，使用类似于单例的实现
 */
export declare class Feedback {
    /**
     * 初始化意见反馈模块的信息内容，必须调用该方法后才可以使用内置的方法函数
     */
    static init(options?: IFeedbackInitOptions): Promise<void>;
    /**
     * 判断函数是否初始化完成的方法
     */
    static isInit(): boolean;
    static createFeedback(params: ICreateFeedbackOptions): Promise<AxiosResponse<any>>;
    private static $http;
}
