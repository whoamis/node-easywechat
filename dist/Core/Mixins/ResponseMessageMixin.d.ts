import Encryptor from "../Encryptor";
import ResponseInterface from "../Http/Contracts/ResponseInterface";
import Message from "../Message";
declare class ResponseMessageMixin {
    /**
     * 转化为回复消息
     * @returns
     */
    transformToReply(response: any, message: Message, encryptor?: Encryptor, isXml?: boolean): Promise<ResponseInterface>;
    protected normalizeResponse(response: any): Promise<Record<string, any>>;
    protected createXmlResponse(attributes: Record<string, any>, encryptor?: Encryptor): ResponseInterface;
    protected createJsonResponse(attributes: Record<string, any>, encryptor?: Encryptor): ResponseInterface;
}
export = ResponseMessageMixin;
