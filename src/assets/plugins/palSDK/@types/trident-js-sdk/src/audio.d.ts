interface IWavHeaderOptions {
    framesNum?: number;
    numberOfChannels?: number;
    sampleRate?: number;
    bitDepth?: number;
}
export declare class Audio {
    static AudioContext(): any;
    settings: IWavHeaderOptions;
    constructor(options: IWavHeaderOptions);
    /**
     * 将中控发送过来的 base64 pcm 数据段转换为可以直接播放的 audioData
     * @param data
     */
    decodeBase642WavAudioData(data: string): Promise<any>;
    decodeArrayBuffer2WavAudioData(arrayBuffer: ArrayBuffer): Promise<any>;
    /**
     * base64 的pcm源
     * @param data base64转码过的pcm数据源
     */
    base642ArrayBuffer(data: string): ArrayBuffer;
    generateWavAudioData(wavBuffer: ArrayBuffer): Promise<any>;
    /**
     * 将 pcm 的数据片段转化为 wav 的音频格式
     * @param origin pcm 数据片段
     */
    generateWavBuffer(origin: ArrayBuffer): ArrayBuffer;
    /**
     * 生成 wav 的文件头
     */
    generateWavHeader(options: IWavHeaderOptions): ArrayBuffer;
    concatArrayBuffer(...buffers: ArrayBuffer[]): ArrayBuffer;
    private dataviewWriteString;
    private dataviewWriteUint32;
    private dataviewWriteUint16;
}
export {};
