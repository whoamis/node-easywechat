"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Utils_1 = __importDefault(require("../../../MiniApp/Utils"));
class Utils extends Utils_1.default {
    constructor(app) {
        super(app);
        this.app = null;
        this.app = app;
    }
    /**
     * 代理小程序登录
     * @see https://developers.weixin.qq.com/doc/oplatform/openApi/OpenApiDoc/miniprogram-management/login/thirdpartyCode2Session.html
     * @param code
     * @returns
     */
    async code2Session(code) {
        let client = this.app.getHttpClient();
        let response = await client.request('GET', '/sns/component/jscode2session', {
            params: {
                component_access_token: await this.app.getComponentApp().getAccessToken().getToken(),
                component_appid: this.app.getComponentApp().getAccount().getAppId(),
                appid: this.app.getAccount().getAppId(),
                js_code: code,
                grant_type: 'authorization_code',
            }
        });
        let data = response.toObject();
        if (!data['openid']) {
            throw new Error(`code2Session error: ${JSON.stringify(data)}`);
        }
        return data;
    }
}
;
module.exports = Utils;
