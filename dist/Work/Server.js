'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ServerInterface_1 = __importDefault(require("../Core/Contracts/ServerInterface"));
const Response_1 = __importDefault(require("../Core/Http/Response"));
const Message_1 = __importDefault(require("./Message"));
class Server extends ServerInterface_1.default {
    constructor(encryptor, request = null) {
        super();
        this.encryptor = encryptor;
        this.request = request;
    }
    /**
     * 服务端消息处理
     * @returns
     */
    async serve() {
        let query = this.request.getQueryParams();
        if (!!query['echostr']) {
            let echostr = this.encryptor.decrypt(query['echostr'], query['msg_signature'] ?? '', query['nonce'] ?? '', query['timestamp'] ?? '');
            return new Response_1.default(200, { 'Content-Type': 'text/html' }, echostr);
        }
        let message = await this.getRequestMessage(this.request);
        if (this.encryptor && query['msg_signature']) {
            this.prepend(this.decryptRequestMessage());
        }
        let response = await this.handle(new Response_1.default(200, {}, 'SUCCESS'), message);
        if (!(response instanceof Response_1.default)) {
            response = await this.transformToReply(response, message, this.encryptor);
        }
        return response;
    }
    /**
     * 设置联系人变化的消息处理器
     * @param handler
     */
    handleContactChanged(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户标签变化的消息处理器
     * @param handler
     */
    handleUserTagUpdated(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' && message.ChangeType === 'update_tag' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户创建的消息处理器
     * @param handler
     */
    handleUserCreated(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' && message.ChangeType === 'create_user' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户更新的消息处理器
     * @param handler
     */
    handleUserUpdated(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' && message.ChangeType === 'update_user' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置用户删除的消息处理器
     * @param handler
     */
    handleUserDeleted(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' && message.ChangeType === 'delete_user' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置部门创建的消息处理器
     * @param handler
     */
    handlePartyCreated(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' && message.ChangeType === 'create_party' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置部门更新的消息处理器
     * @param handler
     */
    handlePartyUpdated(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' && message.ChangeType === 'update_party' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置部门删除的消息处理器
     * @param handler
     */
    handlePartyDeleted(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'change_contact' && message.ChangeType === 'delete_party' ? handler(message, next) : next(message);
        });
    }
    /**
     * 设置异步任务完成的消息处理器
     * @param handler
     */
    handleBatchJobsFinished(handler) {
        return this.with(async function (message, next) {
            return message.Event === 'batch_job_result' ? handler(message, next) : next(message);
        });
    }
    /**
     * 添加普通消息处理器
     * @param type
     * @param handler
     * @returns
     */
    addMessageListener(type, handler) {
        return this.withHandler(async function (message, next) {
            return message.MsgType === type ? handler(message, next) : next(message);
        });
    }
    /**
     * 添加事件消息处理器
     * @param event
     * @param handler
     * @returns
     */
    addEventListener(event, handler) {
        return this.withHandler(async function (message, next) {
            return message.Event === event ? handler(message, next) : next(message);
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
    validateUrl() {
        return async (message, next) => {
            let query = this.request.getQueryParams();
            if (!this.encryptor)
                return null;
            let echostr = this.encryptor.decrypt(query['echostr'], query['msg_signature'] ?? '', query['timestamp'] ?? '', query['nonce'] ?? '');
            return new Response_1.default(200, { 'Content-Type': 'text/html' }, echostr);
        };
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
