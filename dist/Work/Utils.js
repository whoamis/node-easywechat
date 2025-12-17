'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const merge_1 = __importDefault(require("merge"));
class Utils {
    constructor(app) {
        this.app = app;
    }
    /**
     * 构建jssdk配置
     * @param url 完整URL地址
     * @param jsApiList api列表，默认：[]。可用列表：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63
     * @param openTagList 开放标签列表，默认：[]。可用列表：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html#附录-所有开放标签列表
     * @param debug 是否开启调试模式，默认：false
     * @returns
     */
    async buildJsSdkConfig(url, jsApiList = [], openTagList = [], debug = false) {
        return (0, merge_1.default)({
            jsApiList,
            openTagList,
            debug,
        }, await this.app.getTicket().createConfigSignature(url));
    }
    /**
     * 构建代理应用的jssdk配置
     * @param agentId 代理应用id
     * @param url 完整URL地址
     * @param jsApiList api列表，默认：[]。可用列表：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#63
     * @param openTagList 开放标签列表，默认：[]。可用列表：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html#附录-所有开放标签列表
     * @param debug 是否开启调试模式，默认：false
     * @returns
     */
    async buildJsSdkAgentConfig(agentId, url, jsApiList = [], openTagList = [], debug = false) {
        return (0, merge_1.default)({
            jsApiList,
            openTagList,
            debug,
        }, await this.app.getTicket().createAgentConfigSignature(agentId, url));
    }
}
;
module.exports = Utils;
