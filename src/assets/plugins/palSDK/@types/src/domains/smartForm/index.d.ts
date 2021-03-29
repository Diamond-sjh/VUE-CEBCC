import { RequestSingleton } from '../../data-source/common/requestSingleton';
import { ICheckSmartFormOptions, ISubmitSmartFormDetail } from '../../data-source/smartForm/index';
import { AxiosResponse } from '@cloud/trident-js-sdk/src/request';
export interface ISmartFormOptions {
    $http?: RequestSingleton;
}
/**
 * 智能表单 -- 信息抽取表模块
 */
export declare class SmartForm {
    /**
     * 初始化意见反馈模块的信息内容，必须调用该方法后才可以使用内置的方法函数
     */
    static init(options?: ISmartFormOptions): Promise<void>;
    /**
     * 判断函数是否初始化完成的方法
     */
    static isInit(): boolean;
    static checkSmartForm(params: ICheckSmartFormOptions): Promise<AxiosResponse<any>>;
    static getSmartFormGroup(): Promise<AxiosResponse<any>>;
    static getSmartFormFields(formId: number): Promise<AxiosResponse<any>>;
    /**
     * 提交 信息抽取表内容
     * @param params
     */
    static submitSmartForm(params: ISubmitSmartFormDetail): Promise<AxiosResponse<any>>;
    /**
     * 查看信息抽取表的历史记录
     * @param sessionId
     */
    static getSmartFormResult(sessionId: number): Promise<AxiosResponse<any>>;
    private static $http;
}
