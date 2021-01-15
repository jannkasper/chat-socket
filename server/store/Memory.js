
class MemoryStore {
    constructor() {
        this.store = {};
    }

    async get(key, field) {
        if (this.store[key] === undefined || this.store[key][field] === undefined) {
            return null;
        }
        return this.store[key][field];
    }

    async getAll(key) {
        if (this.store[key] === undefined) {
            return null;
        }
        return this.store[key];
    }

    async set(key, field, value) {
        if (this.store[key] === undefined) {
            this.store[key] = {};
        }
        this.store[key][field] = value;
        return 1;
    }

    async del(key, field){
        if (this.store[key] === undefined || this.store[key][field] === undefined) {
            return 0;
        }
        delete this.store[key][field];
        return 1;
    }

    async inc(key, field, inc = 1) {
        if (this.store[key] === undefined) {
            this.store[key] = {};
        }
        if (this.store[key][field] === undefined) {
            this.store[key][field] = 0;
        }
        if (Number.isInteger(this.store[key][field])) {
            this.store[key][field] += inc;
            return this.store[key][field];
        }

        return null;
    }
}

module.exports = MemoryStore