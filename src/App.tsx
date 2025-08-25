import { useState } from "react";
import TopNavigation from "./components/navigations/TopNavigation";
import SideNavigation from "./components/navigations/SideNavigation";

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
            
            {loginOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h1>Login Form</h1>
                        <button onClick={() => setLoginOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            {registerOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h1>Register Form</h1>
                        <button onClick={() => setRegisterOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;