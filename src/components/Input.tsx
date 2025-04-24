import {InputHTMLAttributes, ReactNode} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: ReactNode
    title?: string
}

export default function Input({
    title,
    children,
    className='',
    ...rest
}: InputProps) {
    return (
        <input
            title={title}
            {...rest}
            className={`input ${className}`}
            >
            {children}
        </input>
    )
}