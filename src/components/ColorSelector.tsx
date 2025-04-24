import {useState} from "react";
import { SketchPicker, ColorResult } from 'react-color';
import Button from "./Button.tsx";

interface ColorSelectorProps {
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    customColor: string;
    setCustomColor: (color: string) => void;
}

export default function ColorSelector({
    selectedColor,
    setSelectedColor,
    customColor,
    setCustomColor,
}: ColorSelectorProps) {
    const [pickerOpen, setPickerOpen] = useState(false);

    const BASED_COLORS = [
        {color: "#FFD600", label: "기쁨"},
        {color: "#2196F3", label: "슬픔"},
        {color: "#FF1744", label: "화남"},
        {color: "#9E9E9E", label: "우울"},
        {color: "#80D8FF", label: "평온"},
    ];

    return (
        <div className="flex gap-5 justify-center">
            {BASED_COLORS.map(({color, label}, i) => (
                <div key={i} className="circle-layout">
                    <div
                        className={`circle ${selectedColor === color ? 'picked-color' : ''}`}
                        style={{backgroundColor: color}}
                        onClick={()=>{setSelectedColor(color)}}
                    />
                    <span className="circle-text">{label}</span>
                </div>
            ))}

            <div className="circle-layout">
                <div
                    className="circle"
                    style={{background: customColor}}
                    onClick={() => setPickerOpen(true)}
                />
                <span className="circle-text">기타</span>
                {pickerOpen && (
                    <div className="color-palette">
                        <SketchPicker
                            color={customColor}
                            onChange={(color: ColorResult) => setCustomColor(color.hex)}
                        />
                        <div className="flex flex-row justify-center gap-2 mt-2">
                            <Button
                                onClick={() => {
                                        setSelectedColor(customColor);
                                        setPickerOpen(false)}}>
                                완료
                            </Button>
                            <Button
                                className="btn-cancel"
                                onClick={() => setPickerOpen(false)}>
                                취소
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}