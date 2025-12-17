export declare class PrivateKey {
    protected passphrase?: string;
    protected key: Buffer;
    constructor(key: string, passphrase?: string);
    /**
     * 获取私钥内容
     * @returns
     */
    getKey(): Buffer<ArrayBufferLike>;
    /**
     * 获取密码
     * @returns
     */
    getPassphrase(): string;
    /**
     * 转为字符串
     * @returns
     */
    toString(): Buffer<ArrayBufferLike>;
}
