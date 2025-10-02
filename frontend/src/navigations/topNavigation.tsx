import { useState } from "react";
import ThemeButton from "../components/themeButton";
import LoginModal from "../auths/login";
import RegisterModal from "../auths/register";
import ModalForm from "../components/modalForm";
import { useAuth } from "../hooks/useAuth";
import SideNavigation from "./sideNavigation";

export default function TopNavigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="bg-white dark:bg-black flex justify-between h-12 px-4 shadow-sm dark:shadow-gray-900">
        <div className="flex items-center gap-2">
            {isLoggedIn && <SideNavigation />}
            <h1 className="font-bold text-lg">Boardify</h1>
        </div>
  
  <div className="flex items-center gap-2">
    <ThemeButton />

    {!isLoggedIn ? (
      <>
        <button
          className="cursor-pointer border px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setIsLoginOpen(true)}
        >
          Login
        </button>

        <button
          className="cursor-pointer border px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setIsRegisterOpen(true)}
        >
          Register
        </button>
      </>
    ) : (
      <>
        <button
          className="cursor-pointer border px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={logout}
        >
          Logout
        </button>
      </>
    )}

    {/* Modals */}
    <ModalForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
      <LoginModal />
    </ModalForm>
    <ModalForm isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
      <RegisterModal />
    </ModalForm>
  </div>
</div>
  );
}
