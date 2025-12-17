'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const HasAttributesMixin_1 = __importDefault(require("./Mixins/HasAttributesMixin"));
const Utils_1 = require("./Support/Utils");
/**
 * 消息对象
 */
class Message {
    constructor(attributes, originContent = '') {
        /**
         * 原始消息内容
         */
        this.originContent = '';
        this.attributes = attributes;
        this.originContent = originContent;
        return new Proxy(this, {
            set: function (obj, key, val) {
                if (typeof key === 'symbol')
                    key = key.toString();
                if (typeof obj[key] !== 'undefined') {
                    obj[key] = val;
                }
                else {
                    obj.set(key, val);
                }
                return true;
            },
            get: function (obj, key) {
                if (typeof key === 'symbol')
                    key = key.toString();
                if (typeof obj[key] !== 'undefined') {
                    return obj[key];
                }
                return obj.get(key);
            }
        });
    }
    /**
     * 根据请求内容生成消息对象
     * @param request
     * @returns
     */
    static async createFromRequest(request) {
        let originContent = '';
        let body = request.getBody();
        if (body) {
            originContent = body.toString();
        }
        let attributes = {};
        if ('<' === originContent.substring(0, 1)) {
            attributes = await (0, Utils_1.parseXml)(originContent);
        }
        else {
            // Handle JSON format.
            try {
                attributes = JSON.parse(originContent);
            }
            catch (e) { }
        }
        if (Object.keys(attributes).length === 0) {
            throw new Error('Failed to decode request contents.');
        }
        return new Message(attributes, originContent);
    }
    /**
     * 获取原始消息内容
     * @returns
     */
    getOriginalContents() {
        return this.originContent;
    }
    /**
     * 转为字符串
     * @returns
     */
    toString() {
        return this.toJson();
    }
}
;
;
(0, Utils_1.applyMixins)(Message, [HasAttributesMixin_1.default]);
module.exports = Message;
