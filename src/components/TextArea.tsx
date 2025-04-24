import {ReactNode, TextareaHTMLAttributes} from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    children?: ReactNode
    title?: string
}

export default function TextArea({
    title,
    children,
    className='',
    ...rest
}:TextAreaProps) {
    return (
        <textarea
            title={title}
            {...rest}
            className={`text-area ${className}`}
        >
            {children}
        </textarea>
    )
}