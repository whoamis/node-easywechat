'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const DecryptMessageMixin_1 = __importDefault(require("../Mixins/DecryptMessageMixin"));
const HandlersMixin_1 = __importDefault(require("../Mixins/HandlersMixin"));
const ResponseMessageMixin_1 = __importDefault(require("../Mixins/ResponseMessageMixin"));
const ServerRequestMixin_1 = __importDefault(require("../Mixins/ServerRequestMixin"));
const Utils_1 = require("../Support/Utils");
class ServerInterface {
    constructor() {
        this.handlers = [];
    }
    /**
     * 处理消息
     */
    async serve() { return null; }
}
;
;
(0, Utils_1.applyMixins)(ServerInterface, [HandlersMixin_1.default, DecryptMessageMixin_1.default, ResponseMessageMixin_1.default, ServerRequestMixin_1.default]);
module.exports = ServerInterface;
