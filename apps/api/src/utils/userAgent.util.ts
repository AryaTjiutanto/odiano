import {UAParser} from "ua-parser-js"

type SessionDevice = {
    browser : string | null,
    os : string | null,
}

export const getSessionDevice = (userAgent:string) : SessionDevice => {
    const parser = new UAParser(userAgent);

    return {
        browser : parser.getBrowser().name || null,
        os : parser.getOS().name || null,
    }
}