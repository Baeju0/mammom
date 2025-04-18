import {HTMLAttributes, ReactNode} from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    title: string;
    children: ReactNode;
}

export function Card ({
    title,
    children,
    className='',
    ...rest
    }: CardProps) {
    return (
        <div
            {...rest}
            className={`card ${className}`}
    >
            <h3 className={`title-text ${className}`}>{title}</h3>
            {children}
        </div>
    );
}


export default Card;
