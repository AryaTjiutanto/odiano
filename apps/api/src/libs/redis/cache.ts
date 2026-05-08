import { redis } from "./client";

export const setCache = async (key : string, payload : object | string) => {
    let data = payload;

    if(typeof data !== "string") {
        data = JSON.stringify(data);
    }

    try {
        await redis.set(key, data);

        return true;
    } catch {
        throw new Error("Error went set the data");
    }
}

export const getCache = async (key : string) => {
    try {
        const data = await redis.get(key);

        return data;
    } catch {
        throw new Error("Error went getting the data");
    }
}

export const delCache = async (key : string) => {
    try {
        await redis.del(key);

        return true;
    } catch {
        throw new Error("Error went deleting the data");
    }
}