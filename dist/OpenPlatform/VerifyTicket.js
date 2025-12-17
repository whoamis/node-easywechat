'use strict';
class VerifyTicket {
    constructor(appId, key = null, cache = null) {
        this.appId = appId;
        this.key = key;
        this.cache = cache;
    }
    getKey() {
        if (!this.key) {
            this.key = `open_platform.verify_ticket.${this.appId}`;
        }
        return this.key;
    }
    setKey(key) {
        this.key = key;
        return this;
    }
    async setTicket(ticket) {
        if (this.cache) {
            await this.cache.set(this.getKey(), ticket, 6000);
        }
        return this;
    }
    async getTicket() {
        let ticket = '';
        if (this.cache) {
            ticket = await this.cache.get(this.getKey());
        }
        if (!ticket || typeof ticket != 'string') {
            throw new Error('No component_verify_ticket found.');
        }
        return ticket;
    }
}
;
module.exports = VerifyTicket;
