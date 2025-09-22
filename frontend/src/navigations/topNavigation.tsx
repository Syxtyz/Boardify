import { useState } from "react";
import ThemeButton from "../components/themeButton";
import LoginModal from "../auths/login";
import RegisterModal from "../auths/register";
import ModalForm from "../components/modalForm";


export default function TopNavigation() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
        <ThemeButton />
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

        <ModalForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}><LoginModal/></ModalForm>
        <ModalForm isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}><RegisterModal/></ModalForm>
    </>
  );
}
