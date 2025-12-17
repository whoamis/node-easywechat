'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ServerInterface_1 = __importDefault(require("../Core/Contracts/ServerInterface"));
const Response_1 = __importDefault(require("../Core/Http/Response"));
const Message_1 = __importDefault(require("./Message"));
class Server extends ServerInterface_1.default {
    constructor(encryptor, providerEncryptor, request = null) {
        super();
        this.encryptor = encryptor;
        this.providerEncryptor = providerEncryptor;
        this.request = request;
        this.defaultSuiteTicketHandler = null;
    }
    /**
     * 服务端消息处理
     * @returns
     */
    async serve() {
        let query = this.request.getQueryParams();
        if (!!query['echostr']) {
            let echostr = this.providerEncryptor.decrypt(query['echostr'], query['msg_signature'] ?? '', query['nonce'] ?? '', query['timestamp'] ?? '');
            return new Response_1.default(200, { 'Content-Type': 'text/html' }, echostr);
        }
        let message = await this.getRequestMessage(this.request);
        if (this.encryptor && query['msg_signature']) {
            this.prepend(this.decryptRequestMessage());
        }
        let response = await this.handle(new Response_1.default(200, {}, 'success'), message);
        if (!(response instanceof Response_1.default)) {
            response = await this.transformToReply(response, message, this.encryptor);
        }
        return response;
    }
    withDefaultSuiteTicketHandler(handler) {
        this.defaultSuiteTicketHandler = function () {
            return handler.call(null, arguments);
        };
        return this.handleSuiteTicketRefreshed(handler);
    }
    /**
     * 设置联系人变化的消息处理器
     * @param handler
     */
    handleSuiteTicketRefreshed(handler) {
        if (this.defaultSuiteTicketHandler) {
            this.withoutHandler(this.defaultSuiteTicketHandler);
        }
        return this.with(async function (message, next) {
            return message.InfoType === 'suite_ticket' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置授权成功的消息处理器
     * @param handler
     */
    handleAuthCreated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'create_auth' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置变更授权的消息处理器
     * @param handler
     */
    handleAuthUpdated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_auth' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置取消授权的消息处理器
     * @param handler
     */
    handleAuthCancelled(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'cancel_auth' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户创建的消息处理器
     * @param handler
     */
    handleUserCreated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_contact' && message.ChangeType === 'create_user' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户更新的消息处理器
     * @param handler
     */
    handleUserUpdated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_contact' && message.ChangeType === 'update_user' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户删除的消息处理器
     * @param handler
     */
    handleUserDeleted(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_contact' && message.ChangeType === 'delete_user' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置部门创建的消息处理器
     * @param handler
     */
    handlePartyCreated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_contact' && message.ChangeType === 'create_party' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置部门更新的消息处理器
     * @param handler
     */
    handlePartyUpdated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_contact' && message.ChangeType === 'update_party' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置部门删除的消息处理器
     * @param handler
     */
    handlePartyDeleted(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_contact' && message.ChangeType === 'delete_party' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户标签变化的消息处理器
     * @param handler
     */
    handleUserTagUpdated(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'change_contact' && message.ChangeType === 'update_tag' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置共享应用事件的消息处理器
     * @param handler
     */
    handleShareAgentChanged(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'share_agent_change' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置重置永久授权码的消息处理器
     * @param handler
     */
    handleResetPermanentCode(handler) {
        return this.with(async function (message, next) {
            return message.InfoType === 'reset_permanent_code' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置应用管理员变更的消息处理器
     * @param handler
     */
    handleChangeAppAdmin(handler) {
        return this.with(async function (message, next) {
            return message.MsgType === 'event' && message.Event === 'change_app_admin' ? handler(message, next) : next(message);
        });
    }
    /**
     * 获取来自微信服务器的推送消息
     * @param request 未设置该参数时，则从当前服务端收到的请求中获取
     * @returns
     */
    getRequestMessage(request = null) {
        return Message_1.default.createFromRequest(request ?? this.request);
    }
    decryptRequestMessage() {
        return async (message, next) => {
            let query = this.request.getQueryParams();
            message = await this.decryptMessage(message, this.encryptor, query['msg_signature'] ?? '', query['timestamp'] ?? '', query['nonce'] ?? '');
            return next(message);
        };
    }
    /**
     * 获取解密后的消息
     * @param request 未设置该参数时，则从当前服务端收到的请求中获取
     * @returns
     */
    async getDecryptedMessage(request = null) {
        request = request ?? this.request;
        let message = await this.getRequestMessage(request);
        let query = request.getQueryParams();
        if (!this.encryptor || !query['msg_signature']) {
            return message;
        }
        return await this.decryptMessage(message, this.encryptor, query['msg_signature'] ?? '', query['timestamp'] ?? '', query['nonce'] ?? '');
    }
}
;
module.exports = Server;
