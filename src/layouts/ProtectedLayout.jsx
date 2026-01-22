import { Outlet, Navigate } from "react-router-dom";
export default function ProtectedLayout({ isAuthorized, redirectTo = "/", children }) {

    return isAuthorized ?
        children
            ? children :
            < Outlet /> : <Navigate to={redirectTo} replace={true} />

}