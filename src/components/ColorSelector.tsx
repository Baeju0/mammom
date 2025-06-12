import {useState} from "react";
import { SketchPicker, ColorResult } from 'react-color';
import Button from "./Button.tsx";

export interface EmotionColor {
    id: number;
    name: string;
    hex_code: string;
}

interface ColorSelectorProps {
    emotionColors: EmotionColor[];
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    customColor: string;
    setCustomColor: (color: string) => void;
}

export default function ColorSelector({
    emotionColors,
    selectedColor,
    setSelectedColor,
    customColor,
    setCustomColor,
}: ColorSelectorProps) {
    const [pickerOpen, setPickerOpen] = useState(false);

    return (
        <div className="flex gap-5 justify-center">
            {emotionColors.map((color) => (
                <div key={color.id} className="circle-layout">
                    <div
                        className={`circle ${selectedColor === color.hex_code ? "picked-color" : ""}`}
                        style={{backgroundColor: color.hex_code}}
                        onClick={()=>{setSelectedColor(color.hex_code)}}
                    />
                    <span className="circle-text">{color.name}</span>
                </div>
            ))}

            <div className="circle-layout">
                <div
                    className={`circle ${!emotionColors.some((color) => color.hex_code === selectedColor) && !pickerOpen
                     ? "picked-color" : ""}`}
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