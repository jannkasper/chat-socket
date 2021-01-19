import MemoryStore from "./Memory.js";

let store;

const getStore = () => {

    if (store === undefined) {
        store = new MemoryStore()
    }

    return store;
}

export default getStore;