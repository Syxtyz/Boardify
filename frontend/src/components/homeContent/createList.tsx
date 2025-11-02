import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ListStore } from "@/lib/stores/listStore"
import { BoardStore } from "@/lib/stores/boardStore"
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';

const schema = z.object({
    title: z.string().min(1, "List Title is required"),
})

type FormValues = z.infer<typeof schema>

export default function CreateList() {
    const { selectedBoard } = BoardStore();
    const { createList } = ListStore()

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { title: "" }
    })

    const onSubmit = (data: FormValues) => {
        console.log("List data:", data)
        if (!selectedBoard?.id) return
        createList(selectedBoard?.id, data.title)
        form.reset()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="w-full sm:w-64">
                    <button
                    className="h-8 w-full sm:w-8 bg-zinc-200 dark:bg-zinc-800 group cursor-pointer flex items-center overflow-hidden rounded-lg hover:w-full sm:hover:w-64 transition-[width]"
                    >
                        <div className="w-8 flex justify-center shrink-0">
                            <AddIcon />
                        </div>
                        <span className="text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
                            Add List
                        </span>
                    </button>
                </div>
            </DialogTrigger>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create List</DialogTitle>
                    <DialogDescription>
                        Creating another list. Click add when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">List Name</Label>
                        <div className="relative">
                            <Input id="title" {...form.register("title")} placeholder="e.g. Todo List"/>
                            {form.formState.errors.title && (
                                <p className="text-red-500 text-sm">
                                    {form.formState.errors.title.message}
                                </p>
                            )}
                            <Button type="reset" variant="ghost" className="absolute top-0 right-0 w-9"><ClearIcon/></Button>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="w-16">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="w-16">Add</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}