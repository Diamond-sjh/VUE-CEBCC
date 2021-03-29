import { RequestSingleton } from '../../data-source/common/requestSingleton';
export interface ISocketCheckerOptions {
    baseUrl?: string;
    debug?: boolean;
    $http?: RequestSingleton;
}
/**
 * 实时质检模块
 */
export declare class SocketChecker {
    static debug: boolean;
    /**
     * 初始化意见反馈模块的信息内容，必须调用该方法后才可以使用内置的方法函数
     */
    static init(options?: ISocketCheckerOptions): Promise<void>;
    /**
     * 判断函数是否初始化完成的方法
     */
    static isInit(): boolean;
    /**
     * 开始于中控 websocket 连接的方法函数，执行后会开始出发各种事件的连接
     */
    static start(): void;
    /**
     * 监听 socketChecker 暴露出来的事件内容
     * @param eventName 监听的事件名称
     * @param func 执行的回调函数
     */
    static on(eventName: string, func: () => any): string | boolean;
    /**
     * 解绑 socketChecker 的事件监听
     * @param value 使用 on 事件绑定时返回的唯一标识或函数
     */
    static off(value: string | (() => any)): boolean | undefined;
    /**
     * 固定质检某特定场景的方法。
     * 使用该方法后，流程场景将会针对该场景进行，不会进行自动切换
     * 触发后会向 socket 发送一个 switchFixProcessScene 事件
     * @param sessionId 会话唯一标识
     * @param processSceneId 传入 number 则会选定特定场景进行质检，如果传入 null 则会取消这次的绑定
     */
    static switchFixProcessSceneCheck(sessionId: number, processSceneId: number | null): Promise<unknown>;
    /**
     * 打开或关闭智能表单提取的功能
     */
    static switchSmartFormChecker(sessionId: number, smartFormId?: number): Promise<void>;
    private static $http;
    private static pubsub;
    private static socketInstance;
    private static baseUrl;
    private static sessionCache;
    private static SmartFormApis;
    /**
     * 初始化绑定 socketio 自定义事件控制器函数
     */
    private static initWebSocketHandler;
    /**
     * 接受会话开始事件后的处理函数
     */
    private static handleSessionStart;
    /**
     * 重置内部数据存储对象，重置所有基于会话做的缓存内容
     */
    private static initInnerCache;
    /**
     * 保存会话开始时提供的数据内容
     * 比如: sessionId / 客户画像
     */
    private static initSessionData;
    /**
     * 处理会话中的消息内容
     * @param data
     */
    private static handleChatting;
    /**
     * 调用信息抽取表功能的方法，方法内会判断是否需要执行表单逻辑
     */
    private static checkSmartForm;
    /**
     * 检查当前会话
     * @param sessionId
     */
    private static checkAndInitData;
    private static setAgentResponse;
    /**
     * 处理会话结束的消息内容
     */
    private static handleSessionEnd;
    /**
     * 统一 debug log 的输出方法
     * @param str 输出的文本
     */
    private static logDebug;
}
