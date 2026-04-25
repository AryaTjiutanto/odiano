import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Signup = () => {
    const months = [
        { name: "Januari", value: 0 },
        { name: "Februari", value: 1 },
        { name: "Maret", value: 2 },
        { name: "April", value: 3 },
        { name: "Mei", value: 4 },
        { name: "Juni", value: 5 },
        { name: "Juli", value: 6 },
        { name: "Agustus", value: 7 },
        { name: "September", value: 8 },
        { name: "Oktober", value: 9 },
        { name: "November", value: 10 },
        { name: "Desember", value: 11 },
    ];

    const monthDropdownRef = useRef<HTMLDivElement | null>(null);
    const dayDropdownRef = useRef<HTMLDivElement | null>(null);
    const yearDropdownRef = useRef<HTMLDivElement | null>(null);

    const [selectedMonth, setSelectedMonth] = useState<number>(1);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedYear, setSelectedYear] = useState<number>(2000);

    const [monthDropdownIsOpen, setMonthDropdownIsOpen] = useState<boolean>(false);
    const [dayDropdownIsOpen, setDayDropdownIsOpen] = useState<boolean>(false);
    const [yearDropdownIsOpen, setYearDropdownIsOpen] = useState<boolean>(false);

    const selectMonth = (month: number) => {
        setSelectedMonth(month);
        setMonthDropdownIsOpen(false);
    }

    const selectDay = (day: number) => {
        setSelectedDay(day);
        setDayDropdownIsOpen(false);
    }

    const selectYear = (year: number) => {
        setSelectedYear(year);
        setYearDropdownIsOpen(false);
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
        <div className="w-full min-h-screen flex justify-center items-center">
            <div className="w-full max-w-[560px]">
                {/* singin */}
                <h1 className="text-3xl font-bold">
                    Create your account
                </h1>
                <div className="w-full flex flex-col space-y-5 mt-10">
                    <input className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="email" placeholder="youremail@email.com"></input>
                    <input className="w-full h-12 border border-neutral-200 rounded-sm placeholder:text-neutral-400 px-3 pl-6 text-sm" type="password" placeholder="password"></input>
                    <div>
                        <h2 className="font-bold">
                            Date of birthday
                        </h2>
                        <p className="text-sm text-neutral-300 mt-1">
                            This won’t be shown publicly. We only need your age to set appropriate restrictions.
                        </p>
                        <div className="mt-4 grid grid-cols-10 gap-x-3">
                            <div className="relative col-span-5" ref={monthDropdownRef}>
                                <div className="w-full flex h-14 border border-neutral-200 rounded cursor-pointer" onClick={() => setMonthDropdownIsOpen(!monthDropdownIsOpen)}>
                                    <div className="w-[88%] h-full">
                                        <div className="h-[40%] flex items-end pl-3 text-[11px] text-neutral-400">
                                            Month
                                        </div>
                                        <div className="h-[60%] pl-3">
                                            <span>{selectedMonth ? months[selectedMonth].name : "January"}</span>
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
                                                <button onClick={() => selectMonth(index)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${selectedMonth == month.value ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
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
                                                <button onClick={() => selectDay(day)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${selectedDay == day ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                                    {day}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="relative col-span-3" ref={ yearDropdownRef }>
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
                                        Array.from({length : 150}, (_, i) => new Date().getFullYear() - i).map((year) => {
                                            return (
                                                <button onClick={() => selectYear(year)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${selectedYear == year ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                                    {year}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-10">
                            create
                        </button>
                        <div className="mt-4 text-sm text-neutral-300">
                            By signing up, you agree to the <Link to={"#"} className="underline hover:text-rose-500 duration-100">Terms of Service</Link> and <Link to={"#"} className="underline hover:text-rose-500 duration-100">Privacy Policy</Link>, including <Link to={"#"} className="underline hover:text-rose-500 duration-100">Cookie Use</Link>.
                        </div>
                    </div>
                </div>

                {/* signin */}
                <div className="w-full mt-32">
                    <h1 className="text-2xl font-bold">Already have an account?</h1>
                    <Link to={"/signin"}>
                        <button className="w-full h-12 bg-white hover:bg-neutral-200 text-neutral-800 rounded-lg duration-150 cursor-pointer mt-5">
                            Signin
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup; 