import {X} from "lucide-react";
import {HTMLAttributes, ReactNode} from "react";

interface PopupProps extends HTMLAttributes<HTMLDivElement>{
    title?: string
    selected?: Date | null
    onClose: () => void
    children?: ReactNode;
}

export default function Popup({
    title,
    // selected,
    children,
    className='',
    onClose,
    ...rest
}: PopupProps) {
    return (
        <div {...rest} className={`popup ${className}`}>
            <div className="popup-content">
                <button className="popup-close-button" onClick={onClose}><X/></button>

                {title && <h3>{title}</h3>}
                {children}
            </div>
        </div>
    )
}