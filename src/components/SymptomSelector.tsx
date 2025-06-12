import Input from "./Input.tsx";

export interface Symptoms {
    id : number;
    name : string;
    emoji : string;
}

interface SymptomSelectorProps {
    symptoms: Symptoms[];
    selectedSymptom: string;
    setSelectedSymptom: (symptoms: string) => void;
    customSymptom?: string;
    setCustomSymptom?: (symptoms: string) => void
}

export default function SymptomSelector({
      symptoms,
      selectedSymptom,
      setSelectedSymptom,
      customSymptom,
      setCustomSymptom,
}: SymptomSelectorProps) {
    const isCustom = selectedSymptom === "기타";

    return (
        <div className="flex flex-col items-center gap-4 mb-3">
            <div className="flex flex-wrap gap-2 justify-center">
                {symptoms.map((symptom) => (
                    <button
                        key={symptom.id}
                        type="button"
                        className={`px-4 py-1 rounded-full border flex items-center gap-1
                    ${selectedSymptom === symptom.name
                            ? "bg-pink-200 border-pink-400 font-bold"
                            : "bg-white border-gray-300"}`}
                        onClick={() => {
                            setSelectedSymptom?.(symptom.name);
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
                        setSelectedSymptom?.("기타");
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