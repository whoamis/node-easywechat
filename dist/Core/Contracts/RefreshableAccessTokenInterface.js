'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const AccessTokenInterface_1 = __importDefault(require("./AccessTokenInterface"));
class RefreshableAccessTokenInterface extends AccessTokenInterface_1.default {
    /**
     * 刷新token
     * @returns
     */
    async refresh() { return null; }
}
;
module.exports = RefreshableAccessTokenInterface;
