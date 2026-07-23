import { redis } from "./client";

type CacheOptions = {
    NX? : boolean,
    PX? : number,
};

export const setCache = async (key : string, payload : object | string | number, options : CacheOptions) => {
    let data = typeof payload == "object" ? JSON.stringify(payload) : payload;

    try {
        if(options.NX && options.PX) {
            await redis.set(key, data, "PX", options.PX, "NX");
        } else if(options.NX) {
            await redis.set(key, data, "NX");
        } else if(options.PX) {
            await redis.set(key, data, "PX", options.PX);
        } else {
            await redis.set(key, data);
        }

        return true;
    } catch {
        throw new Error("Error went set the data");
    }
}

export const getCache = async <T>(key : string) : Promise<T | null> => {
    try {
        const cache = await redis.get(key);

        if(!cache) {
            return null;
        }

        try {
            return JSON.parse(cache);
        } catch {
            return cache as T
        }
    } catch {
        throw new Error("Failed to get cache");
    }
}

export const delCache = async (key : string) => {
    try {
        await redis.del(key);

        return true;
    } catch {
        throw new Error("Failed to delete cache");
    }
}

export const getCachePTTL = async (key : string) => {
    try {
        const ttl = await redis.pttl(key);

        if(ttl === -2) {
            return null;
        }

        if(ttl === -1) {
            return Infinity;
        }

        return ttl;
    } catch {
        throw new Error("Failed to get Cache TTL");
    }
}