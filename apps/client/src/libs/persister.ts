import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client";
import {set, get, del} from "idb-keyval";

export function createIDBPersister(key : string = "react-query") : Persister {
    return {
        persistClient : async (client : PersistedClient) => {
            await set(key, client);
        },
        removeClient: async () => {
            await del(key);
        },
        restoreClient : async() => {
            return await get<PersistedClient>(key);
        }
    }
}