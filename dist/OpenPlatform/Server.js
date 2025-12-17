'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ServerInterface_1 = __importDefault(require("../Core/Contracts/ServerInterface"));
const Response_1 = __importDefault(require("../Core/Http/Response"));
const Message_1 = __importDefault(require("./Message"));
class Server extends ServerInterface_1.default {
    constructor(encryptor, request = null) {
        super();
        this.encryptor = encryptor;
        this.request = request;
        this.defaultVerifyTicketHandler = null;
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
            response = await this.transformToReply(response, message, this.encryptor);
        }
        return response;
    }
    /**
     * 处理授权成功通知
     * @param handler
     * @returns
     */
    handleAuthorized(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'authorized' ? handler(message, next) : next(message);
        });
    }
    /**
     * 处理取消授权通知
     * @param handler
     * @returns
     */
    handleUnauthorized(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'unauthorized' ? handler(message, next) : next(message);
        });
    }
    /**
     * 处理授权更新通知
     * @param handler
     * @returns
     */
    handleAuthorizeUpdated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'updateauthorized' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置默认的验证票据通知处理回调
     * @param handler
     * @returns
     */
    withDefaultVerifyTicketHandler(handler) {
        this.defaultVerifyTicketHandler = function () {
            return handler.apply(this, arguments);
        };
        this.handleVerifyTicketRefreshed(this.defaultVerifyTicketHandler);
    }
    /**
     * 处理验证票据通知
     * @param handler
     * @returns
     */
    handleVerifyTicketRefreshed(handler) {
        if (this.defaultVerifyTicketHandler) {
            this.withoutHandler(this.defaultVerifyTicketHandler);
        }
        return this.with(async function (message, next) {
            return message.InfoType === 'component_verify_ticket' ? handler(message, next) : next(message);
        });
    }
    /**
     * 处理快速注册企业小程序审核通知
     * @param handler
     * @returns
     */
    handleThirdFastRegister(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'notify_third_fasteregister' ? handler(message, next) : next(message);
        });
    }
    decryptRequestMessage() {
        return async (message, next) => {
            let query = this.request.getQueryParams();
            message = await this.decryptMessage(message, this.encryptor, query['msg_signature'] || '', query['timestamp'] || '', query['nonce'] || '');
            return next(message);
        };
    }
    /**
     * 获取来自微信服务器的推送消息
     * @param request 未设置该参数时，则从当前服务端收到的请求中获取
     * @returns
     */
    getRequestMessage(request = null) {
        return Message_1.default.createFromRequest(request || this.request);
    }
    /**
     * 获取来自微信服务器的推送消息（解密后）
     * @param request 未设置该参数时，则从当前服务端收到的请求中获取
     * @returns
     */
    async getDecryptedMessage(request = null) {
        request = request ?? this.request;
        let message = await this.getRequestMessage(request);
        let query = request.getQueryParams();
        return this.decryptMessage(message, this.encryptor, query['msg_signature'] || '', query['timestamp'] || '', query['nonce'] || '');
    }
}
;
module.exports = Server;
