import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ThemeButton from "@/components/themeButton";
import CardCheckboxList from "@/components/homeContent/modal/chkBox";
import { usePublicBoard } from "@/lib/hooks/useBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { List, Card } from "@/lib/objects/data";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

export default function PublicBoardScreen() {
    const [mobileShowingDetails, setMobileShowingDetails] = useState(false)

    const { public_id } = useParams()
    const { data: board, isLoading, isError } = usePublicBoard(public_id!)

    const [modalOpen, setModalOpen] = useState(false)
    const [selectedList, setSelectedList] = useState<List | null>(null)
    const [selectedCard, setSelectedCard] = useState<Card | null>(null)

    const [isMobile, setIsMobile] = useState(window.innerWidth < 640)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    if (isLoading) return <div>Loading board...</div>
    if (isError) return <div>Board not found or private.</div>

    const openListModal = (list: List) => {
        setSelectedList(list)
        setSelectedCard(null)
        setModalOpen(true)

        if (isMobile) {
            setMobileShowingDetails(false)
        }
    }

    const openCardModal = (list: List, card: Card) => {
        setSelectedList(list)
        setSelectedCard(card)
        setModalOpen(true)

        if (isMobile) {
            setMobileShowingDetails(true)
        }
    }

    return (
        <>
            <div className="flex justify-center items-center h-12 font-bold text-lg sm:text-xl md:text-2xl px-4 relative">
                {board.title}
                <div className="absolute right-2">
                    <ThemeButton />
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-3rem)]">
                <div className="flex flex-row items-start gap-6 mx-6 mt-1 pb-4">
                    {board.lists.map((list: List) => (
                        <div key={list.id} className="flex flex-col w-64 bg-gray-100 dark:bg-zinc-900 rounded p-2">
                            <div
                                className="cursor-pointer font-bold mb-2 truncate"
                                onClick={() => openListModal(list)}
                            >
                                {list.title}
                            </div>

                            <ScrollArea className="max-h-[82vh] overflow-y-auto flex flex-col pr-2 mb-1">
                                {list.cards.map((card) => {
                                    const finished = card.card_type === "checkbox"
                                        ? card.checkbox_items?.filter(i => i.checked).length || 0
                                        : 0;
                                    const total = card.card_type === "checkbox"
                                        ? card.checkbox_items?.length || 0
                                        : 0;

                                    return (
                                        <div
                                            key={card.id}
                                            className="flex flex-col bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer border hover:border-zinc-800 dark:hover:border-zinc-300 mb-2 p-2 text-sm sm:text-base"
                                            onClick={() => openCardModal(list, card)}
                                        >
                                            {card.card_type === "checkbox" ? (
                                                <div className="flex items-center gap-1">
                                                    <CheckBoxOutlinedIcon />
                                                    {finished} / {total}
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="font-medium truncate w-52">{card.title}</p>
                                                    <p className="text-sm text-gray-500 w-52 truncate">{card.description}</p>
                                                </>
                                            )}
                                        </div>
                                    )
                                })}
                                <ScrollBar orientation="vertical" />
                            </ScrollArea>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className={`flex flex-col sm:flex-row sm:max-w-none overflow-auto ${isMobile ? "h-screen w-screen" : "h-[90vh] w-11/12"}`}>
                    {isMobile ? (
                        <div className="flex flex-col pt-4 gap-4">
                            {!mobileShowingDetails && (
                                <>
                                    <h3 className="font-bold text-lg px-1">{selectedList?.title}</h3>

                                    <div className="space-y-2">
                                        {selectedList?.cards.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center">No cards in this list.</p>
                                        ) : (
                                            selectedList?.cards.map((card: Card) => {
                                                const finished = card.card_type === "checkbox"
                                                    ? card.checkbox_items?.filter(i => i.checked).length || 0
                                                    : 0;
                                                const total = card.card_type === "checkbox"
                                                    ? card.checkbox_items?.length || 0
                                                    : 0;

                                                return (
                                                    <div
                                                        key={card.id}
                                                        className="flex flex-col p-2 bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer border hover:border-zinc-600"
                                                        onClick={() => {
                                                            openCardModal(selectedList!, card)
                                                            setMobileShowingDetails(true)
                                                        }}
                                                    >
                                                        {card.card_type === "checkbox" ? (
                                                            <div className="flex items-center gap-1">
                                                                <CheckBoxOutlinedIcon fontSize="small" />
                                                                {finished} / {total}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="font-medium truncate">{card.title}</p>
                                                                <p className="text-sm text-gray-500 truncate">{card.description}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </>
                            )}

                            {mobileShowingDetails && selectedCard && (
                                <div className="flex flex-col gap-3">

                                    <h3 className="font-semibold text-lg">{selectedCard.title}</h3>

                                    {selectedCard.card_type === "paragraph" ? (
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {selectedCard.description}
                                        </p>
                                    ) : (
                                        <CardCheckboxList items={selectedCard.checkbox_items || []} readOnly />
                                    )}
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex flex-row w-full h-fit gap-4">
                            <div className="w-1/3 h-full">
                                <div>
                                    <div className="space-y-2 p-2">
                                        {selectedList?.cards.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center">No cards in this list.</p>
                                        ) : (
                                            selectedList?.cards.map((card: Card) => {
                                                const finished = card.card_type === "checkbox"
                                                    ? card.checkbox_items?.filter(i => i.checked).length || 0
                                                    : 0;
                                                const total = card.card_type === "checkbox"
                                                    ? card.checkbox_items?.length || 0
                                                    : 0;

                                                return (
                                                    <div
                                                        key={card.id}
                                                        className="flex flex-col p-2 bg-zinc-200 dark:bg-zinc-800 rounded cursor-pointer border hover:border-zinc-600"
                                                        onClick={() => openCardModal(selectedList, card)}
                                                    >
                                                        {card.card_type === "checkbox" ? (
                                                            <div className="flex items-center gap-1">
                                                                <CheckBoxOutlinedIcon fontSize="small" />
                                                                {finished} / {total}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className="font-medium truncate">{card.title}</p>
                                                                <p className="text-sm text-gray-500 truncate">{card.description}</p>
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="border" />
                            <div className="w-full flex flex-col gap-4 overflow-auto">
                                {selectedCard ? (
                                    <div className="p-2">
                                        <h3 className="font-semibold text-lg">{selectedCard.title}</h3>
                                        {selectedCard.card_type === "paragraph" ? (
                                            <p className="text-sm text-muted-foreground whitespace-break-spaces">{selectedCard.description}</p>
                                        ) : (
                                            <CardCheckboxList items={selectedCard.checkbox_items} readOnly />
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm mt-2">Select a card to view details.</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
