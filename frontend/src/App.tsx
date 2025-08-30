import { useState } from "react";
import TopNavigation from "./components/navigations/TopNavigation";
import SideNavigation from "./components/navigations/SideNavigation";
import RegisterModal from "./components/screens/registerModal";
import LoginModal from "./components/screens/loginModal";

function App() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [workplaceOpen, setWorkplaceOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    return (
        <>
            <TopNavigation
                workplaceOpen={workplaceOpen}
                setWorkplaceOpen={setWorkplaceOpen}
                setLoginOpen={setLoginOpen}
                setRegisterOpen={setRegisterOpen}
                theme={theme}
                setTheme={setTheme}
            />
            <SideNavigation workplaceOpen={workplaceOpen} />

            <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)}/>

            <RegisterModal isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
        </>
    );
}

export default App;