import { Field, FieldContent, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { PlusIcon } from "lucide-react";
import { createSchema, type CreateFormValues } from "@/lib/schemas/board";
import { useCreateBoardMutation } from "@/lib/hooks/useBoard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function CreateBoardSection({ onOpen }: { onOpen: () => void }) {
    const createMutation = useCreateBoardMutation();

    const createForm = useForm<CreateFormValues>({
        resolver: zodResolver(createSchema),
        defaultValues: { title: "", lists: ["", "", ""] }
    });

    const defaultStatuses = ["COMPLETED", "IN PROGRESS", "TO DO"];
    const [extraLists, setExtraLists] = useState<string[]>([]);
    const [focusNew, setFocusNew] = useState(false)

    const createSubmit = (data: CreateFormValues) => {
        const allStatuses = [...data.lists, ...extraLists];

        const finalStatuses = allStatuses.map((val, i) => {
            if (val.trim() !== "") return val.trim();
            if (i < defaultStatuses.length) return defaultStatuses[i];
            return "Untitled";
        });

        createMutation.mutate(
            {
                title: data.title,
                lists: finalStatuses
            },
            {
                onSuccess: () => {
                    createForm.reset();
                    setExtraLists([]);
                    onOpen();
                }
            }
        );
    };

    const newInputRef = useRef<HTMLInputElement | null>(null)

    const addNewInput = () => {
        setExtraLists((prev) => [...prev, ""])
        setFocusNew(true)
    }

    useEffect(() => {
        if (extraLists.length > 0) {
            newInputRef.current?.focus()
            setFocusNew(false)
        }
    }, [focusNew])

    const hideAddStatus = extraLists.length > 0 && extraLists[extraLists.length - 1].trim() === ""

    return (
        <form className="flex flex-col mb-3" onSubmit={createForm.handleSubmit(createSubmit)}>
            <ScrollArea className="h-[calc(100vh-10.5rem)]">
                <Field className="mb-3">
                    <FieldContent>
                        <div className="mb-4">
                            <FieldLabel htmlFor="board">Board Title</FieldLabel>
                            <Input id="board" placeholder="Untitled" {...createForm.register("title")} />
                            {createForm.formState.errors.title && (
                                <p className="text-red-500 text-sm absolute">
                                    {createForm.formState.errors.title.message}
                                </p>
                            )}
                        </div>

                        <FieldLabel>Statuses</FieldLabel>

                        {createForm.getValues("lists").map((_, index) => (
                            <Input
                                key={index}
                                {...createForm.register(`lists.${index}`)}
                                placeholder={defaultStatuses[index]}
                                className="mb-2"
                                autoComplete="off"
                            />
                        ))}

                        {extraLists.map((value, i) => (
                            <Input
                                key={`extra-${i}`}
                                ref={i === extraLists.length - 1 ? newInputRef : null}
                                value={value}
                                autoComplete="off"
                                placeholder="Untitled"
                                className="mb-2"
                                onChange={(e) =>
                                    setExtraLists((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                                }
                                onBlur={() =>
                                    setExtraLists((prev) => prev.filter((v) => v.trim() !== ""))
                                }
                            />
                        ))}

                        {!hideAddStatus && (
                            <div className="relative w-full">
                                <PlusIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                <Input
                                    autoComplete="off"
                                    placeholder="Add Status"
                                    className="pl-10 pr-3"
                                    onClick={addNewInput}
                                />
                            </div>
                        )}
                    </FieldContent>
                </Field>
            </ScrollArea>

            <div className="absolute w-full bottom-0 left-0 flex flex-col justify-start px-4 py-2">
                <Separator orientation="horizontal" className="absolute top-0 left-0" />
                <Button variant={"outline"} type="submit" className="w-fit self-end">
                    Create
                </Button>
            </div>
        </form>
    );
}
