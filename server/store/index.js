const MemoryStore = require("./Memory");

let store;

const getStore = () => {

    if (store === undefined) {
        store = new MemoryStore()
    }

    return store;
}

module.exports = getStore;