import { LOCALSTORAGE_KEYS } from "../consts/localstorage";

export const setRequireVerification = () => {
    localStorage.setItem(LOCALSTORAGE_KEYS.REQUIRE_VERIFICATION, "1");
}

export const isRequireVerification = () => {
    return localStorage.getItem(LOCALSTORAGE_KEYS.REQUIRE_VERIFICATION) === "1";
}

export const removeRequireVerification = () => {
    localStorage.removeItem(LOCALSTORAGE_KEYS.REQUIRE_VERIFICATION);
}