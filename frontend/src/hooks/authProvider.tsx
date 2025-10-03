import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextProps {
    userId: number | null;
    userEmail: string | null;
    isLoggedIn: boolean;
    login: (id: number, email: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<number | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const storedUserId = localStorage.getItem("userId");
        const storedUserEmail = localStorage.getItem("userEmail");

        setIsLoggedIn(storedIsLoggedIn);
        if (storedUserId) setUserId(Number(storedUserId));
        if (storedUserEmail) setUserEmail(storedUserEmail);
    }, []);

    const login = (id: number, email: string) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", id.toString());
        localStorage.setItem("userEmail", email);
        setIsLoggedIn(true);
        setUserId(id);
        setUserEmail(email);
    };

    const logout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserId(null);
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{ userId, userEmail, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}