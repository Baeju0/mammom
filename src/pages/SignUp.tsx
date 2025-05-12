import {useState} from "react";
import {supabase} from "../util/supabaseClient.ts";
import Card from "../components/Card.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import {useNavigate} from "react-router-dom";

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

        if (form.password !== form.passwordConfirm) {
            return setErr("비밀번호가 일치하지 않습니다.");
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(form.password)) {
            return setErr("비밀번호는 6자리 이상의 영문자와 숫자가 포함되어야 합니다.");
        }

        // 회원가입
        const authEmail = `${form.username}${DOMAIN}`;
        const {data, error: supabaseErr} = await supabase.auth.signUp({
            email: authEmail,
            password: form.password,
        });
        if (supabaseErr) {
            // console.log("Sign up error", supabaseErr);
            return setErr(`회원가입 실패: ${supabaseErr.message}`);
        }

        // 회원가입 완료 후 자동 로그인
        const {error: signInError} = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: form.password,
        });
        if (signInError) {
            return setErr("자동 로그인 실패: "+signInError.message);
        }

        // 회원 정보 저장
        const {error: insertErr} = await supabase
            .from("profiles")
            .insert({id: data!.user!.id, nickname: form.nickname});
        if (insertErr) {
            return setErr("회원가입 실패: "+insertErr.message);
        }

        setLoading(false);
        navigate("/", {state: {fromSignup: true}});
    }

    return (
        <Card title="맘몸일기 회원가입">
            <form onSubmit={handleSignup} className="sign-up-card">

            <Input placeholder="아이디"
                   type="text"
                   name="username"
                   required
                   value={form.username}
                   onChange={handleChange}
            />
            <Input placeholder="닉네임"
                   type="text"
                   name="nickname"
                   maxLength={8}
                   required
                   value={form.nickname}
                   onChange={handleChange}
            />
            <Input placeholder="비밀번호"
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

            <Button type="submit">회원가입</Button>
            </form>
            {err && <p className="text-red-500 mt-2">{err}</p>}
        </Card>
    )
}