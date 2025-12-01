import { Dialog, DialogContent } from "@/components/ui/dialog";
import CardList from "./cardList";
import CardForm from "./cardForm";
import CardDetails from "./cardDetails";
import { Separator } from "@/components/ui/separator";
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
            <DialogContent className="flex flex-col sm:flex-row gap-6 sm:max-w-none w-11/12 sm:w-[90vw] h-[90vh] overflow-auto">
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
                    <>
                        <div className="w-1/3">
                            <CardList
                                selectedList={selectedList}
                                setCreatingCard={setCreatingCardState}
                                setIsEditing={setIsEditing}
                                onSelect={() => setViewSize("large")}
                            />
                        </div>
                        <Separator orientation="vertical" className=""/>
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
                                    <div className="flex flex-col h-full gap-4">
                                        <CardDetails onEdit={() => setIsEditing(true)} />
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center mt-2">
                                        Select a card to view or create a new one.
                                    </p>
                                )}
                            </div>

                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
