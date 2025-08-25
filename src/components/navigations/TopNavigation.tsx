import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';

interface TopNavigationProps {
    workplaceOpen: boolean;
    setWorkplaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
    workplaceOpen,
    setWorkplaceOpen,
    setLoginOpen,
    setRegisterOpen,
    theme,
    setTheme,
}) => {
    const handleWorkplaceButton = () => {
        setWorkplaceOpen((prev) => !prev);
    };

    const handleThemeButton = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <div className="absolute w-screen z-1 shadow-sm flex justify-between items-center p-2.5 pl-40 pr-40" id="background">
            <div className="flex gap-9">
                <h1 className="text-2xl cursor-pointer" id="text">Boardify</h1>
                <button onClick={handleWorkplaceButton} className="flex items-center cursor-pointer" id="text">
                    Workplace
                    <KeyboardArrowDownIcon className={`ml-1 transform transition-transform duration-300 ${workplaceOpen ? "rotate-180" : "rotate-0"}`} id="text"/>
                </button>
            </div>
            <div className="flex gap-7.5">
                <button onClick={handleThemeButton}>
                    {theme === "dark" ? (
                        <LightModeIcon className="cursor-pointer" id="icons"/>
                    ) : ( 
                        <DarkModeIcon className="cursor-pointer" id="icons"/>
                    )}
                </button>
                <button className="cursor-pointer" id="icons" onClick={() => setLoginOpen(true)}>Login</button>
                <button className="cursor-pointer" id="icons" onClick={() => setRegisterOpen(true)}>Register</button>
                <button><LogoutIcon className="cursor-pointer" id="icons"></LogoutIcon></button>
            </div>
        </div>
    );
};

export default TopNavigation;