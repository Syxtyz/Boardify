import { createContext, useState, useEffect, useRef, type ReactNode } from "react";
import axios from "axios";
import { BaseUrl } from "@/lib/helper/urls";
import { getCurrentUser } from "../api/user";
import { UserStore } from "../stores/userStore";
import { BoardStore } from "../stores/boardStore";

export const api = axios.create({
  baseURL: BaseUrl,
});

interface AuthContextProps {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (access: string, refresh: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const accessTokenRef = useRef<string | null>(accessToken);
  const refreshTokenRef = useRef<string | null>(refreshToken);

  useEffect(() => { accessTokenRef.current = accessToken; }, [accessToken]);
  useEffect(() => { refreshTokenRef.current = refreshToken; }, [refreshToken]);

  useEffect(() => {
    const savedAccess = localStorage.getItem("accessToken");
    const savedRefresh = localStorage.getItem("refreshToken");

    if (savedAccess) setAccessToken(savedAccess);
    if (savedRefresh) setRefreshToken(savedRefresh);
  }, []);

  const login = async (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    accessTokenRef.current = access;  // <-- update ref immediately
    refreshTokenRef.current = refresh;
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    try {
      const user = await getCurrentUser()
      UserStore.getState().setUser(user)
    } catch (e) {
      console.error("Failed to fetch user after login:", e);
      UserStore.getState().setUser(null);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    BoardStore.getState().clearSelectedBoard()
    UserStore.getState().clearUser()
  };

  api.interceptors.request.use((config) => {
    if (accessTokenRef.current && config.headers) {
      config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const currentRefresh = refreshTokenRef.current;
        if (!currentRefresh) {
          logout();
          return Promise.reject(error);
        }

        try {
          const res = await axios.post("http://127.0.0.1:8000/api/refresh/", {
            refresh: currentRefresh,
          });

          const newAccess = res.data.access;
          setAccessToken(newAccess);
          localStorage.setItem("accessToken", newAccess);
          accessTokenRef.current = newAccess;

          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return axios(originalRequest);

        } catch {
          logout();
        }
      }

      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!accessToken,
        accessToken,
        refreshToken,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
