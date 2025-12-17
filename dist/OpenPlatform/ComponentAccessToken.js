'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HttpClient_1 = __importDefault(require("../Core/HttpClient/HttpClient"));
class ComponentAccessToken {
    constructor(appId, secret, verifyTicket, key = null, cache = null, httpClient = null) {
        this.appId = appId;
        this.secret = secret;
        this.verifyTicket = verifyTicket;
        this.key = key;
        this.cache = cache;
        this.httpClient = httpClient;
        if (!this.httpClient) {
            this.httpClient = HttpClient_1.default.create({
                baseURL: 'https://api.weixin.qq.com/',
            });
        }
    }
    /**
     * 获取access_token的缓存名称
     * @returns
     */
    getKey() {
        if (!this.key) {
            this.key = `open_platform.component_access_token.${this.appId}`;
        }
        return this.key;
    }
    /**
     * 设置access_token的缓存名称
     * @param key
     * @returns
     */
    setKey(key) {
        this.key = key;
        return this;
    }
    async getToken() {
        let token = '';
        if (this.cache) {
            token = await this.cache.get(this.getKey());
        }
        if (!!token && typeof token === 'string') {
            return token;
        }
        return this.refresh();
    }
    async toQuery() {
        return {
            component_access_token: await this.getToken(),
        };
    }
    async refresh() {
        let response = (await this.httpClient.request('post', 'cgi-bin/component/api_component_token', {
            data: {
                component_appid: this.appId,
                component_appsecret: this.secret,
                component_verify_ticket: await this.verifyTicket.getTicket(),
            }
        })).toObject();
        if (!response['component_access_token']) {
            throw new Error('Failed to get component_access_token: ' + JSON.stringify(response));
        }
        if (this.cache) {
            await this.cache.set(this.getKey(), response['component_access_token'], parseInt(response['expires_in']) - 100);
        }
        return response['component_access_token'];
    }
}
module.exports = ComponentAccessToken;
