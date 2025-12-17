'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ServerInterface_1 = __importDefault(require("../Core/Contracts/ServerInterface"));
const Response_1 = __importDefault(require("../Core/Http/Response"));
const Message_1 = __importDefault(require("./Message"));
const AES_1 = require("../Core/Support/AES");
const Utils_1 = require("../Core/Support/Utils");
class Server extends ServerInterface_1.default {
    constructor(merchant = null, request = null) {
        super();
        this.merchant = merchant;
        this.request = request;
    }
    /**
     * 服务端消息处理
     * @returns
     */
    async serve() {
        let message = await this.getRequestMessage();
        let isV2Message = message.getOriginalContents().startsWith('<xml');
        try {
            let defaultResponse;
            if (isV2Message) {
                defaultResponse = new Response_1.default(200, {}, (0, Utils_1.buildXml)({ return_code: 'SUCCESS', return_msg: '' }));
            }
            else {
                defaultResponse = new Response_1.default(200, {}, JSON.stringify({ code: 'SUCCESS', message: '成功' }));
            }
            let response = await this.handle(defaultResponse, message);
            if (!(response instanceof Response_1.default)) {
                response = defaultResponse;
            }
            return response;
        }
        catch (e) {
            if (isV2Message) {
                return new Response_1.default(200, {}, (0, Utils_1.buildXml)({ return_code: 'ERROR', return_msg: e.message }));
            }
            else {
                return new Response_1.default(200, {}, JSON.stringify({ code: 'ERROR', message: e.message }));
            }
        }
    }
    /**
     * 获取来自微信服务器的推送消息
     * @param request 未设置该参数时，则从当前服务端收到的请求中获取
     * @returns
     */
    async getRequestMessage(request = null) {
        if (!request) {
            request = this.request;
        }
        let originContent = '';
        let body = request.getBody();
        if (body) {
            originContent = body.toString();
        }
        let attributes = await request.getParsedBody();
        if (originContent.startsWith('<xml')) {
            attributes = await this.decodeXmlMessage(attributes);
        }
        else {
            attributes = this.decodeJsonMessage(attributes);
        }
        return new Message_1.default(attributes, originContent);
    }
    async decodeXmlMessage(attributes) {
        if (attributes['req_info']) {
            let key = this.merchant.getV2SecretKey();
            if (!key) {
                throw new Error('V2 secret key is required');
            }
            attributes = await (0, Utils_1.parseXml)(AES_1.AES.decrypt(attributes['req_info'], (0, Utils_1.createHash)(key, 'md5'), '', true, 'aes-256-ecb').toString());
        }
        if (!attributes || Object.keys(attributes).length === 0) {
            throw new Error('Failed to decrypt request message');
        }
        return attributes;
    }
    decodeJsonMessage(attributes) {
        if (!attributes || Object.keys(attributes).length === 0) {
            throw new Error('Invalid request body.');
        }
        if (!attributes['resource']['ciphertext']) {
            throw new Error('Invalid request.');
        }
        try {
            let decryptMessage = AES_1.AES_GCM.decrypt(attributes['resource']['ciphertext'], this.merchant.getSecretKey(), attributes['resource']['nonce'], attributes['resource']['associated_data']);
            attributes = JSON.parse(decryptMessage.toString());
        }
        catch (e) {
            throw new Error('Failed to decrypt request message.');
        }
        return attributes;
    }
    /**
     * 获取解密后的消息
     * @param request
     * @returns
     */
    getDecryptedMessage(request = null) {
        return this.getRequestMessage(request);
    }
    /**
     * 处理付款回调
     * @param handler 消息处理器，需要接受两个参数，参数1是消息，参数2是下一个消息处理器
     * @returns
     */
    handlePaid(handler) {
        this.with(async (message, next) => {
            let isV2Message = message.getOriginalContents().startsWith('<xml');
            if (isV2Message) {
                return handler(message, next);
            }
            return message.getEventType() === 'TRANSACTION.SUCCESS' && message.trade_state === 'SUCCESS'
                ? handler(message, next) : next(message);
        });
        return this;
    }
    /**
     * 处理退款回调
     * @param handler 消息处理器，需要接受两个参数，参数1是消息，参数2是下一个消息处理器
     * @returns
     */
    handleRefunded(handler) {
        this.with(async (message, next) => {
            let eventType = message.getEventType();
            return [
                'REFUND.SUCCESS',
                'REFUND.ABNORMAL',
                'REFUND.CLOSED',
            ].findIndex(o => o === eventType) > -1 ? handler(message, next) : next(message);
        });
        return this;
    }
}
;
module.exports = Server;
