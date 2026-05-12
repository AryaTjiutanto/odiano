import { useEffect, useState } from "react";

type Props = {
    timeLeftMs: number;
    show?: "auto" | "all" | "days" | "hours" | "minutes" | "seconds";
};

const TooManyRequestCountDown = ({
    timeLeftMs,
    show = "auto",
}: Props) => {
    const [timeLeft, setTimeLeft] = useState(timeLeftMs);

    useEffect(() => {
        setTimeLeft(timeLeftMs);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1000) {
                    clearInterval(interval);
                    return 0;
                }

                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeftMs]);

    const totalSeconds = Math.floor(timeLeft / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];

    const shouldShow = (unit: Props["show"]) => {
        if (show === "all") return true;
        if (show === unit) return true;

        if (show === "auto") {
            switch (unit) {
                case "days":
                    return days > 0;
                case "hours":
                    return hours > 0 || days > 0;
                case "minutes":
                    return minutes > 0 || hours > 0 || days > 0;
                case "seconds":
                    return true;
            }
        }

        return false;
    };

    if (shouldShow("days")) {
        parts.push(`${days} day(s)`);
    }

    if (shouldShow("hours")) {
        parts.push(`${hours} hour(s)`);
    }

    if (shouldShow("minutes")) {
        parts.push(`${minutes} minute(s)`);
    }

    if (shouldShow("seconds")) {
        parts.push(`${seconds} second(s)`);
    }

    return (
        <span>
            Try again in {parts.join(" ")}
        </span>
    );
};

export default TooManyRequestCountDown;