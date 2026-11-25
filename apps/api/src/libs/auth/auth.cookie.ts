import { CookieOptions } from "express";
import { generateCookieOptions } from "../../utils/cookieOptions.js";

const oneDayAge = 1 * 24 * 60 * 60 * 1000;

export const authCookieOptions = () : CookieOptions => generateCookieOptions(oneDayAge * 30, true);