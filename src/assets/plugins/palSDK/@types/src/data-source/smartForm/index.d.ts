import { IRequestSetting } from '@cloud/trident-js-sdk/src/index';
import { RequestSingleton } from '../common/requestSingleton';
import { MESSAGE_TYPE } from '../../constans/socketChecker';
export interface ICheckSmartFormOptions {
    sessionId: number;
    messageList: ISentenceDetail[];
    formId: number;
}
interface ISentenceDetail {
    sentenceId: string;
    content: string;
    messageType: MESSAGE_TYPE;
    startTime: string;
    startTimestamp: string;
    endTimestamp: string;
    isChatFinish: boolean;
    interrupt: number;
    sentiment: number;
    speed: number;
    tagId: object;
}
export interface ISubmitSmartFormDetail {
    formId: number;
    userName: string;
    agentName: string;
    serviceId: string;
    chatDate: string;
    fieldData: string;
}
export declare class SmartFormApis {
    $http: RequestSingleton;
    constructor(settings: IRequestSetting);
    /**
     * 进行信息抽取
     * @param data
     */
    checkSmartForm(data: ICheckSmartFormOptions): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
    getSmartFormGroup(): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
    getSmartFormFields(formId: number): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
    submitSmartForm(params: ISubmitSmartFormDetail): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
    getSmartFormResult(sessionId: number): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
}
export {};
