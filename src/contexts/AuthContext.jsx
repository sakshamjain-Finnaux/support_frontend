import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useUI from "./UIContext";
import authReqs from "../network/authReqs";
import PERMISSIONS from "../permissions";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext();
export function AuthProvider({ children }) {
    const queryClient = useQueryClient();
    const { toast, setShowFullSpinner } = useUI();
    const [user, setUser] = useLocalStorage("user", null);

    const signin = async (data) => {
        const result = await authReqs.signin(data);
        if (!result.success) {
            toast.error(result.message);
            return;
        }
        result.data.permissions = Object.keys(result.data.permissions).filter((permission) => result.data.permissions[permission]);
        setUser(result.data);
        toast.success("Signed in successfully!");
    }

    //when JWT expires, the server will clear the cookies, so we just need to remove user from local storage.
    const invalidateUser = () => {
        queryClient.clear();
        setUser(null);
    }

    const signout = async () => {
        setShowFullSpinner(true);
        const result = await authReqs.signout();
        if (!result.success) {
            toast.error(result.message);
        }
        else {
            invalidateUser();
            toast.info("Signed out successfully!");
        }
        setShowFullSpinner(false);
    }

    function hasPermission(permission) {
        return user?.permissions?.includes(permission);
    }

    const value = useMemo(() => ({ user, signin, signout, invalidateUser, hasPermission }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}


export default function useAuth() {
    return useContext(AuthContext);
};