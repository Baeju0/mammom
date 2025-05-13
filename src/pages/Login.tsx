import Card from "../components/Card.tsx";
import Input from "../components/Input.tsx";
import Button from "../components/Button.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {supabase} from "../util/supabaseClient.ts";

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
        const {error: signInError} = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: form.password,
        });
        if (signInError) {
            setErr(`로그인 실패: ${signInError.message}`);
            setLoading(false);
            return;
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