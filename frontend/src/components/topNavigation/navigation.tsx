import ThemeButton from "../themeButton";
import { useAuth } from "../../lib/hooks/useAuth";
import SideNavigation from "../sideNavigation/navigation";
import LoginButton from "./loginButton";
import RegisterButton from "./registerBtn";

export default function TopNavigation() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="dark:bg-black flex justify-between h-12 px-4 py-8 dark:shadow-secondary shadow-sm">
      <div className="flex items-center space-x-2.5">
        {isLoggedIn && <SideNavigation />}
        <h1 className="font-bold text-lg">Boardify</h1>
      </div>

      <div className="flex items-center space-x-2.5">
        <ThemeButton />

        {!isLoggedIn ? (
          <>
            <LoginButton variant="outline" size="default">
              Login
            </LoginButton>
            <RegisterButton />

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
      </div>
    </div>
  );
}
