import {useState} from "react";
import { SketchPicker, ColorResult } from 'react-color';
import Button from "./Button.tsx";

export default function ColorSelector() {
    const [customColor, setCustomColor] = useState('#000000');
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
                        className="circle"
                        style={{backgroundColor: color}}
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
                                className="mx-auto mt-2"
                                onClick={() => setPickerOpen(false)}>
                                완료
                            </Button>
                            <Button
                                className="mx-auto mt-2 btn-cancel"
                                onClick={() => {
                                    setPickerOpen(false)
                                    setCustomColor("#000000")
                                }}>
                                취소
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}