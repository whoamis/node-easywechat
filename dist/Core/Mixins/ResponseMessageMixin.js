'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const merge_1 = __importDefault(require("merge"));
const Response_1 = __importDefault(require("../Http/Response"));
const Utils_1 = require("../Support/Utils");
class ResponseMessageMixin {
    /**
     * 转化为回复消息
     * @returns
     */
    async transformToReply(response, message, encryptor = null, isXml = true) {
        if (!response || response === true) {
            return new Response_1.default(200, {}, 'success');
        }
        let attributes = merge_1.default.recursive({
            ToUserName: message['FromUserName'],
            FromUserName: message['ToUserName'],
            CreateTime: (0, Utils_1.getTimestamp)(),
        }, await this.normalizeResponse(response));
        if (isXml) {
            return this.createXmlResponse(attributes, encryptor);
        }
        else {
            return this.createJsonResponse(attributes, encryptor);
        }
    }
    async normalizeResponse(response) {
        if (typeof response === 'function') {
            response = await response();
        }
        if (typeof response === 'object') {
            if (!response['MsgType']) {
                throw new Error('`MsgType` cannot be empty.');
            }
            return response;
        }
        if (typeof response === 'string' || typeof response === 'number') {
            return {
                MsgType: 'text',
                Content: response,
            };
        }
        throw new Error(`Invalid Response "${response.toString()}".`);
    }
    createXmlResponse(attributes, encryptor = null) {
        let xml = (0, Utils_1.buildXml)(attributes);
        return new Response_1.default(200, {
            'Content-Type': 'text/xml'
        }, encryptor ? encryptor.encrypt(xml) : xml);
    }
    createJsonResponse(attributes, encryptor = null) {
        let json = JSON.stringify(attributes);
        return new Response_1.default(200, {
            'Content-Type': 'application/json'
        }, encryptor ? encryptor.encrypt(json) : json);
    }
}
;
module.exports = ResponseMessageMixin;
