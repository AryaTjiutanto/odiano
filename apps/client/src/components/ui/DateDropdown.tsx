import type React from "react"
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

type Payload = {
    setDate: React.Dispatch<React.SetStateAction<string>>,
}

const DateDropdown = (payload: Payload) => {
    const months = [
        { name: "January", value: 0 },
        { name: "February", value: 1 },
        { name: "March", value: 2 },
        { name: "April", value: 3 },
        { name: "May", value: 4 },
        { name: "June", value: 5 },
        { name: "July", value: 6 },
        { name: "August", value: 7 },
        { name: "September", value: 8 },
        { name: "October", value: 9 },
        { name: "November", value: 10 },
        { name: "December", value: 11 },
    ];

    const monthDropdownRef = useRef<HTMLDivElement | null>(null);
    const dayDropdownRef = useRef<HTMLDivElement | null>(null);
    const yearDropdownRef = useRef<HTMLDivElement | null>(null);

    const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedYear, setSelectedYear] = useState<number>(2010);

    const [monthDropdownIsOpen, setMonthDropdownIsOpen] = useState<boolean>(false);
    const [dayDropdownIsOpen, setDayDropdownIsOpen] = useState<boolean>(false);
    const [yearDropdownIsOpen, setYearDropdownIsOpen] = useState<boolean>(false);

    const selectMonthIndex = (month: number) => {
        setSelectedMonthIndex(month);
        setMonthDropdownIsOpen(false);
        handleDateFormat({ month });
    }

    const selectDay = (day: number) => {
        setSelectedDay(day);
        setDayDropdownIsOpen(false);
        handleDateFormat({ day });
    }

    const selectYear = (year: number) => {
        setSelectedYear(year);
        setYearDropdownIsOpen(false);
        handleDateFormat({ year });
    }

    const handleDateFormat = (params?: { year?: number, month?: number, day?: number }) => {
        const month = (params?.month ?? selectedMonthIndex) + 1;
        const day = params?.day ?? selectedDay;
        const year = params?.year ?? selectedYear;

        const m = String(month).padStart(2, "0");
        const d = String(day).padStart(2, "0");

        const formattedDate = `${year}-${m}-${d}`;
        payload.setDate(formattedDate);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
                setMonthDropdownIsOpen(false);
            }

            if (dayDropdownRef.current && !dayDropdownRef.current.contains(event.target as Node)) {
                setDayDropdownIsOpen(false);
            }

            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
                setYearDropdownIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="grid grid-cols-10 gap-x-3">
            <div className="relative col-span-5" ref={monthDropdownRef}>
                <div className="w-full flex h-14 border border-neutral-200 rounded cursor-pointer" onClick={() => setMonthDropdownIsOpen(!monthDropdownIsOpen)}>
                    <div className="w-[88%] h-full">
                        <div className="h-[40%] flex items-end pl-3 text-[11px] text-neutral-400">
                            Month
                        </div>
                        <div className="h-[60%] pl-3">
                            <span>{selectedMonthIndex ? months[selectedMonthIndex].name : "January"}</span>
                        </div>
                    </div>
                    <div className="w-[12%] h-full text-neutral-100 flex items-center">
                        <FontAwesomeIcon icon={faAngleDown} className={`${monthDropdownIsOpen ? "-rotate-180" : "rotate-0"} duration-100`} />
                    </div>
                </div>
                <div className={`w-full overflow-y-auto border border-neutral-200 absolute bg-neutral-950 rounded-b-md top-14 duration-100 ${monthDropdownIsOpen ? "h-96 py-2 opacity-100" : "h-0 py-0 opacity-0"}`}>
                    {
                        months.map((month, index) => {
                            return (
                                <button type="button" onClick={() => selectMonthIndex(index)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${selectedMonthIndex == month.value ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                    {month.name}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            <div className="col-span-2 relative" ref={dayDropdownRef}>
                <div className="flex h-14 border border-neutral-200 rounded cursor-pointer w-full" onClick={() => setDayDropdownIsOpen(!dayDropdownIsOpen)}>
                    <div className="w-[70%] h-full">
                        <div className="h-[40%] flex items-end pl-3 text-[11px] text-neutral-400">
                            Day
                        </div>
                        <div className="h-[60%] pl-3">
                            <span>{selectedDay}</span>
                        </div>
                    </div>
                    <div className="w-[30%] h-full text-neutral-100 flex items-center">
                        <FontAwesomeIcon icon={faAngleDown} className={`${dayDropdownIsOpen ? "-rotate-180" : "rotate-0"} duration-100`} />
                    </div>
                </div>
                <div className={`w-full overflow-y-auto border border-neutral-200 absolute bg-neutral-950 rounded-b-md top-14 duration-100 ${dayDropdownIsOpen ? "h-96 py-2 opacity-100" : "h-0 py-0 opacity-0"}`}>
                    {
                        Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                            return (
                                <button type="button" onClick={() => selectDay(day)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${selectedDay == day ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                    {day}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
            <div className="relative col-span-3" ref={yearDropdownRef}>
                <div className="flex h-14 border border-neutral-200 rounded cursor-pointer w-full" onClick={() => setYearDropdownIsOpen(!yearDropdownIsOpen)}>
                    <div className="w-[80%] h-full">
                        <div className="h-[40%] flex items-end pl-3 text-[11px] text-neutral-400">
                            Year
                        </div>
                        <div className="h-[60%] pl-3">
                            <span>{selectedYear}</span>
                        </div>
                    </div>
                    <div className="w-[20%] h-full text-neutral-100 flex items-center">
                        <FontAwesomeIcon icon={faAngleDown} className={`${yearDropdownIsOpen ? "-rotate-180" : "rotate-0"} duration-100`} />
                    </div>
                </div>
                <div className={`w-full overflow-y-auto border border-neutral-200 absolute bg-neutral-950 rounded-b-md top-14 duration-100 ${yearDropdownIsOpen ? "h-96 py-2 opacity-100" : "h-0 py-0 opacity-0"}`}>
                    {
                        Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i).map((year) => {
                            return (
                                <button type="button" onClick={() => selectYear(year)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${selectedYear == year ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                    {year}
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DateDropdown