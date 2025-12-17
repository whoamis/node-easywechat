'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const Utils_1 = require("../Core/Support/Utils");
const RSA_1 = __importDefault(require("../Core/Support/RSA"));
const Utils_2 = __importDefault(require("./Utils"));
class Validator {
    constructor(merchant) {
        this.merchant = merchant;
    }
    async validate(request) {
        [
            Validator.HEADER_TIMESTAMP,
            Validator.HEADER_NONCE,
            Validator.HEADER_SERIAL,
            Validator.HEADER_SIGNATURE,
        ].forEach(key => {
            if (!request.hasHeader(key)) {
                throw new Error(`Missing Header: ${key}`);
            }
        });
        let timestamp = request.getHeader(Validator.HEADER_TIMESTAMP) || '';
        let nonce = request.getHeader(Validator.HEADER_NONCE) || '';
        let serial = request.getHeader(Validator.HEADER_SERIAL) || '';
        let signature = request.getHeader(Validator.HEADER_SIGNATURE) || '';
        let body = request.getBody().toString();
        let message = `${timestamp}\n${nonce}\n${body}\n`;
        if ((0, Utils_1.getTimestamp)() - parseInt(timestamp) > Validator.MAX_ALLOWED_CLOCK_OFFSET) {
            throw new Error('Clock Offset Exceeded');
        }
        let publicKey = await this.merchant.getPlatformCert(serial);
        if (!publicKey) {
            throw new Error(`No platform certs found for serial: ${serial}, please download from wechat pay and set it in merchant config with key \`platform_certs\`.`);
        }
        let rsa = new RSA_1.default;
        rsa.setPublicKey(publicKey.getValue());
        if (false === rsa.verify(signature, message)) {
            throw new Error('Invalid Signature');
        }
        return true;
    }
    validateV2(message) {
        let messageSign = (message.get('sign') + '' || '').toUpperCase();
        if (!messageSign) {
            throw new Error('Missing Signature');
        }
        const utils = new Utils_2.default(this.merchant);
        let calculateSign = utils.createV2Signature(message.toObject());
        if (messageSign !== calculateSign) {
            throw new Error('Invalid Signature');
        }
        return true;
    }
}
Validator.MAX_ALLOWED_CLOCK_OFFSET = 300;
Validator.HEADER_TIMESTAMP = 'Wechatpay-Timestamp';
Validator.HEADER_NONCE = 'Wechatpay-Nonce';
Validator.HEADER_SERIAL = 'Wechatpay-Serial';
Validator.HEADER_SIGNATURE = 'Wechatpay-Signature';
module.exports = Validator;
