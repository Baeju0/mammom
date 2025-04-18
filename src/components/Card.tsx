import {HTMLAttributes, ReactNode} from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

const Card: React.FC<CardProps> = ({
                                       children,
                                       className='',
                                       ...rest
    }) => (
        <div
            {...rest}
            className={`card ${className}`}
    >
        {children}
    </div>
)


export default Card;
