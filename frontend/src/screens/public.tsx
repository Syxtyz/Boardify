import { useState } from "react";
import { useParams } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ThemeButton from "@/components/themeButton";
import type { List, Card } from "@/lib/objects/data";
import CardCheckboxList from "@/components/homeContent/modal/chkBox";
import { usePublicBoard } from "@/lib/hooks/useBoard";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

export default function PublicBoardScreen() {
    const { public_id } = useParams();
    const { data: board, isLoading, isError } = usePublicBoard(public_id!)

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [selectedList, setSelectedList] = useState<List | null>(null);

    if (isLoading) return <div>Loading board...</div>
    if (isError) return <div>Board not found or private.</div>

    return (
        <>
            <div className="flex justify-center items-center h-12 font-bold text-lg sm:text-xl md:text-2xl px-4 relative">
                {board.title}
                <div className="absolute right-2">
                    <ThemeButton />
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-3rem)]">
                <div className="flex flex-col md:flex-row items-start mx-2 gap-3 md:gap-4 justify-center md:justify-start mt-0.5">
                    {board.lists.map((list: any) => (
                        <Dialog
                            key={list.id}
                            open={modalOpen && selectedList?.id === list.id}
                            onOpenChange={async (isOpen) => {
                                setModalOpen(isOpen)
                                if (!isOpen) {
                                    await new Promise((resolve) => setTimeout(resolve, 200))
                                    setSelectedCard(null)
                                    setSelectedList(null)
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <div
                                    className="w-64 flex flex-col bg-gray-100 dark:bg-zinc-900 font-bold py-2 pl-2 rounded transition-transform hover:scale-[1.01]"
                                    onClick={() => setSelectedList(list)}
                                >
                                    <div className="relative">
                                        <div className="text-base sm:text-lg mb-1 truncate ml-1">{list.title}</div>
                                    </div>

                                    <ScrollArea className="max-h-[calc(100vh-6.85rem)] overflow-y-auto flex flex-col pr-2">
                                        <div className="flex flex-col">
                                            {list.cards.map((card: any) => {
                                                const finished = card.card_type === "checkbox"
                                                    ? card.checkbox_items?.filter((item: any) => item.checked).length || 0
                                                    : 0;
                                                const total = card.card_type === "checkbox"
                                                    ? card.checkbox_items?.length || 0
                                                    : 0;
                                                return (

                                                    <div
                                                        key={card.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedList(list);
                                                            setSelectedCard(card);
                                                            setModalOpen(true);
                                                        }}
                                                        className="flex flex-col bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer border hover:border-zinc-800 dark:hover:border-zinc-300 my-1 mx-1 p-2 text-sm sm:text-base"
                                                    >
                                                        {card.card_type === "checkbox" ? (
                                                            <div>
                                                                <CheckBoxOutlinedIcon fontSize="small" />
                                                                {finished} / {total}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="font-medium truncate">{card.title}</p>
                                                                <p className="text-sm text-gray-500 w-full truncate">{card.description}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            }
                                            )}
                                        </div>
                                        <ScrollBar orientation="vertical" />
                                    </ScrollArea>
                                </div>
                            </DialogTrigger>


                            {/* <DialogContent className="flex flex-row w-[90vw] sm:max-w-none md:max-w-none lg:max-w-none max-w-none"> */}
                            <DialogContent className="flex flex-col gap-2">

                                {/* <ScrollArea className="w-[50%] sm:w-[35%] h-[75vh] pr-3"> */}
                                <ScrollArea className="w-full">
                                    <DialogHeader>
                                        <DialogTitle>{selectedList?.title}</DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription className="space-y-2 mt-4">
                                        {selectedList?.cards.length === 0 ? (
                                            <div className="text-center text-gray-500 py-4">No cards available</div>
                                        ) : (
                                            selectedList?.cards.map((card) => (
                                                <div
                                                    key={card.id}
                                                    onClick={() => setSelectedCard(card)}
                                                    className={`flex flex-col rounded cursor-pointer border w-full p-2 text-sm sm:text-base ${selectedCard?.id === card.id
                                                        ? "bg-zinc-300 dark:bg-zinc-800 border-zinc-600"
                                                        : "bg-zinc-200 dark:bg-zinc-900 hover:border-zinc-700"
                                                        }`}
                                                >
                                                    <p className="font-medium break-all">{card.title}</p>
                                                    <p className="text-sm text-gray-500 w-full truncate">{card.description}</p>
                                                </div>
                                            ))
                                        )}
                                    </DialogDescription>
                                    <ScrollBar orientation="vertical" />
                                </ScrollArea>

                                {/* <div className="border-r border-zinc-300 dark:border-zinc-700" /> */}
                                <div className="border-b-2 pb-1 border-zinc-300 dark:border-zinc-700"></div>

                                {/* <div className="w-[50%] pl-3"> */}
                                <div className="w-full">
                                    {selectedCard ? (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle className="text-start mt-1">{selectedCard.title}</DialogTitle>
                                                <DialogDescription className="text-gray-500 dark:text-gray-400 mt-2 text-start">
                                                    {selectedCard.card_type === "paragraph" ? (
                                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                            {selectedCard.description}
                                                        </p>
                                                    ) : (
                                                        <CardCheckboxList items={selectedCard.checkbox_items} />
                                                    )}
                                                </DialogDescription>
                                            </DialogHeader>
                                        </>
                                    ) : (
                                        <p className="text-gray-500 mt-4 text-sm text-center">Select a card to view its details.</p>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </>
    );
}