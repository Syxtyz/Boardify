import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import MenuIcon from "@mui/icons-material/Menu"
import BoardList from "./boardList"
import CreateBoardSection from "./createBoardSection"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { PlusIcon } from "lucide-react"
import { Separator } from "../ui/separator"

export default function SideNavigation() {
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<"main" | "create">("main")

    return (
        <>
            <Button onClick={() => { setView("main"), setOpen(true) }} variant={"outline"} size={"icon"}>
                <MenuIcon />
            </Button>

            <Sheet
                open={open}
                onOpenChange={(state) => {
                    setOpen(state)
                    if (!state) setView("main")
                }}
            >
                <SheetContent side="left" className="bg-white dark:bg-zinc-900 shadow-xl overflow-hidden gap-0">
                    <SheetHeader className="-mt-2">
                        <div className="flex flex-row gap-2 items-center -mb-2.5">
                            <Button onClick={() => setOpen(false)} variant={"outline"} size={"icon"}>
                                <MenuOpenIcon />
                            </Button>
                            <SheetTitle>Your Boards</SheetTitle>
                        <SheetDescription/>
                        </div>
                    </SheetHeader>

                    <div className="px-4">
                        <Separator orientation="horizontal" />
                    </div>

                    <div className="relative w-full h-full">
                        <AnimatePresence mode="wait">
                            {view === "main" && (
                                <motion.div
                                    key="main"
                                    initial={{ x: 0, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="absolute inset-0 p-4 flex flex-col"
                                >
                                    <Button onClick={() => setView("create")}>
                                        <PlusIcon /> Create Board
                                    </Button>

                                    <BoardList />
                                </motion.div>
                            )}

                            {view === "create" && (
                                <motion.div
                                    key="create"
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -50, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="absolute inset-0 p-4"
                                >
                                    <div>
                                        <CreateBoardSection onOpen={() => setView("main")} />
                                        <Button variant={"outline"} onClick={() => setView("main")} className="absolute bottom-2 right-26.5">
                                            Cancel
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}
