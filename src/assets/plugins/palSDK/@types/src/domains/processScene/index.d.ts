import { RequestSingleton } from '../../data-source/common/requestSingleton';
import { IFindProcessSceneOptions } from '../../data-source/processScene/index';
export interface IProcessSceneOptions {
    $http?: RequestSingleton;
}
/**
 * 流程场景
 */
export declare class ProcessScene {
    /**
     * 初始化流程场景模块的信息内容，必须调用该方法后才可以使用内置的方法函数
     */
    static init(options?: IProcessSceneOptions): Promise<void>;
    /**
     * 判断函数是否初始化完成的方法
     */
    static isInit(): boolean;
    /**
     * 查看信息抽取表的历史记录
     * @param sessionId
     */
    static getProcessSceneList(params: IFindProcessSceneOptions): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
    private static $http;
}
