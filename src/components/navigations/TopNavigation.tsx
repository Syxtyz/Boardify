import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from '@mui/icons-material/LightMode';

interface TopNavigationProps {
    workplaceOpen: boolean;
    setWorkplaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    theme: boolean;
    setTheme: React.Dispatch<React.SetStateAction<boolean>>;
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
        setTheme((prev) => !prev);
    };

    return (
        <div className="absolute w-screen z-1 bg-white shadow-sm flex justify-between items-center p-2.5 pl-40 pr-40 text-white ">
            <div className="flex gap-9">
                <h1 className="text-2xl cursor-pointer text-gray-900">Boardify</h1>
                <button
                onClick={handleWorkplaceButton}
                className="flex items-center cursor-pointer text-gray-900"
                >
                Workplace
                <KeyboardArrowDownIcon
                    className={`ml-1 transform transition-transform duration-300 text-gray-900 ${
                    workplaceOpen ? "rotate-180" : "rotate-0"
                    }`}/>
                </button>
            </div>
            <div className="flex gap-7.5">
                <button onClick={handleThemeButton}>
                    {theme ? <LightModeIcon className="cursor-pointer text-gray-900" /> : <DarkModeIcon className="cursor-pointer text-gray-900"/>}
                </button>
                <button className="cursor-pointer text-gray-900" onClick={() => setLoginOpen(true)}>Login</button>
                <button className="cursor-pointer text-gray-900" onClick={() => setRegisterOpen(true)}>Register</button>
            </div>
        </div>
    );
};

export default TopNavigation;