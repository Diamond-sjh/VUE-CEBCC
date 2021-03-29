export declare const EVENT_NAME: {
    SOCKET_CONNECT: string;
    SOCKET_RECONNECT: string;
    SOCKET_CONNECTING: string;
    SESSION_START: string;
    SESSION_CHATTING: string;
    SESSION_END: string;
    UPDATE_SMARTFORM: string;
};
export declare const INNER_EVENT_NAME: {
    SESSION_START: string;
    SESSION_CHATTING: string;
    SESSION_END: string;
    SWITCH_FIX_PROCESS_SCENE: string;
};
export declare enum MESSAGE_TYPE {
    CUSTOM_TYPE = 1,
    AGENT_TYPE = 2
}
export declare enum NOTICES_CHECK_STAGES {
    REAL_TIME = 0,
    ATFER = 1
}
