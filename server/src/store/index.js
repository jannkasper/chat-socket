import MemoryStore from "./Memory.js";
import RedisStore from "./Redis.js";

let store;

const getStore = () => {

    if (store === undefined) {
        const storeBackend = process.env.STORE_BACKEND || "redis";
        const storeHost = process.env.STORE_HOST || process.env.REDIS_URL;
        
        switch (storeBackend) {
            case "redis":
                store = new RedisStore(storeHost);
                break;
            case "memory":
            default:
                store = new MemoryStore();
                break;
        }
    }

    return store;
}

export default getStore;