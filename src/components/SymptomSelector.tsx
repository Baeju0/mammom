import Input from "./Input.tsx";
import {SYMPTOMS} from "../util/symptomOption.ts";

interface SymptomSelectorProps {
    selectedSymptom: string;
    setSelectedSymptom: (symptoms: string) => void;
    customSymptom?: string;
    setCustomSymptom?: (symptoms: string) => void
}

export default function SymptomSelector({
      selectedSymptom,
      setSelectedSymptom,
      customSymptom,
      setCustomSymptom,
}: SymptomSelectorProps) {
    const isCustom = selectedSymptom === '기타';

    return (
        <div className="flex flex-col items-center gap-4 mb-3">
            <div className="flex flex-wrap gap-2 justify-center">
                {SYMPTOMS.map(({ value, label, icon }) => (
                    <button
                        key={value}
                        type="button"
                        className={`px-4 py-1 rounded-full border flex items-center gap-1
                    ${selectedSymptom === value
                            ? "bg-pink-200 border-pink-400 font-bold"
                            : "bg-white border-gray-300"}`}
                        onClick={() => {
                            setSelectedSymptom?.(label);
                            if (value !== "기타") {
                                setCustomSymptom?.("");
                            }
                        }}
                    >
                        <span>{icon}</span>
                        <span>{label}</span>
                    </button>
                ))}
            </div>
            {isCustom && (
                <Input
                    title="기타 선택 시 신체 증상 입력"
                    placeholder="신체 증상을 입력하세요!"
                    value={customSymptom}
                    onChange={e => {
                        setCustomSymptom?.(e.target.value);
                    }}
                />
            )}
        </div>
    );
}