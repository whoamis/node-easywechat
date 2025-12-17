'use strict';
const Utils_1 = require("../Support/Utils");
class DecryptMessageMixin {
    /**
     * 解密消息
     * @returns
     */
    async decryptMessage(message, encryptor, signature, timestamp, nonce) {
        const ciphertext = message['Encrypt'];
        this.validateSignature(encryptor.getToken(), ciphertext, signature, timestamp, nonce);
        const plaintext = encryptor.decrypt(ciphertext, signature, nonce, timestamp);
        let attributes;
        if (plaintext.substring(0, 1) === '<') {
            attributes = await (0, Utils_1.parseXml)(plaintext);
        }
        else {
            attributes = JSON.parse(plaintext);
        }
        message.merge(attributes);
        return message;
    }
    validateSignature(token, ciphertext, signature, timestamp, nonce) {
        if (!signature) {
            throw new Error('Request signature must not be empty.');
        }
        let params = [token, timestamp, nonce, ciphertext];
        params.sort();
        if (signature !== (0, Utils_1.createHash)(params.join(''), 'sha1')) {
            throw new Error('Invalid request signature.');
        }
    }
}
;
module.exports = DecryptMessageMixin;
