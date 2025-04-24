import {Link} from "react-router-dom";
import Logo from "../assets/logo.svg";
import {Menu} from "lucide-react";

export default function Header() {
    return (
     <header className="flex items-center justify-between px-30 py-5">
        <Link
            to="/"
            aria-label="메인 페이지로 이동"
            className="flex items-center space-x-2">
        <img src={Logo} alt="맘몸일기 로고" className="h-10 w-auto"/>
        <span className="font-pretendard font-bold text-[24px] text-[#F44268]">
             맘몸일기
        </span>
        </Link>

        <div className="flex items-center space-x-4">
            <button
                aria-label="메뉴 열기"
                onClick={() => {
                    // onClick 로직 작성
                }}
            >
            <Menu size={28} color="#934311"/>
            </button>
        </div>
    </header>
    )}