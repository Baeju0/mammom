import ColorSelector from "../components/ColorSelector.tsx";
import Card from "../components/Card.tsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Input from "../components/Input.tsx";
import TextArea from "../components/TextArea.tsx";
import Button from "../components/Button.tsx";
import SymptomSelector from "../components/SymptomSelector.tsx";
import {useStore} from "../store/store.ts";

export default function WritingPage() {
    const emotionColors = useStore((state) => state.emotionColors);
    const symptoms = useStore((state) => state.symptoms);

    const [selectedColor, setSelectedColor] = useState<string>("");
    const [customColor, setCustomColor] = useState<string>("#000000");
    const [selectedSymptom, setSelectedSymptom] = useState<string>("");
    const [customSymptom, setCustomSymptom] = useState<string>("");

    const navigate = useNavigate();
    const today = new Date();

    return(
        <>
        <div className="w-full flex justify-center px-2">오늘의 감정</div>
            <ColorSelector
                emotionColors={emotionColors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                customColor={customColor}
                setCustomColor={setCustomColor}
            />

            <Card
                title="오늘의 일기"
                backable
                onBack={() => navigate(-1)}
                className="card-large"
            >
                <div className="mb-2 text-center">
                    {today.toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </div>
                <div className="flex flex-col gap-2 mb-2">
                    <div className="circle mx-auto"
                         style={{backgroundColor: selectedColor}}
                    ></div>
                    <Input
                        title="일기 제목"
                        placeholder="오늘 하루의 제목을 작성해보세요."/>
                    <TextArea
                        title="일기 내용"
                        placeholder="오늘 하루를 기록해보세요."/>
                </div>
            </Card>
            <Card
                title="오늘의 신체 증상"
                className="card-large">
                <SymptomSelector
                    symptoms={symptoms}
                    selectedSymptom={selectedSymptom}
                    setSelectedSymptom={setSelectedSymptom}
                    customSymptom={customSymptom}
                    setCustomSymptom={setCustomSymptom}
                />
                <Button>저장</Button>
            </Card>
        </>
    )
}