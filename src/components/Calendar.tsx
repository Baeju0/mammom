import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { ko } from "date-fns/locale"

interface CalendarProps {
    selected: Date | null;
    onSelect: (date: Date | undefined) => void;
    recordedDate?: Date[];
}

export default function Calendar({
    onSelect,
    recordedDate = [],
}: CalendarProps) {

    // console.log("recordedDate:", recordedDate);

    return (
        <div className="relative w-full flex justify-center">
            <div className="w-full max-w-md">
                <DayPicker
                    locale={ko}
                    mode="single"
                    captionLayout="dropdown"
                    startMonth={new Date(2025, 0)}
                    onSelect={onSelect}
                    defaultMonth={new Date()}
                    animate
                    modifiers={{
                        today: new Date(),
                        record: recordedDate,
                        saturday: date => date.getDay() === 6,
                        sunday:   date => date.getDay() === 0,
                    }}
                    modifiersClassNames={{
                        today: "day-today",
                        selected: "day-selected",
                        record: "day-record",
                        saturday: "day-sat",
                        sunday:   "day-sun",
                    }}
                    classNames={{
                        table: "calendar-table",
                        weekday: "calendar-weekday",
                        day: "calendar-day",
                        chevron:"calendar-icon"
                    }}
                />
            </div>
        </div>
    );
};