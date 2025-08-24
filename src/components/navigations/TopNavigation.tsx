import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface TopNavigationProps {
    workplaceOpen: boolean;
    setWorkplaceOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLoginOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
    workplaceOpen,
    setWorkplaceOpen,
    setLoginOpen,
    setRegisterOpen,
}) => {
    const handleButton = () => {
        setWorkplaceOpen((prev) => !prev);
    };
    return (
        <div className="absolute w-screen z-1 bg-black flex justify-between items-center p-2.5 pl-40 pr-40 text-white">
            <div className="flex gap-9">
                <h1 className="text-2xl cursor-pointer">Boardify</h1>
                <button
                onClick={handleButton}
                className="flex items-center cursor-pointer"
                >
                Workplace
                <KeyboardArrowDownIcon
                    className={`ml-1 transform transition-transform duration-300 ${
                    workplaceOpen ? "rotate-180" : "rotate-0"
                    }`}/>
                </button>
            </div>
            <div className="flex gap-7.5">
                <button>
                <DarkModeIcon className="cursor-pointer" />
                </button>
                <button className="cursor-pointer" onClick={() => setLoginOpen(true)}>Login</button>
                <button className="cursor-pointer" onClick={() => setRegisterOpen(true)}>Register</button>
            </div>
        </div>
    );
};

export default TopNavigation;