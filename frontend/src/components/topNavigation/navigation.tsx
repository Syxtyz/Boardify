import ThemeButton from "../themeButton";
import { useAuth } from "../../hooks/useAuth";
import SideNavigation from "../sideNavigation/navigation";
import LoginButton from "@/components/topNavigation/loginButton";
import RegisterButton from "./registerBtn";

export default function TopNavigation() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="dark:bg-black flex justify-between h-12 px-4 dark:shadow-2xl">
      <div className="flex items-center gap-2">
          {isLoggedIn && <SideNavigation/>}
          <h1 className="font-bold text-lg">Boardify</h1>
      </div>
  
      <div className="flex items-center gap-2"> 
        <ThemeButton />

        {!isLoggedIn ? (
          <>
            <LoginButton/>
            <RegisterButton/>

            

            {/* <button
              className="cursor-pointer border px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setIsRegisterOpen(true)}
            >
              Register
            </button> */}
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

        {/* <ModalForm isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
          <LoginModal />
        </ModalForm> */}
        {/* <ModalForm isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}> */}
          {/* <RegisterModal /> */}
        {/* </ModalForm> */}
      </div>
    </div>
  );
}
