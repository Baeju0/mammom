import {Link} from "react-router-dom";
import Logo from "../assets/logo.svg";
import {X, Menu} from "lucide-react";
import {useState} from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return <header className="flex items-center justify-between px-30 py-5">
        <Link
            to="/"
            aria-label="메인 페이지로 이동"
            className="flex items-center space-x-2">
            <img src={Logo} alt="맘몸일기 로고" className="h-10 w-auto"/>
            <span className="font-pretendard font-bold text-[24px] text-[#F44268]">
            맘몸일기
            <p className="base-text !text-xs">따뜻한 하루를 시작해요!</p>
       </span>
        </Link>

        <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
                <p>사용자 이름</p>
                <Link to="/writing-list" className="side-nav-text">일기 작성 내역</Link>
                <button className="side-nav-text !text-[#F44268]">
                    로그아웃
                </button>
            </nav>


            {/*모바일 버전에서는 햄버거 메뉴로 표시되도록*/}
            <div className="flex items-center space-x-4">
            <button
                    aria-label="메뉴 열기"
                    className="md:hidden"
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}
                >
                    <Menu size={28} color="#934311"/>
                </button>

                {isOpen && (
                    <aside className="side-bg">
                        <div className="side-header">
                            <p className="text-lg font-medium">ㅇㅇ님, 환영해요!</p>
                            <button
                                aria-label="메뉴 닫기"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <X size={24}/>
                            </button>
                        </div>

                        <nav className="side-nav">
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/"
                                        className="side-nav-menu"
                                    >
                                        일기 작성 내역
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="p-4 border-t">
                            <button className="side-logout">
                                로그아웃
                            </button>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    </header>
}