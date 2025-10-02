// import { useState } from "react";
// import MenuIcon from "@mui/icons-material/Menu";
// import MenuOpenIcon from "@mui/icons-material/MenuOpen";
// import AddIcon from '@mui/icons-material/Add';

// export default function SideNavigation() {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <>
//         <button
//             className="flex items-center rounded-lg cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-zinc-800"
//             onClick={() => setIsOpen(true)}
//         >
//             <MenuIcon />
//         </button>

//         {isOpen && (
//             <div
//                 className="fixed inset-0 bg-[rgba(0,0,0,0.3)] z-50"
//                 onClick={() => setIsOpen(false)}
//             >
//                 <div
//                     className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out ${
//               isOpen ? "translate-x-0" : "-translate-x-full"
//             }`}
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <div className="h-12 flex items-center gap-2 px-4">
//                         <button
//                             className="flex items-center rounded-lg cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-zinc-800"
//                             onClick={() => setIsOpen(false)}
//                         >
//                             <MenuOpenIcon />
//                         </button>
//                         <h2 className="font-bold text-lg">Your Boards</h2>
//                     </div>
//                     <div className="border-t border-zinc-900 mx-2 dark:border-neutral-200"/>
//                     <div className="h-9 flex items-center justify-between mx-4 my-1.5 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800">
//                         <h1 className="mx-2">Create Board</h1>
//                         <AddIcon className="mx-1"/>
//                     </div>


//                     {/* <nav className="flex flex-col gap-3">

//                     </nav> */}
//                 </div>
//             </div>
//         )}
//         </>
//     );
// }


import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AddIcon from "@mui/icons-material/Add";

export default function SideNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
        <button
            className="flex items-center rounded-lg cursor-pointer p-2 hover:bg-gray-200 dark:hover:bg-zinc-800"
            onClick={() => setIsOpen(true)}
            aria-label="Open side navigation"
        >
            <MenuIcon />
        </button>

        <div
            className={`fixed inset-0 z-50 transition-opacity duration-100 ease-in-out bg-[rgba(0,0,0,0.3)] ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsOpen(false)}
            aria-hidden={!isOpen}
        >
            <div
                className={`absolute left-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-lg flex flex-col transform transition-transform duration-100 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="h-12 flex items-center gap-2 px-4">
                    <button
                        className="flex items-center rounded-lg cursor-pointer p-2"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close side navigation"
                    >
                        <MenuOpenIcon/>
                    </button>
                    <h2 className="font-bold text-lg">Your Boards</h2>
                </div>

                <div className="border-t border-zinc-900 mx-2 dark:border-neutral-200" />

                <div
                    className="h-9 flex items-center justify-between mx-4 my-1.5 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800"
                    role="button"
                    tabIndex={0}
                >
                    <h1 className="mx-2">Create Board</h1>
                    <AddIcon className="mx-1" />
                </div>
            </div>
        </div>
    </>
  );
}
