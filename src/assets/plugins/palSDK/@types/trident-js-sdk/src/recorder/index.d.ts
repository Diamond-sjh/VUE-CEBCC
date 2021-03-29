export interface IRecorderSettings {
    bufferLength?: number;
    encoderApplication?: number;
    encoderFrameSize?: number;
    encoderSampleRate?: number;
    leaveStreamOpen?: boolean;
    maxBuffersPerPage?: number;
    mediaTrackConstraints?: boolean;
    monitorGain?: number;
    numberOfChannels?: number;
    recordingGain?: number;
    resampleQuality?: number;
    streamPages?: boolean;
    wavBitDepth?: number;
}
export declare enum RecorderState {
    inactive = 0,
    paused = 1,
    recording = 2
}
export declare class Recorder {
    static isRecordingSupported(): any;
    state: RecorderState;
    settings: IRecorderSettings;
    encoder: any;
    private audioContext;
    private sourceNode;
    private monitorGainNode;
    private recordingGainNode;
    private scriptProcessorNode;
    private stream;
    private totalLength;
    private recordedPages;
    private ignoreFirstBuffer;
    constructor(config: IRecorderSettings);
    ondataavailable: (data: any) => void;
    onpause: () => void;
    onresume: () => void;
    onstart: () => void;
    onstop: () => void;
    start(customSourceNode?: MediaStreamAudioSourceNode): Promise<void> | undefined;
    /**
     * 暂停音频的录制
     */
    pause(): void;
    /**
     * 恢复音频的录制
     */
    resume(): void;
    /**
     * 停止录制音频内容
     */
    stop(): void;
    /**
     * 初始化解码 worker
     */
    private initWorker;
    private storePage;
    private streamPage;
    private clearStream;
    private encodeBuffers;
    private initAudioContext;
    private initAudioGraph;
    private initSourceNode;
    private setRecordingGain;
    private setMonitorGain;
}
