declare type IMessageInput = string | symbol;
declare type CallbackFunction = (this: void, propName: any) => void;
/**
 * 封装订阅者、发布者简单的模式
 */
export declare class Pubsub {
    immediateExceptions: boolean;
    private messages;
    private lastUid;
    constructor(immediateExceptions?: boolean);
    /**
     * 同步派发事件，正常情况下不使用该方法（同步情况如果发生报错会阻塞事件派发，使用 publicSync 能尽可能地将信息发布出去忽略报错情况）
     * @param message 触发的事件 string
     * @param data 派发的数据内容
     */
    publish(message: string, data?: any): boolean;
    /**
     * 异步发布事件，一般情况下都推荐使用该方法进行事件发布
     * @param message 发布的事件
     * @param data 派发的数据内容
     */
    publishSync(message: string, data?: any): boolean;
    /**
     * 订阅事件
     * @param message 订阅的事件类型
     * @param func 事件触发后执行的函数方法
     * @returns 返回 token 值（可以用于快捷取绑事件）、如果第二个参数的入参不是 function 则返回 布尔值 false。订阅失败
     */
    subscribe(message: IMessageInput, func: CallbackFunction): string | boolean;
    /**
     * 订阅事件，只订阅一次
     * @param message 订阅的事件类型
     * @param func 事件触发后执行的函数方法
     */
    subscribeOnce(message: string, func: CallbackFunction): this;
    /**
     * 清空所有订阅的事件内容
     */
    clearAllSubscriptions(): void;
    /**
     * 清空某一特定事件的订阅
     * @param topic 事件类型
     */
    clearSubscriptions(topic: string): void;
    /**
     * 取消订阅某一事件
     * @param value func 或者 token 值
     */
    unsubscribe(value: CallbackFunction | string): boolean | undefined;
    /**
     * 即时调用订阅方法，该方法应该只有在作为 debug 时方便进行捕获堆栈信息时使用
     * @param subscriber
     * @param message
     * @param data
     */
    private callSubscriberWithImmediateExceptions;
    /**
     * 延迟调用订阅方法，主要目的是实现发布事件的时候，错误不会阻塞其他订阅者
     * @param subscriber
     * @param message
     * @param data
     */
    private callSubscriberWithDelayedExceptions;
    /**
     * 传递交付消息通信的统一方法
     * @param originalMessage
     * @param matchedMessage
     * @param data
     * @param immediateExceptions
     */
    private deliverMessage;
    private createDeliveryFunction;
    private messageHasSubscribers;
    private _publish;
}
export {};
