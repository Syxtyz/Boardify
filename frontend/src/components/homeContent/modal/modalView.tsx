import { Dialog, DialogContent } from "@/components/ui/dialog";
import CardList from "./cardList";
import CardForm from "./cardForm";
import CardDetails from "./cardDetails";
import { useState, useEffect } from "react";
import { ListStore } from "@/lib/stores/listStore";
import { CardStore } from "@/lib/stores/cardStore";

interface ModalViewProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    creatingCardState: boolean;
    isEditing: boolean;
    setCreatingCardState: (state: boolean) => void;
    setIsEditing: (state: boolean) => void;
}

export default function ModalView({
    modalOpen,
    setModalOpen,
    creatingCardState,
    isEditing,
    setCreatingCardState,
    setIsEditing,
}: ModalViewProps) {
    const selectedList = ListStore((s) => s.selectedList);
    const selectedCard = CardStore((s) => s.selectedCard);

    const [viewSize, setViewSize] = useState<"small" | "large">("small");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className={`flex flex-col sm:flex-row sm:max-w-none overflow-auto ${isMobile ? "h-screen w-screen" : "h-[90vh] w-11/12"}`}>
                {isMobile ? (
                    viewSize === "small" ? (
                        <CardList
                            selectedList={selectedList}
                            setCreatingCard={setCreatingCardState}
                            setIsEditing={setIsEditing}
                            onSelect={() => setViewSize("large")}
                        />
                    ) : creatingCardState ? (
                        <CardForm
                            selectedList={selectedList}
                            onCancel={() => setCreatingCardState(false)}
                        />
                    ) : selectedCard ? isEditing ? (
                        <CardForm
                            selectedList={selectedList}
                            isEditing
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <>
                            <CardDetails onEdit={() => setIsEditing(true)} />
                        </>

                    ) : (
                        <div>
                            <CardList
                                selectedList={selectedList}
                                setCreatingCard={setCreatingCardState}
                                setIsEditing={setIsEditing}
                                onSelect={() => setViewSize("large")}
                            />
                        </div>
                    )
                ) : (
                    <div className="flex flex-row w-full h-fit gap-4">
                        <div className="w-1/3 h-full">
                            <CardList
                                selectedList={selectedList}
                                setCreatingCard={setCreatingCardState}
                                setIsEditing={setIsEditing}
                                onSelect={() => setViewSize("large")}
                            />
                        </div>
                        <div className="border" />

                        <div className="w-full">
                            <div className="flex flex-col gap-2 overflow-auto">
                                {creatingCardState ? (
                                    <CardForm
                                        selectedList={selectedList}
                                        onCancel={() => setCreatingCardState(false)}
                                    />
                                ) : selectedCard ? isEditing ? (
                                    <CardForm
                                        selectedList={selectedList}
                                        isEditing
                                        onCancel={() => setIsEditing(false)}
                                    />
                                ) : (
                                    <div className="flex flex-col h-full gap-4 mb-4">
                                        <CardDetails onEdit={() => setIsEditing(true)} />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center mt-2">
                                        Select a card to view or create a new one.
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
