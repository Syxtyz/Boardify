import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from "../hooks/useTheme";

export default function ThemeButton() {
    const { theme, toggleTheme } = useTheme(); 
    return (
        <>
            <button
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-lg cursor-pointer"
            >
                {theme === "light" ? (
                    <DarkModeIcon/>
                ) : (
                    <LightModeIcon/>
                )}
            </button>
        </>
    )
}