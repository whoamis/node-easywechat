'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ServerInterface_1 = __importDefault(require("../Core/Contracts/ServerInterface"));
const Response_1 = __importDefault(require("../Core/Http/Response"));
const Message_1 = __importDefault(require("./Message"));
class Server extends ServerInterface_1.default {
    constructor(request = null, encryptor = null) {
        super();
        this.request = request;
        this.encryptor = encryptor;
    }
    /**
     * 服务端消息处理
     * @returns
     */
    async serve() {
        let query = this.request.getQueryParams();
        let echostr = query['echostr'] || '';
        if (!!echostr) {
            return new Response_1.default(200, { 'Content-Type': 'text/html' }, echostr);
        }
        let message = await this.getRequestMessage(this.request);
        if (this.encryptor && query['msg_signature']) {
            this.prepend(this.decryptRequestMessage());
        }
        let response = await this.handle(new Response_1.default(200, {}, 'success'), message);
        if (!(response instanceof Response_1.default)) {
            const contentType = this.request.getHeader('content-type');
            const contentBody = this.request.getBody().toString();
            const isXml = (contentType && contentType.indexOf('xml') > -1) || contentBody.substring(0, 1) === '<';
            response = await this.transformToReply(response, message, this.encryptor, isXml);
        }
        return response;
    }
    /**
     * 添加普通消息处理器
     * @param type
     * @param handler
     * @returns
     */
    addMessageListener(type, handler) {
        return this.withHandler(async function (message, next) {
            return message.MsgType === type ? handler(message, next) : next(message);
        });
    }
    /**
     * 添加事件消息处理器
     * @param event
     * @param handler
     * @returns
     */
    addEventListener(event, handler) {
        return this.withHandler(async function (message, next) {
            return message.Event === event ? handler(message, next) : next(message);
        });
    }
    /**
     * 获取来自微信服务器的推送消息
     * @param request 未设置该参数时，则从当前服务端收到的请求中获取
     * @returns
     */
    getRequestMessage(request = null) {
        return Message_1.default.createFromRequest(request || this.request);
    }
    decryptRequestMessage() {
        return async (message, next) => {
            let query = this.request.getQueryParams();
            message = await this.decryptMessage(message, this.encryptor, query['msg_signature'] || '', query['timestamp'] || '', query['nonce'] || '');
            return next(message);
        };
    }
    /**
     * 获取解密后的消息
     * @param request 未设置该参数时，则从当前服务端收到的请求中获取
     * @returns
     */
    async getDecryptedMessage(request = null) {
        request = request ?? this.request;
        let message = await this.getRequestMessage(request);
        let query = request.getQueryParams();
        if (!this.encryptor || !query['msg_signature']) {
            return message;
        }
        return await this.decryptMessage(message, this.encryptor, query['msg_signature'] ?? '', query['timestamp'] ?? '', query['nonce'] ?? '');
    }
}
;
module.exports = Server;
