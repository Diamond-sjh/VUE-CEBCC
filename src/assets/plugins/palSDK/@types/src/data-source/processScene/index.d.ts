import { IRequestSetting } from '@cloud/trident-js-sdk/src';
import { RequestSingleton } from '../common/requestSingleton';
export interface IFindProcessSceneOptions {
    query: string;
    currentPage: number;
    pageSize: number;
}
export declare class PorcessSceneApis {
    $http: RequestSingleton;
    constructor(settings: IRequestSetting);
    /**
     * 查询当前流程场景节点的详情信息
     * @param params
     */
    getProcessSceneList(params: IFindProcessSceneOptions): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
}
