import {useState} from "react";
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import { ko } from "date-fns/locale"
import Card from "../components/Card.tsx";
import { X } from 'lucide-react';
import { isSameDay } from "date-fns";

interface CalendarProps {
    month?: Date;
    selected: Date | null;
    onSelect: (date: Date | undefined) => void;
    recordedDate?: Date[];
}

export default function Calendar({
    month = new Date(),
    selected,
    onSelect,
    recordedDate = [],
}: CalendarProps) {
    const [showPopup, setShowPopup] = useState(false);
    const handleSelect = (date?: Date) => {
        onSelect(date);
        setShowPopup(!!date);
    };
    console.log("recordedDate:", recordedDate);

    return (
        <div className="relative w-full flex justify-center">
            <div className="w-full max-w-md">
                <DayPicker
                    locale={ko}
                    mode="single"
                    captionLayout="dropdown"
                    startMonth={new Date(2025, 0)}
                    selected={selected ?? undefined}
                    onSelect={handleSelect}
                    defaultMonth={month}
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

            {showPopup && selected && recordedDate?.some(d => isSameDay(d, selected)) && (
                <div className="popup">
                    <Card title="선택한 날짜애옹">
                        {/*임시 닫기 버튼*/}
                        <X onClick={()=>setShowPopup(!showPopup)}/>
                        {`Yo ${selected.toLocaleDateString("ko-KR")}`}
                    </Card>
                </div>
            )}
        </div>
    );
};