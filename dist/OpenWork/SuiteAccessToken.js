'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HttpClient_1 = __importDefault(require("../Core/HttpClient/HttpClient"));
class SuiteAccessToken {
    constructor(suiteId, suiteSecret, suiteTicket, key = null, cache = null, httpClient = null) {
        this.suiteId = suiteId;
        this.suiteSecret = suiteSecret;
        this.suiteTicket = suiteTicket;
        this.key = key;
        this.cache = cache;
        this.httpClient = httpClient;
        if (!this.httpClient) {
            this.httpClient = HttpClient_1.default.create({
                baseURL: 'https://qyapi.weixin.qq.com/',
            });
        }
    }
    /**
     * 获取access_token的缓存名称
     * @returns
     */
    getKey() {
        if (!this.key) {
            this.key = `open_work.suite_access_token.${this.suiteId}.${this.suiteSecret}`;
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
            suite_access_token: await this.getToken(),
        };
    }
    async refresh() {
        let response = (await this.httpClient.request('post', 'cgi-bin/service/get_suite_token', {
            json: {
                suite_id: this.suiteId,
                suite_secret: this.suiteSecret,
                suite_ticket: await this.suiteTicket.getTicket(),
            }
        })).toObject();
        if (!response['suite_access_token']) {
            throw new Error('Failed to get suite_access_token: ' + JSON.stringify(response));
        }
        if (this.cache) {
            await this.cache.set(this.getKey(), response['suite_access_token'], parseInt(response['expires_in']) - 100);
        }
        return response['suite_access_token'];
    }
}
module.exports = SuiteAccessToken;
