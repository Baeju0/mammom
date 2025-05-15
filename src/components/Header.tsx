import {Link, useNavigate} from "react-router-dom";
import Logo from "../assets/logo.svg";
import {X, Menu} from "lucide-react";
import {useState} from "react";
import {useStore} from "../store/store.ts";
import {supabase} from "../util/supabaseClient.ts";

export default function Header() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);
    const nickname = useStore((state) => state.nickname);
    const setNickname = useStore((state) => state.setNickname);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setNickname("");
        navigate("/");
    }

    const handleGuestLogin = async () => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: "guest@mammom.com",
            password: "password123",
        });
        if (error || !data.user) {
            console.log("게스트 로그인 실패", error);
            return;
        }
        setUser(data.user);

        const {data: profile, error: profileError} = await supabase
            .from("profiles")
            .select("nickname")
            .eq("id", data.user.id)
            .single();
        if (profileError || !profile) {
            console.log("게스트 로그인 실패", profileError);
            return;
        }
        setNickname(profile.nickname);
    }

    return <header className="header">
        <Link
            to="/"
            aria-label="메인 페이지로 이동"
            className="header-link">
            <img src={Logo} alt="맘몸일기 로고" className="header-logo"/>
            <span className="header-logo-text">
            맘몸일기
            <p className="base-text !text-xs sm:!text-sm">따뜻한 하루를 시작해요!</p>
       </span>
        </Link>


        <div className="header-nav-box">
            {user === null && nickname === "" ?
            <nav className="header-nav">
                <Link to="/login" className="side-nav-text header-login-text">로그인</Link>
                <Link to="/sign-up" className="side-nav-text header-sign-up-text">
                    회원가입
                </Link>
                <button onClick={handleGuestLogin} className="side-nav-text header-guest-text">게스트로 둘러보기</button>
            </nav>
                :
            <nav className="header-nav">
                <p>{nickname}님, 환영해요!</p>
                <Link to="/writing-list" className="side-nav-text header-writing-list-text">일기 작성 내역</Link>
                <button onClick={handleLogout} className="side-nav-text header-logout-text">
                    로그아웃
                </button>
            </nav>
            }

            {/*모바일 버전에서는 햄버거 메뉴로 표시되도록*/}
            <div className="header-hamburger">
            <button
                    aria-label="메뉴 열기"
                    className="p-1"
                    onClick={() => {setIsOpen(!isOpen)}}
                >
                    <Menu size={28} color="#934311"/>
                </button>

                {isOpen && (
                    <aside className="side-bg">
                        <div className="side-header">
                            {user ?
                            <p className="header-mobile-text">{nickname}님, 환영해요!</p>
                            : <p className="header-mobile-text">환영합니다!</p>
                            }
                            <button
                                aria-label="메뉴 닫기"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <X size={24}/>
                            </button>
                        </div>

                        <nav className="side-nav">
                            <ul className="space-y-3">
                              {user ?
                                  <>
                                      <li>
                                          <Link to="/writing-list" className="side-nav-menu header-writing-list-text">
                                              일기 작성 내역
                                          </Link>
                                      </li>
                                  </>
                                  : (
                                      <>
                                       <li>
                                         <button onClick={handleGuestLogin}
                                                 className="side-nav-menu header-guest-text">게스트로 둘러보기</button>
                                       </li>
                                    <li>
                                    <Link to="/login" className="side-nav-menu">로그인</Link>
                                 </li>
                                 <li>
                                   <Link to="sign-up" className="side-nav-menu">회원가입</Link>
                                 </li>
                                </>
                              )}
                            </ul>
                        </nav>

                        {user && (
                        <div className="p-4 border-t">
                            <button onClick={handleLogout} className="side-logout">
                                로그아웃
                            </button>
                        </div>)}
                    </aside>
                )}
            </div>
        </div>
    </header>
}