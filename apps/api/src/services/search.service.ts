import { SearchDTO } from "@odiano/shared";
import { searchUsers } from "./user.service"

export const get = async (query : string) : Promise<SearchDTO> => {
    const users = await searchUsers(query);

    return {
        users,
    }
}