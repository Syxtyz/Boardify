import { useState } from "react";
import TopNavigation from "./components/navigations/TopNavigation";
import SideNavigation from "./components/navigations/SideNavigation";

function App() {
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [workplaceOpen, setWorkplaceOpen] = useState(false);
    const [theme, setTheme] = useState(false);

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

// import { useState } from "react";
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import DarkModeIcon from '@mui/icons-material/DarkMode';

// function App() {
//    const [loginOpen, setLoginOpen] = useState(false);
//    const [registerOpen, setRegisterOpen] = useState(false);
//    const [workplaceOpen, setWorkplaceOpen] = useState(false);

//    const handleButton = () => {
//       setWorkplaceOpen((prev) => !prev);
//    }

//    return (
//       <>
//          <div className="bg-black flex justify-between items-center p-2.5 pl-40 pr-40">
//             <div className="flex gap-7.5">
//                <h1>Boardify</h1>
//                <button
//                   onClick={handleButton}
//                   className="flex items-center cursor-pointer"
//                   >
//                   Workplace
//                   <KeyboardArrowDownIcon
//                      className={`ml-1 transform transition-transform duration-300 ${
//                         workplaceOpen ? "rotate-180" : "rotate-0"
//                      }`}
//                   />
//                </button>
//             </div>
//             <div className="flex gap-7.5">
//                <button><DarkModeIcon className="cursor-pointer"/></button>
//                <button onClick={() => setLoginOpen(true)}>Login</button>
//                <button onClick={() => setRegisterOpen(true)}>Register</button>
//             </div>
//          </div>

//          <div
//             className={`overflow-hidden transition-all duration-500 ease-in-out ${
//                workplaceOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
//             }`}
//             >
//             <div className="bg-black w-96 h-screen p-4 text-white">
//                <div className="flex gap-10">
//                   <h1>Your boards</h1>
//                   <button className="cursor-pointer">+</button>
//                </div>
//             </div>
//          </div>

//          {loginOpen && (
//          <div className="modalOverlay">
//             <div className="modalContent">
//                <h1>Login Form</h1>
//                <button onClick={() => setLoginOpen(false)}>Close</button>
//             </div>
//          </div>
//          )}

//          {registerOpen && (
//             <div className="modalOverlay">
//                <div className="modalContent">
//                   <h1>Register Form</h1>
//                   <button onClick={() => setRegisterOpen(false)}>Close</button>
//                </div>
//             </div>
//          )}
//       </>
//    )
// }

// export default App


               {/* <button onClick={handleButton} className="flex items-center cursor-pointer">
                  Workplace
                  <KeyboardArrowDownIcon className="mt-0.75"/>
               </button> */}

         {/* {workplaceOpen && (
         <div className="bg-black w-96 h-screen transform transition-transform duration-300">
            <div className="flex gap-10">
               <h1>Your boards</h1>
               <button className="cursor-pointer">+</button>
            </div>
         </div>
         )} */}

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App