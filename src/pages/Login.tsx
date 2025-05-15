import Card from "../components/Card.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {supabase} from "../util/supabaseClient.ts";
import {useStore} from "../store/store.ts";

const DOMAIN = "@mammom.com";

type LoginForm = {
    username: string;
    password: string;
}

export default function Login() {
    const [form, setForm] = useState<LoginForm>({
        username: "",
        password: "",
    });
    const setUser = useStore((state) => state.setUser);
    const setNickname = useStore((state) => state.setNickname);

    const [err, setErr] = useState<string|null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
        setErr(null);
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        setErr(null);

        const authEmail = `${form.username}${DOMAIN}`;
        const {data: signInData, error: signInError} = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: form.password,
        });
        if (signInError || !signInData.user) {
            if(signInError?.status === 400) {
                setErr("아이디 또는 비밀번호가 일치하지 않습니다.");
            } else if (signInError?.status === 429) {
                setErr("서버에 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            } else {
                setErr("알 수 없는 오류가 발생했습니다.");
            }

            setLoading(false);
            return;
        }

        const user = signInData.user;
        setUser(user);

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("nickname")
            .eq("id", user.id)
            .single();
        if (profileError) {
            console.log("닉네임 가져오기 실패!", profileError);
            setNickname("");
        } else {
            setNickname(profile.nickname);
        }

        setLoading(false);
        navigate("/");
    }

   return (
       <Card title="맘몸일기 로그인">
           <form onSubmit={handleLogin} className="sign-card">

           <Input placeholder="아이디"
                  type="text"
                  name="username"
                  required
                  value={form.username}
                  onChange={handleChange}
           />
           <Input placeholder="비밀번호"
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
           />

             {err && <p className="text-red-500 mt-2">{err}</p>}

             <Button type="submit" disabled={loading}>
               {loading ? "로그인 중..." : "로그인"}
             </Button>
           </form>

           <p className="mt-4 text-center">
               아직 계정이 없으신가요?
               <Link to="/sign-up" className="text-pink-500 ml-1">
                   회원가입
               </Link>
           </p>
       </Card>
   )
}