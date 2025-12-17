'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Server_1 = __importDefault(require("../OfficialAccount/Server"));
class Server extends Server_1.default {
    /**
     * 添加普通消息处理器
     * @deprecated 视频号不支持普通消息
     */
    addMessageListener() {
        return this;
    }
}
;
module.exports = Server;
