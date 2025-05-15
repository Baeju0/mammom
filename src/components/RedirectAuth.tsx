import {useStore} from "../store/store.ts";
import {useNavigate} from "react-router-dom";
import {ReactNode, useEffect} from "react";

interface RedirectAuthProps {
    children: ReactNode
}

export default function RedirectAuth({children}: RedirectAuthProps) {
    const user = useStore((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/", {replace: true});
        }
    }, [user, navigate]);

    return <>{!user && children}</>
}