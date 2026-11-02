import { LOCALSTORAGE_KEYS } from "../consts/localstorage";

export const getDeviceId = (): string => {
    let deviceId = localStorage.getItem(LOCALSTORAGE_KEYS.DEVICE_ID);

    if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem(LOCALSTORAGE_KEYS.DEVICE_ID, deviceId);
    }

    return deviceId;
};