import {
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInYears,
} from "date-fns";

export function formatRelativeShort(date: Date) {
    const now = new Date();

    const years = differenceInYears(now, date);
    if (years > 0) return `${years}y`;

    const months = differenceInMonths(now, date);
    if (months > 0) return `${months}mo`;

    const weeks = differenceInWeeks(now, date);
    if (weeks > 0) return `${weeks}w`;

    const days = differenceInDays(now, date);
    if (days > 0) return `${days}d`;

    const hours = differenceInHours(now, date);
    if (hours > 0) return `${hours}h`;

    const minutes = differenceInMinutes(now, date);
    if (minutes > 0) return `${minutes}m`;

    return "now";
}