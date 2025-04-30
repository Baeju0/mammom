import {HTMLAttributes, ReactNode} from "react";
import {ArrowLeft} from "lucide-react";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    title?: ReactNode;
    children: ReactNode;
    backable?: boolean;
    onBack?: () => void
}

export function Card ({
    title,
    children,
    className='',
    backable = false,
    onBack,
    ...rest
    }: CardProps) {
    return (
        <div
            {...rest}
            className={`card ${className}`}>
            <div className="flex items-center card-title-text">
                {backable ? (
                    <button
                        onClick={onBack}
                        className="mr-1 p-1 rounded hover:bg-gray-200"
                        aria-label="뒤로가기"
                        type="button"
                    >
                        <ArrowLeft className="mr-1" size={20}/>
                    </button>
                    ) : (
                    <span className="mr-2" style={{width: 32, display: "inline-block"}} />
                 )}
                <h3 className="w-full text-center">{title}</h3>
                <span className="ml-2" style={{width: 32, display: "inline-block"}}/>
            </div>
            {children}
        </div>
    );
}


export default Card;
