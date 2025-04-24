import ColorSelector from "../components/ColorSelector.tsx";
import Card from "../components/Card.tsx";
import {useState} from "react";
import Input from "../components/Input.tsx";
import TextArea from "../components/TextArea.tsx";
import Button from "../components/Button.tsx";

export default function WritingPage() {
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [customColor, setCustomColor] = useState('#000000');

    return(
        <>
        <div className="w-full flex justify-center px-2">오늘의 감정</div>
            <ColorSelector
                customColor={customColor}
                setCustomColor={setCustomColor}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
            />

            <Card title={"오늘의 일기"} className="card-large">
                <div className="flex flex-col gap-2 mb-2">
                    <div className="circle mx-auto"
                        style={{backgroundColor: selectedColor}}
                    ></div>
                    <Input
                        title="일기 제목"
                        placeholder="오늘 하루의 제목을 작성해보세요."/>

                    <TextArea
                        title="일기 내용"
                        placeholder="오늘 하루를 기록해보세요." />
                </div>
                <Button>저장</Button>
            </Card>
        </>
    )
}