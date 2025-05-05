import React from "react";

interface CircleProps {
    label: string;
    color?: string;
    textColor?: string;
    bordered?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

export default function Circle({
                                            label,
                                            color,
                                            textColor,
                                            bordered = false,
                                            onClick,
                                            children,
                                        }: CircleProps) {
    const backgroundStyle = bordered
        ? { background: color, borderColor: color } : {};
    const borderStyle = bordered ? { borderColor: color } : {};

    return (
        <div className="circle-layout" onClick={onClick}>
            <div
                className={`popup-circle${bordered ? " border" : ""}`}
                style={{ ...backgroundStyle, ...borderStyle }}
            >
                <span className="font-bold" style={{ color: textColor }}>{children}</span>
            </div>
            <span className="popup-circle-text">{label}</span>
        </div>
    );
}