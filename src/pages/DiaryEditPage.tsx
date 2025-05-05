import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { isLightColor } from "../util/isLightColor";
import Circle from "../components/Circle.tsx";
import ColorSelector from "../components/ColorSelector.tsx";
import Popup from "../components/Popup.tsx";
import SymptomSelector from "../components/SymptomSelector.tsx";
import {SYMPTOMS} from "../util/symptomOption.ts";
import {BASED_COLORS} from "../util/colorOption.ts";

// 나중에 DB에 저장 할 데이터의 예시
// const diaryDetail = {
//     id: 1,
//     date: "2025-05-01",
//     title: "행복한 하루",
//     emotion: { name: "기쁨", color: "#FFD600" },
//     symptom: "😊",
//     content: "오늘은 날씨가 좋아서 산책을 다녀왔다! 행복했다!",
// };

export default function DiaryEditPage() {
    const [date, setDate] = useState("2025-05-05");
    const [title, setTitle] = useState("일기 제목임니다.");
    const [emotion, setEmotion] = useState({ color: "#FFD600", label: "기쁨"});
    const [symptom, setSymptom] = useState<string>("");
    const [content, setContent] = useState("일기 내용 부분임니다.");

    const [tempSymptom, setTempSymptom] = useState<string>(symptom);
    const [selectedColor, setSelectedColor] = useState(emotion.color);
    const [customColor, setCustomColor] = useState(emotion.color);
    const textColor = isLightColor(selectedColor) ? "#222" : "#fff";

    const navigate = useNavigate();
    const [colorSelectorOpen, setColorSelectorOpen] = useState(false);
    const [symptomSelectorOpen, setSymptomSelectorOpen] = useState(false);

    const currentSymptom = SYMPTOMS.find(o => o.value === symptom);

    return (
        <div className="edit-container">
            <Card title="일기 수정" backable onBack={() => navigate(-1)} className="card-large">
                <div className="mb-2 text-center">
                    {date}
                </div>

                <div className="diary-detail-circles">
                        <Circle label="감정"
                                color={selectedColor}
                                textColor={textColor}
                                bordered
                                onClick={()=> setColorSelectorOpen(true)}
                        > {emotion.label}
                        </Circle>
                            {colorSelectorOpen && (
                                <Popup
                                    title="감정 선택"
                                    onClose={() => setColorSelectorOpen(false)}
                                    onSave={() => {
                                        setSelectedColor(selectedColor);
                                        setCustomColor(customColor);
                                        const matched = BASED_COLORS.find(opt => opt.color === selectedColor);
                                        if (matched) {
                                            setEmotion({ label: matched.label, color: selectedColor });
                                        } else {
                                            setEmotion({label : "기타", color: customColor});
                                        }
                                        setColorSelectorOpen(false);
                                    }}
                                >
                                <ColorSelector
                                selectedColor={selectedColor}
                                setSelectedColor={setSelectedColor}
                                customColor={customColor}
                                setCustomColor={setCustomColor}
                                />
                                </Popup>
                            )}

                        <Circle label="증상"
                                bordered
                                onClick={()=> setSymptomSelectorOpen(true)}
                        > {currentSymptom?.icon ?? null }
                        </Circle>
                            {symptomSelectorOpen && (
                                <Popup
                                    title="신체 증상 선택"
                                    onClose={() => setSymptomSelectorOpen(false)}
                                    onSave={() => {
                                        setSymptom(tempSymptom);
                                        setSymptomSelectorOpen(false);
                                    }}
                                >
                                    <SymptomSelector
                                        selectedSymptom={tempSymptom}
                                        setSelectedSymptom={setTempSymptom}/>
                                </Popup>
                            )}
                </div>


                <Input
                    title="일기 제목"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="일기 제목을 입력하세요."
                />
                <TextArea
                    title="일기 내용"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="일기 내용을 입력하세요."
                />
                <div className="edit-btn-container">
                    <div className="edit-btn">
                        <Button color="primary">
                            저장
                        </Button>
                    </div>
                    <div className="edit-btn">
                        <Button className="!bg-red-100 !text-red-500">
                            삭제
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};