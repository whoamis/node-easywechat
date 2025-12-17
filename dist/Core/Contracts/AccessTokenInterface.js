'use strict';
class AccessTokenInterface {
    /**
     * 获取token
     * @returns
     */
    async getToken() { return null; }
    /**
     * 转成url参数
     * @returns
     */
    async toQuery() { return null; }
}
;
module.exports = AccessTokenInterface;
