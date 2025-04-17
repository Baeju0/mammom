import {ReactNode} from "react";

type ButtonProps = {
    children: ReactNode;
    onClick: () => void;
    disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
                                           children, onClick, disabled = false}) => (
    <button
        onClick={onClick}
        className={`
            inline-flex
            item-center
            px-5 py-1
            w-fit
            bg-[#F24171]
            rounded-[25px]
            text-white
            text-x1
            font-bold
            transition-colors duration-300
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d13461]'}`}
        disabled={disabled}
    >
        {children}
    </button>
)


export default Button;
