import { IRequestSetting } from '@cloud/trident-js-sdk/src/index';
import { RequestSingleton } from '../common/requestSingleton';
import { FEEDBACK_TYPE } from '../../constans/feedback';
export interface ICreateFeedbackOptions {
    type: FEEDBACK_TYPE;
    content: string;
}
export declare class FeedbackApis {
    $http: RequestSingleton;
    constructor(settings: IRequestSetting);
    createFeedback(data: ICreateFeedbackOptions): Promise<import("@cloud/trident-js-sdk/src").AxiosResponse<any>>;
}
