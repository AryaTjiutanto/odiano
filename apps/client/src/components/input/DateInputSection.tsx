import { ChevronDown } from "lucide-react";
import useDropdownFloating from "../../hooks/useDropdownFloating";

type Props = {
    setDate: (date: string) => void
}

const DateInputSection = ({ setDate }: Props) => {
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

    // handler
    const handleDateFormat = (params?: { year?: number | null, month?: number | null, day?: number | null }) => {
        const monthIndex = params?.month ?? monthDropdown.value;

        const month = monthIndex != null ? monthIndex + 1 : null;
        const day = params?.day ?? dayDropdown.value;
        const year = params?.year ?? yearDropdown.value;

        const m = String(month).padStart(2, "0");
        const d = String(day).padStart(2, "0");

        const formattedDate = `${year}-${m}-${d}`;

        if (month && day && year) {
            setDate(formattedDate);
        }
    }

    // dropdown
    const monthDropdown = useDropdownFloating<number>((month: number) => handleDateFormat({ month }))
    const dayDropdown = useDropdownFloating<number>((day: number) => handleDateFormat({ day }));
    const yearDropdown = useDropdownFloating<number>((year: number) => handleDateFormat({ year }));

    return (
        <>
            <div>
                <h2 className="font-bold">
                    Date of birthday
                </h2>
                <p className="text-sm text-neutral-300 mt-1">
                    This won’t be shown publicly. We only need your age to set appropriate restrictions.
                </p>
                <div className="mt-4 w-full"></div>
                <div className="grid grid-cols-10 gap-x-3">
                    {/* month */}
                    <div className="relative col-span-4 md:col-span-5">
                        <div className="w-full flex h-14 border border-neutral-200 rounded cursor-pointer"  {...monthDropdown.getReferenceProps()} ref={monthDropdown.refs.setReference}>
                            <div className="w-[80%] md:w-[88%] h-full">
                                <div className="h-[40%] flex items-end pl-3 text-[11px] text-neutral-400">
                                    Month
                                </div>
                                <div className="h-[60%] pl-3">
                                    <span>{monthDropdown.value ? months[monthDropdown.value].name : "-"}</span>
                                </div>
                            </div>
                            <div className="w-[10%] md:w-[12%] h-full text-neutral-100 flex items-center">
                                <ChevronDown className={`${monthDropdown.isOpen ? "-rotate-180" : "rotate-0"} duration-100`} />
                            </div>
                        </div>

                        <div className={`w-full overflow-y-auto border border-neutral-200 bg-neutral-950 rounded-md duration-100 max-h-96 transition-none transition-opacity ${monthDropdown.isOpen ? "py-2 opacity-100" : "h-0 py-0 opacity-0"}`} {...monthDropdown.getFloatingProps()} ref={monthDropdown.refs.setFloating} style={monthDropdown.floatingStyles}>
                            {
                                months.map((month, index) => {
                                    return (
                                        <button key={`month-${index}`} type="button" onClick={() => monthDropdown.selectValue(index)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${monthDropdown.value == month.value ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                            {month.name}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                    {/* day */}
                    <div className="col-span-3 md:col-span-2 relative">
                        <div className="flex h-14 border border-neutral-200 rounded cursor-pointer w-full" {...dayDropdown.getReferenceProps()} ref={dayDropdown.refs.setReference}>
                            <div className="w-[60%] md:w-[70%] h-full">
                                <div className="h-[40%] flex items-end pl-3 text-[11px] text-neutral-400">
                                    Day
                                </div>
                                <div className="h-[60%] pl-3">
                                    <span>
                                        {dayDropdown.value ?? "-"}
                                    </span>
                                </div>
                            </div>
                            <div className="w-[40%] md:w-[30%] h-full text-neutral-100 flex items-center">
                                <ChevronDown className={`${dayDropdown.isOpen ? "-rotate-180" : "rotate-0"} duration-100`} />
                            </div>
                        </div>

                        <div className={`w-full overflow-y-auto border border-neutral-200 bg-neutral-950 rounded-md duration-100 max-h-96 transition-none transition-opacity ${dayDropdown.isOpen ? "py-2 opacity-100" : "h-0 py-0 opacity-0"}`} style={dayDropdown.floatingStyles} {...dayDropdown.getFloatingProps()} ref={dayDropdown.refs.setFloating}>
                            {
                                Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                    return (
                                        <button type="button" key={`day-${day}`} onClick={() => dayDropdown.selectValue(day)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${dayDropdown.value == day ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                            {day}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {/* year */}
                    <div className="relative col-span-3" {...yearDropdown.getReferenceProps()} ref={yearDropdown.refs.setReference}>
                        <div className="flex h-14 border border-neutral-200 rounded cursor-pointer w-full">
                            <div className="w-[70%] md:w-[80%] h-full">
                                <div className="h-[40%] flex items-end pl-3 text-[11px] text-neutral-400">
                                    Year
                                </div>
                                <div className="h-[60%] pl-3">
                                    <span>{yearDropdown.value ?? "-"}</span>
                                </div>
                            </div>
                            <div className="w-[30%] md:w-[20%] h-full text-neutral-100 flex items-center">
                                <ChevronDown className={`${yearDropdown.isOpen ? "-rotate-180" : "rotate-0"} duration-100`} />
                            </div>
                        </div>

                        <div className={`w-full overflow-y-auto border border-neutral-200 bg-neutral-950 rounded-md duration-100 max-h-96 transition-none transition-opacity ${yearDropdown.isOpen ? "py-2 opacity-100" : "h-0 py-0 opacity-0"}`} style={yearDropdown.floatingStyles} {...yearDropdown.getFloatingProps()} ref={yearDropdown.refs.setFloating}>
                            {
                                Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i).map((year) => {
                                    return (
                                        <button key={`year-${year}`} type="button" onClick={() => yearDropdown.selectValue(year)} className={`w-full h-10 text-left px-4 duration-100 cursor-pointer ${yearDropdown.value == year ? "bg-neutral-900" : "hover:bg-neutral-900"}`}>
                                            {year}
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DateInputSection