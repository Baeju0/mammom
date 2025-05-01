import {X} from "lucide-react";
import {HTMLAttributes} from "react";
import Button from "./Button.tsx";

interface PopupProps extends HTMLAttributes<HTMLDivElement>{
    title: string
    subTitle: string
    emotion: { name: string, color: string }
    symptom: string;
    content: string;
    onDetail: () => void;
    onClose: () => void;
}

export default function Popup({
    title,
    subTitle,
    emotion,
    symptom,
    content,
    className='',
    onDetail,
    onClose,
    ...rest
}: PopupProps) {
    return (
        <div {...rest} className={`popup ${className}`}>
            <div className="popup-content">
                <button
                    className="popup-close-button"
                    onClick={onClose}
                    type="button"
                >
                    <X />
                </button>

                <h3 className="text-xl font-bold">{title}</h3>
                <div className="popup-sub-title">{subTitle}</div>

                <div className="flex gap-6 mt-2">
                    <div className="flex flex-col items-center">
                        <div
                            className="popup-circle"
                            style={{ background: emotion.color, borderColor: emotion.color }}
                        >
                            <span className="popup-emotion-text" style={{ color: '#9F1139' }}>{emotion.name}</span>
                        </div>
                        <span className="popup-circle-text">감정</span>
                    </div>

                    <div className="flex flex-col">
                        <div
                            className="popup-circle"
                            style={{ borderColor: emotion.color }}
                        >
                            <span className="text-2xl">{symptom}</span>
                        </div>
                        <span className="popup-circle-text">신체 증상</span>
                    </div>
                </div>

                <div className="popup-diary-content">
                    {content.length > 100 ? content.slice(0, 100) + "..." : content}
                </div>

                <Button
                    onClick={onDetail}
                    type="button"
                >
                    상세보기
                </Button>
            </div>
        </div>
    );
}