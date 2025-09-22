import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextProps {
    userEmail: string | null;
    isLoggedIn: boolean;
    login: (email: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const storedUserEmail = localStorage.getItem("userEmail");

        setIsLoggedIn(storedIsLoggedIn);
        setUserEmail(storedUserEmail);
    }, []);

    const login = (email: string) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        setIsLoggedIn(true);
        setUserEmail(email);
    };

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{ userEmail, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}