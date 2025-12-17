'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const merge_1 = __importDefault(require("merge"));
const Utils_1 = require("../Support/Utils");
const HttpClient_1 = __importDefault(require("./HttpClient"));
const HttpClientMethodsMixin_1 = __importDefault(require("./Mixins/HttpClientMethodsMixin"));
const PresetMixin_1 = __importDefault(require("./Mixins/PresetMixin"));
class AccessTokenAwareClient {
    constructor(client, accessToken = null, failureJudge = null, throwError = true) {
        this.client = null;
        this.accessToken = null;
        this.client = client || HttpClient_1.default.create(null, failureJudge, throwError);
        this.accessToken = accessToken;
    }
    withAccessToken(accessToken) {
        this.accessToken = accessToken;
        return this;
    }
    getInstance() {
        return this.client.getInstance();
    }
    setInstance(instance) {
        this.client.setInstance(instance);
        return this;
    }
    setLogger(logger) {
        this.client.setLogger(logger);
        return this;
    }
    async request(method, url, payload = {}) {
        if (this.accessToken) {
            payload.params = (0, merge_1.default)(true, payload.params || {}, await this.accessToken.toQuery());
        }
        let options = this.mergeThenResetPrepends(payload, method);
        return this.client.request(method, (0, Utils_1.ltrim)(url, '\\/+'), options);
    }
}
;
(0, Utils_1.applyMixins)(AccessTokenAwareClient, [HttpClientMethodsMixin_1.default, PresetMixin_1.default]);
module.exports = AccessTokenAwareClient;
