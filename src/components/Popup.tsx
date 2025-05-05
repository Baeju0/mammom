import {X} from "lucide-react";
import {HTMLAttributes} from "react";
import Button from "./Button.tsx";

interface PopupProps extends HTMLAttributes<HTMLDivElement>{
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
    onSave?: () => void;
}

export default function Popup({
    title,
    onClose,
    className='',
    children,
    onSave,
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
                {children}
                <Button className="popup-button" onClick={onSave}>저장</Button>
            </div>
        </div>
    );
}