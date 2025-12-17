'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const merge_1 = __importDefault(require("merge"));
const OpenWeWork_1 = require("node-socialite/dist/Providers/OpenWeWork");
const Config_1 = __importDefault(require("./Config"));
const ConfigInterface_1 = __importDefault(require("../Core/Contracts/ConfigInterface"));
const Encryptor_1 = __importDefault(require("./Encryptor"));
const AccessTokenAwareClient_1 = __importDefault(require("../Core/HttpClient/AccessTokenAwareClient"));
const CacheMixin_1 = __importDefault(require("../Core/Mixins/CacheMixin"));
const ClientMixin_1 = __importDefault(require("../Core/Mixins/ClientMixin"));
const ConfigMixin_1 = __importDefault(require("../Core/Mixins/ConfigMixin"));
const HttpClientMixin_1 = __importDefault(require("../Core/Mixins/HttpClientMixin"));
const ServerRequestMixin_1 = __importDefault(require("../Core/Mixins/ServerRequestMixin"));
const Utils_1 = require("../Core/Support/Utils");
const Account_1 = __importDefault(require("./Account"));
const Server_1 = __importDefault(require("./Server"));
const SuiteTicket_1 = __importDefault(require("./SuiteTicket"));
const SuiteEncryptor_1 = __importDefault(require("./SuiteEncryptor"));
const SuiteAccessToken_1 = __importDefault(require("./SuiteAccessToken"));
const Authorization_1 = __importDefault(require("./Authorization"));
const AuthorizerAccessToken_1 = __importDefault(require("./AuthorizerAccessToken"));
const ProviderAccessToken_1 = __importDefault(require("./ProviderAccessToken"));
const JsApiTicket_1 = __importDefault(require("./JsApiTicket"));
/**
 * 企业微信开放平台应用
 */
