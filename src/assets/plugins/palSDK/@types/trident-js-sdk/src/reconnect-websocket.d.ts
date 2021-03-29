declare type CallbackFunction = (this: void, propName: any) => void;
export interface IWebsocketOptions {
    debug?: boolean;
    automaticOpen?: boolean;
    reconnectInterval?: number;
    timeoutInterval?: number;
    maxReconnectAttempts?: number | null;
    needHeartbeat?: boolean;
    heartBeatType?: number | null;
}
export declare class ReconnectWebsocket {
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
    reconnectAttempts: number;
    readyState: number;
    binaryType: BinaryType;
    readonly settings: IWebsocketOptions;
    readonly url: string;
    protocol: string | null;
    private websocketInstance;
    private forcedClose;
    private timedOut;
    private eventBus;
    private heartbeatTimer;
    private heartbeatAlive;
    constructor(url: string, protocol?: any, options?: IWebsocketOptions);
    on(message: string, func: CallbackFunction): string | boolean;
    /**
     * 用于自定义一些特殊的传输操作，如果是标准数据类型则建议使用 sendFormat
     * @param data 支持任意数据类型
     */
    send(data: any): void;
    onopen: (evnet: any) => void;
    onclose: (evnet: any) => void;
    onconnecting: (evnet: any) => void;
    onmessage: (evnet: any) => void;
    onerror: (evnet: any) => void;
    /**
     * 标准化向中控传输事件的函数,通用情况下建议采用该方法进行交互
     * 生成约定的标准格式
     * {
     *    msgType: 1/2/3/4...,
     *    ...data
     * }
     * @param data Object
     */
    sendFormat(code: number, data?: object): void;
    /**
     * 强制关闭 websocket 的连接。注：不会再触发重连操作
     * @param code websocket 关闭的原因状态码
     * @param reason webscoket 关闭的原因
     */
    close(code: number, reason: any): void;
    /**
     * 刷新 webscoket 连接，手动触发一次 close 事件，触发 websocket 实现重连
     */
    refresh(): void;
    /**
     * 实际开始 websocket 连接的方法函数
     * 如果有设置 maxReconnectAttempts 参数则会自动调用该方法。否则需要手动开启
     * @param reconnectAttempt
     */
    open(reconnectAttempt: boolean): void;
    /**
     * 设置心跳包进行检测 websocket 存活状况
     */
    private setHeartbeatInterval;
    /**
     * 重新设置心跳包
     */
    private resetHeartbeat;
    /**
     * 统一 debug log 的输出方法
     * @param str 输出的文本
     */
    private logDebug;
}
export {};
