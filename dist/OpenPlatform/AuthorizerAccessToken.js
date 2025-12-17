'use strict';
class AuthorizerAccessToken {
    constructor(appId, accessToken) {
        this.appId = appId;
        this.accessToken = accessToken;
    }
    /**
     * 获取appId
     * @returns
     */
    getAppId() {
        return this.appId;
    }
    async getToken() {
        return this.accessToken;
    }
    async toQuery() {
        return {
            'access_token': await this.getToken(),
        };
    }
    /**
     * 转为字符串
     * @returns
     */
    toString() {
        return this.accessToken;
    }
}
module.exports = AuthorizerAccessToken;