class Application {
    constructor(config) {
        this.account = null;
        this.encryptor = null;
        this.server = null;
        this.accessToken = null;
        this.suiteEncryptor = null;
        this.suiteAccessToken = null;
        this.suiteTicket = null;
        this.authorizerAccessToken = null;
        if (config instanceof ConfigInterface_1.default) {
            this.setConfig(config);
        }
        else {
            this.setConfig(new Config_1.default(config));
        }
    }
    getAccount() {
        if (!this.account) {
            this.account = new Account_1.default(this.config.get('corp_id'), this.config.get('provider_secret'), this.config.get('suite_id'), this.config.get('suite_secret'), this.config.get('token'), this.config.get('aes_key'));
        }
        return this.account;
    }
    /**
     * 设置当前账户实例
     * @param account
     * @returns
     */
    setAccount(account) {
        this.account = account;
        return this;
    }
    getEncryptor() {
        if (!this.encryptor) {
            let token = this.getAccount().getToken();
            let aesKey = this.getAccount().getAesKey();
            if (!token || !aesKey) {
                throw new Error('token or aes_key cannot be empty.');
            }
            this.encryptor = new Encryptor_1.default(this.getAccount().getCorpId(), token, aesKey);
        }
        return this.encryptor;
    }
    /**
     * 设置加密机实例
     * @param encryptor
     * @returns
     */
    setEncryptor(encryptor) {
        this.encryptor = encryptor;
        return this;
    }
    getSuiteEncryptor() {
        if (!this.suiteEncryptor) {
            let token = this.getAccount().getToken();
            let aesKey = this.getAccount().getAesKey();
            if (!token || !aesKey) {
                throw new Error('token or aes_key cannot be empty.');
            }
            this.suiteEncryptor = new SuiteEncryptor_1.default(this.getAccount().getSuiteId(), token, aesKey);
        }
        return this.suiteEncryptor;
    }
    /**
     * 设置授权应用的加密机实例
     * @param suiteEncryptor
     * @returns
     */
    setSuiteEncryptor(suiteEncryptor) {
        this.suiteEncryptor = suiteEncryptor;
        return this;
    }
    getServer() {
        if (!this.server) {
            this.server = new Server_1.default(this.getSuiteEncryptor(), this.getEncryptor(), this.getRequest());
            this.server.withDefaultSuiteTicketHandler(async (message, next) => {
                if (message.SuiteId === this.getAccount().getSuiteId()) {
                    await this.getSuiteTicket().setTicket(message.SuiteTicket);
                }
                return next(message);
            });
        }
        else {
            this.server.setRequest(this.getRequest());
        }
        return this.server;
    }
    /**
     * 设置服务端实例
     * @param server
     * @returns
     */
    setServer(server) {
        this.server = server;
        return this;
    }
    getProviderAccessToken() {
        if (!this.accessToken) {
            this.accessToken = new ProviderAccessToken_1.default(this.getAccount().getCorpId(), this.getAccount().getProviderSecret(), null, this.getCache(), this.getHttpClient());
        }
        return this.accessToken;
    }
    /**
     * 设置开放平台应用的AccessToken实例
     * @param accessToken
     * @returns
     */
    setProviderAccessToken(accessToken) {
        this.accessToken = accessToken;
        return this;
    }
    getSuiteAccessToken() {
        if (!this.suiteAccessToken) {
            this.suiteAccessToken = new SuiteAccessToken_1.default(this.getAccount().getSuiteId(), this.getAccount().getSuiteSecret(), this.getSuiteTicket(), null, this.getCache(), this.getHttpClient());
        }
        return this.suiteAccessToken;
    }
    /**
     * 设置授权应用的AccessToken实例
     * @param suiteAccessToken
     * @returns
     */
    setSuiteAccessToken(suiteAccessToken) {
        this.suiteAccessToken = suiteAccessToken;
        return this;
    }
    getSuiteTicket() {
        if (!this.suiteTicket) {
            this.suiteTicket = new SuiteTicket_1.default(this.getAccount().getSuiteId(), this.getCache());
        }
        return this.suiteTicket;
    }
    /**
     * 设置授权应用的Ticket实例
     * @param suiteTicket
     * @returns
     */
    setSuiteTicket(suiteTicket) {
        this.suiteTicket = suiteTicket;
        return this;
    }
    /**
     * 获取企业授权信息
     * @see https://developer.work.weixin.qq.com/document/10975#获取企业授权信息
     * @param corpId 授权方corpid
     * @param permanentCode 永久授权码，通过get_permanent_code获取
     * @param suiteAccessToken
     * @returns
     */
    async getAuthorization(corpId, permanentCode, suiteAccessToken = null) {
        if (!suiteAccessToken)
            suiteAccessToken = this.getSuiteAccessToken();
        let response = (await this.getClient().request('post', 'cgi-bin/service/get_auth_info', {
            params: {
                suite_access_token: await suiteAccessToken.getToken(),
            },
            json: {
                auth_corpid: corpId,
                permanent_code: permanentCode,
            }
        })).toObject();
        if (!response['auth_corp_info']) {
            throw new Error('Failed to get auth_corp_info: ' + JSON.stringify(response));
        }
        return new Authorization_1.default(response);
    }
    /**
     * 获取预授权码
     * @see https://developer.work.weixin.qq.com/document/10975#获取预授权码
     * @param suiteAccessToken
     * @returns
     */
    async createPreAuthorizationCode(suiteAccessToken = null) {
        if (!suiteAccessToken)
            suiteAccessToken = this.getSuiteAccessToken();
        let response = (await this.getClient().request('get', 'cgi-bin/service/get_pre_auth_code', {
            params: {
                suite_access_token: await suiteAccessToken.getToken(),
            }
        })).toObject();
        if (!response['pre_auth_code']) {
            throw new Error('Failed to get pre_auth_code: ' + JSON.stringify(response));
        }
        return response;
    }
    /**
     * 生成授权页地址
     * @see https://developer.work.weixin.qq.com/document/path/90597#从服务商网站发起
     * @param callbackUrl 授权后的回调地址
     * @param pre_auth_code 预授权码，不传则系统自动调用 createPreAuthorizationCode 获取
     * @param state
     * @returns
     */
    async createPreAuthorizationUrl(callbackUrl, pre_auth_code, state) {
        let optional = {
            pre_auth_code,
            state,
        };
        if (!optional['pre_auth_code']) {
            optional.pre_auth_code = (await this.createPreAuthorizationCode()).pre_auth_code;
        }
        let queries = (0, merge_1.default)({
            suite_id: this.getAccount().getSuiteId(),
            redirect_uri: callbackUrl,
        }, optional);
        return `https://open.work.weixin.qq.com/3rdapp/install?${(0, Utils_1.buildQueryString)(queries)}`;
    }
    /**
     * 获取企业永久授权码
     * @see https://developer.work.weixin.qq.com/document/path/90603
     * @param authCode 临时授权码
     * @param suiteAccessToken
     * @returns
     */
    async getPermanentCode(authCode, suiteAccessToken = null) {
        if (!suiteAccessToken)
            suiteAccessToken = this.getSuiteAccessToken();
        let response = (await this.getClient().request('post', '/cgi-bin/service/get_permanent_code', {
            params: {
                auth_code: authCode,
                suite_access_token: await suiteAccessToken.getToken(),
            }
        })).toObject();
        if (!response['permanent_code']) {
            throw new Error('Failed to get permanent_code: ' + JSON.stringify(response));
        }
        return response;
    }
    /**
     * 获取企业授权令牌
     * @param corpId
     * @param permanentCode
     * @param suiteAccessToken
     * @returns
     */
    async getAuthorizerAccessToken(corpId, permanentCode, suiteAccessToken = null) {
        if (!suiteAccessToken)
            suiteAccessToken = this.getSuiteAccessToken();
        return new AuthorizerAccessToken_1.default(corpId, permanentCode, suiteAccessToken, null, this.getCache(), this.getHttpClient());
    }
    createClient() {
        return (new AccessTokenAwareClient_1.default(this.getHttpClient(), this.getProviderAccessToken(), (response) => response.toObject()['errcode'] ?? 0, this.getConfig().get('http.throw', true)))
            .setPresets(this.getConfig().all());
    }
    async getAuthorizerClient(corpId, permanentCode, suiteAccessToken = null) {
        return (new AccessTokenAwareClient_1.default(this.getHttpClient(), await this.getAuthorizerAccessToken(corpId, permanentCode, suiteAccessToken), (response) => response.toObject()['errcode'] ?? 0, this.getConfig().get('http.throw', true)))
            .setPresets(this.getConfig().all());
    }
    async getJsApiTicket(corpId, permanentCode, suiteAccessToken = null) {
        return new JsApiTicket_1.default(corpId, null, this.getCache(), await this.getAuthorizerClient(corpId, permanentCode, suiteAccessToken));
    }
    async getOAuth(suiteId, suiteAccessToken = null) {
        if (!suiteAccessToken)
            suiteAccessToken = this.getSuiteAccessToken();
        return (new OpenWeWork_1.OpenWeWork({
            client_id: suiteId,
            client_secret: '',
            redirect: this.getConfig().get('oauth.redirect_url'),
        }))
            .withSuiteTicket(await this.getSuiteTicket().getTicket())
            .withSuiteAccessToken(await suiteAccessToken.getToken())
            .scopes(this.getConfig().get('oauth.scopes', 'snsapi_base'));
    }
    async getCorpOAuth(corpId, suiteAccessToken = null) {
        if (!suiteAccessToken)
            suiteAccessToken = this.getSuiteAccessToken();
        return (new OpenWeWork_1.OpenWeWork({
            client_id: corpId,
            client_secret: '',
            redirect: this.getConfig().get('oauth.redirect_url'),
        }))
            .withSuiteTicket(await this.getSuiteTicket().getTicket())
            .withSuiteAccessToken(await suiteAccessToken.getToken())
            .scopes(this.getConfig().get('oauth.scopes', 'snsapi_base'));
    }
    /**
     * 获取请求默认配置
     * @returns
     */
    getHttpClientDefaultOptions() {
        return (0, merge_1.default)(true, {
            baseURL: 'https://api.weixin.qq.com/',
        }, this.getConfig().get('http', {}));
    }
}
;
;
(0, Utils_1.applyMixins)(Application, [ConfigMixin_1.default, CacheMixin_1.default, ClientMixin_1.default, ServerRequestMixin_1.default, HttpClientMixin_1.default]);
module.exports = Application;
