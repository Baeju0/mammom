import Input from "./Input.tsx";

import {Symptom} from "../store/store.ts";

interface SymptomSelectorProps {
    symptoms: Symptom[];
    selectedSymptomId: number | null;
    setSelectedSymptomId: (id: number | null) => void;
    customSymptom?: string;
    setCustomSymptom?: (custom_symptom: string) => void
}

export default function SymptomSelector({
      symptoms,
      selectedSymptomId,
      setSelectedSymptomId,
      customSymptom,
      setCustomSymptom,
}: SymptomSelectorProps) {
    const isCustom = selectedSymptomId === null;

    return (
        <div className="flex flex-col items-center gap-4 mb-3">
            <div className="flex flex-wrap gap-2 justify-center">
                {symptoms.map((symptom) => (
                    <button
                        key={symptom.id}
                        type="button"
                        className={`px-4 py-1 rounded-full border flex items-center gap-1
                    ${selectedSymptomId === symptom.id
                            ? "bg-pink-200 border-pink-400 font-bold"
                            : "bg-white border-gray-300"}`}
                        onClick={() => {
                            setSelectedSymptomId?.(symptom.id);
                            setCustomSymptom?.("");
                        }}
                    >
                        <span>{symptom.emoji}</span>
                        <span>{symptom.name}</span>
                    </button>
                ))}
                <button
                    type="button"
                    className={`px-4 py-1 rounded-full border flex items-center gap-1
                    ${isCustom 
                    ? "bg-pink-200 border-pink-400 font-bold"
                    : "bg-white border-gray-300"}`}
                    onClick={() => {
                        setSelectedSymptomId(null);
                        setCustomSymptom?.("");
                    }}
                >
                    <span>🤔</span>
                    <span>기타</span>
                </button>
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