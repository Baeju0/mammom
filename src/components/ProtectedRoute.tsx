import {useStore} from "../store/store.ts";
import {Navigate, Outlet} from "react-router-dom";

export default function ProtectedRoute() {
    const user = useStore((state) => state.user);
    return user ? <Outlet/> : <Navigate to="/login" replace/>
}