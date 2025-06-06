import {useState} from "react";
import {supabase} from "../util/supabaseClient.ts";
import Card from "../components/Card.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import {useNavigate} from "react-router-dom";
import {useStore} from "../store/store.ts";

const DOMAIN = "@mammom.com";

type SignUpForm = {
    username: string;
    nickname: string;
    password: string;
    passwordConfirm: string;
}

export default function SignUp() {
    const [form, setForm] = useState<SignUpForm>({
        username: "",
        nickname: "",
        password: "",
        passwordConfirm: ""
    });
    const [locationAgreed, setLocationAgreed] = useState<boolean>(false);
    const [showPolicy, setShowPolicy] = useState<boolean>(false);
    const setUser = useStore((state) => state.setUser);
    const setNickname = useStore((state) => state.setNickname);
    const [err, setErr] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value,}));
        setErr(null);
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if(loading) return;
        setLoading(true);
        setErr(null);

        // 비밀번호 검증
        if (form.password !== form.passwordConfirm) {
            setErr("비밀번호가 일치하지 않습니다.");
            setLoading(false);
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)) {
            setErr("비밀번호는 6자리 이상의 영문자와 숫자가 포함되어야 합니다.");
            setLoading(false);
            return;
        }

        // 회원가입
        const authEmail = `${form.username}${DOMAIN}`;
        const {data: signUpData, error: signUpErr} = await supabase.auth.signUp({
            email: authEmail,
            password: form.password,
        });
        if (signUpErr || !signUpData.user) {
            console.log("회원가입 에러 디테일", signUpErr);
            if(signUpErr?.status === 400) {
                setErr("유효하지 않은 형식입니다.");
            } else if (signUpErr?.status === 422) {
                setErr("이미 사용 중인 아이디 입니다.");
            } else {
                setErr("회원가입 실패: "+signUpErr?.message);
            }

            setLoading(false);
            return;
        }

        // 회원가입 완료 후 자동 로그인
        const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: form.password,
        });
        if (signInError || !signInData.user) {
            setErr("자동 로그인 실패: "+signInError?.message);
            setLoading(false);
            return;
        }
        const user = signInData.user;
        setUser(user);

        // profiles 테이블에 회원 정보 저장
        const {error: insertErr} = await supabase
            .from("profiles")
            .insert({
                id: signInData!.user!.id,
                nickname: form.nickname,
                location_agreed: locationAgreed
            });
        if (insertErr) {
            setErr("회원가입 실패: "+insertErr.message);
            setLoading(false);
            return;
        }

        setNickname(form.nickname);
        setLoading(false);
        navigate("/", {state: {fromSignup: true}});
    }

    return (
        <Card title="맘몸일기 회원가입">
            <form onSubmit={handleSignup} className="sign-card">

            <Input placeholder="아이디 (영문·숫자 4자 이상)"
                   type="text"
                   name="username"
                   required
                   pattern="[A-Za-z0-9]{4,}"
                   title="영문자와 숫자만 4자 이상 입력 가능합니다."
                   value={form.username}
                   onChange={handleChange}
            />
            <Input placeholder="닉네임 (최대 8자)"
                   type="text"
                   name="nickname"
                   maxLength={8}
                   required
                   value={form.nickname}
                   onChange={handleChange}
            />
            <Input placeholder="비밀번호 (영문·숫자 6자 이상)"
                   type="password"
                   name="password"
                   minLength={6}
                   required
                   value={form.password}
                   onChange={handleChange}
            />
            <Input placeholder="비밀번호 확인"
                   type="password"
                   name="passwordConfirm"
                   required
                   value={form.passwordConfirm}
                   onChange={handleChange}
            />

                <div className="mb-3 mt-2">
                    <label className="location-agree-label">
                        <input type="checkbox"
                               checked={locationAgreed}
                               onChange={()=>setLocationAgreed(!locationAgreed)}
                               className="accent-blue-500"/>
                        위치 정보 수집에 동의하면 현재 위치의 날씨를 제공합니다.
                    </label>
                    <button type="button"
                            className="location-agree-label-button"
                            onClick={()=> setShowPolicy(!showPolicy)}>
                        {showPolicy ? "닫기" : "더보기"}
                    </button>
                    {showPolicy && (
                        <div className="location-agree-text">
                        위치 정보는 날씨 제공 목적에만 사용되며, 동의하지 않을 경우 서울 기준으로 날씨가 제공됩니다.<br/>
                        </div>
                    )}
                </div>

            <Button type="submit">회원가입</Button>
                {loading ? "가입 중 입니다..." : ""}
            </form>
            {err && <p className="text-red-500 mt-2">{err}</p>}
        </Card>
    )
}