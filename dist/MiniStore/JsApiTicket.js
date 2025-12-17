'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Utils_1 = require("../Core/Support/Utils");
const AccessToken_1 = __importDefault(require("./AccessToken"));
class JsApiTicket extends AccessToken_1.default {
    /**
     * 获取jsapi_ticket的缓存名称
     * @returns
     */
    getKey() {
        if (!this.key) {
            this.key = `official_account.jsapi_ticket.${this.appId}`;
        }
        return this.key;
    }
    /**
     * 获取签名凭证jsapi_ticket
     * @returns
     */
    async getTicket() {
        let key = this.getKey();
        let ticket = '';
        if (this.cache) {
            ticket = await this.cache.get(key);
        }
        if (!!ticket && typeof ticket === 'string') {
            return ticket;
        }
        let response = (await this.httpClient.request('get', '/cgi-bin/ticket/getticket', {
            params: {
                type: 'jsapi',
            }
        })).toObject();
        if (!response['ticket']) {
            throw new Error('Failed to get jssdk_ticket: ' + JSON.stringify(response));
        }
        if (this.cache) {
            await this.cache.set(key, response['ticket'], parseInt(response['expires_in']));
        }
        return response['ticket'];
    }
    /**
     * 获取签名配置
     * @param url 完整URL地址
     * @param nonce 随机字符串，默认：随机10位
     * @param timestamp 时间长，默认：当前时间
     * @returns
     */
    async configSignature(url, nonce = null, timestamp = null) {
        nonce = nonce || (0, Utils_1.randomString)(10);
        timestamp = timestamp || (0, Utils_1.getTimestamp)();
        let ticket = await this.getTicket();
        return {
            url,
            nonceStr: nonce,
            timestamp,
            appId: this.appId,
            signature: this.getTicketSignature(ticket, nonce, timestamp, url),
        };
    }
    getTicketSignature(ticket, nonce, timestamp, url) {
        return (0, Utils_1.createHash)(`jsapi_ticket=${ticket}&noncestr=${nonce}&timestamp=${timestamp}&url=${url}`, 'sha1');
    }
}
;
module.exports = JsApiTicket;
