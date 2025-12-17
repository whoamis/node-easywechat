'use strict';
class SuiteTicket {
    constructor(suiteId, cache = null, key = null) {
        this.suiteId = suiteId;
        this.cache = cache;
        this.key = key;
    }
    getKey() {
        if (!this.key) {
            this.key = `open_work.suite_ticket.${this.suiteId}`;
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
            throw new Error('No suite_ticket found.');
        }
        return ticket;
    }
}
;
module.exports = SuiteTicket;
