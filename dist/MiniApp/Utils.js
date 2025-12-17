'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Decryptor_1 = __importDefault(require("./Decryptor"));
class Utils {
    constructor(app) {
        this.app = null;
        this.app = app;
    }
    /**
     * 登录凭证校验
     * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
     * @param code
     * @returns
     */
    async codeToSession(code) {
        let client = this.app.getHttpClient();
        let response = await (await client.request('GET', '/sns/jscode2session', {
            params: {
                appid: this.app.getAccount().getAppId(),
                secret: this.app.getAccount().getSecret(),
                js_code: code,
                grant_type: 'authorization_code',
            }
        })).toObject();
        if (!response['openid']) {
            throw new Error(`code2Session error: ${JSON.stringify(response)}`);
        }
        return response;
    }
    /**
     * 数据解密
     * @see https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/signature.html#加密数据解密算法
     * @param sessionKey
     * @param iv
     * @param ciphertext
     * @returns
     */
    decryptSession(sessionKey, iv, ciphertext) {
        return Decryptor_1.default.decrypt(sessionKey, iv, ciphertext);
    }
}
;
module.exports = Utils;
