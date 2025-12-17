'use strict';
const Utils_1 = require("../Support/Utils");
class HandlersMixin {
    constructor() {
        this.handlers = [];
    }
    /**
     * 获取所有处理器
     * @returns
     */
    getHandlers() {
        return this.handlers;
    }
    /**
     * 创建处理器项
     * @param handler
     * @returns
     */
    createHandlerItem(handler) {
        return {
            hash: this.getHandlerHash(handler),
            handler: handler,
        };
    }
    /**
     * 计算处理器hash
     * @param handler
     * @returns
     */
    getHandlerHash(handler) {
        return (0, Utils_1.createHash)(handler.toString(), 'md5');
    }
    /**
     * 从后添加处理器
     * @param handler
     */
    with(handler) {
        return this.withHandler(handler);
    }
    /**
     * 从后添加处理器
     * @param handler
     */
    withHandler(handler) {
        this.handlers.push(this.createHandlerItem(handler));
        return this;
    }
    /**
     * 从前添加处理器
     * @param handler
     */
    prepend(handler) {
        return this.prependHandler(handler);
    }
    /**
     * 从前添加处理器
     * @param handler
     */
    prependHandler(handler) {
        this.handlers.unshift(this.createHandlerItem(handler));
        return this;
    }
    /**
     * 删除处理器
     * @param handler
     */
    without(handler) {
        return this.withoutHandler(handler);
    }
    /**
     * 删除处理器
     * @param handler
     */
    withoutHandler(handler) {
        let index = this.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
        return this;
    }
    /**
     * 获取处理器的索引
     * @param handler
     * @returns
     */
    indexOf(handler) {
        return this.handlers.findIndex((item) => {
            return item.hash === this.getHandlerHash(handler);
        });
    }
    /**
     * 当 value 为true或者返回true时，添加处理器
     * @param value
     * @param handler
     * @returns
     */
    when(value, handler) {
        if (typeof value === 'function') {
            value = value.call(this);
        }
        if (typeof value === 'boolean' && value) {
            return this.withHandler(handler);
        }
        else if (typeof value.then === 'function') {
            value.then(val => {
                if (val) {
                    return this.withHandler(handler);
                }
                return this;
            });
        }
        return this;
    }
    /**
     * 执行处理器
     * @param result
     * @param payload
     * @returns
     */
    async handle(result, payload) {
        // 默认返回值处理函数
        let resultClosure = async (p) => { return result; };
        if (typeof result === 'function') {
            resultClosure = result;
        }
        let handlers = [...this.handlers];
        const nextClosure = async function (p) {
            if (handlers.length > 0) {
                let item = handlers.shift();
                let closureRes = await item.handler(p, nextClosure);
                if (closureRes)
                    return closureRes;
            }
            // 处理器无返回值则返回默认的返回值
            return await resultClosure(p);
        };
        // 开始处理
        return await nextClosure(payload);
    }
    /**
     * 判断处理器是否已存在
     * @param handler
     * @returns
     */
    has(handler) {
        return this.indexOf(handler) > -1;
    }
}
;
module.exports = HandlersMixin;
