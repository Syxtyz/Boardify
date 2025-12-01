import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { BoardStore } from "@/lib/stores/boardStore"
import ClearIcon from "@mui/icons-material/Clear"
import AddIcon from "@mui/icons-material/Add"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createList } from "@/lib/api/listAPI"
import type { List } from "@/lib/objects/data"
import { useState } from "react"

const schema = z.object({
  title: z.string().min(1, "List Title is required"),
})

type FormValues = z.infer<typeof schema>

export default function CreateList() {
  const { selectedBoard } = BoardStore()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" },
  })

  const { mutate: handleCreateList, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!selectedBoard?.id) throw new Error("No board selected")
      const order = selectedBoard.lists.map((list: List) => list.order)
      return await createList(selectedBoard.id, data.title, order.length)
    },

    onSuccess: (newList) => {
      BoardStore.setState((state) => {
        if (!state.selectedBoard) return {}

        const updated = { ...state.selectedBoard }
        updated.lists = [...updated.lists, newList]

        return { selectedBoard: updated }
      })
      queryClient.invalidateQueries({
        queryKey: ["board", selectedBoard?.id]
      })
      form.reset()
      setOpen(false)
    }
  })

  const onSubmit = (data: FormValues) => {
    handleCreateList(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full sm:w-64 pointer-events-none">
          <button className="py-2 px-2 w-12 bg-zinc-200 dark:bg-zinc-800 group cursor-pointer flex items-center overflow-hidden rounded hover:w-full sm:hover:w-64 transition-[width] pointer-events-auto">
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
              <Input id="title" {...form.register("title")} placeholder="e.g. Todo List" />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
              )}
              <Button type="reset" variant="ghost" className="absolute top-0 right-0 w-9">
                <ClearIcon />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" className="w-16" disabled={isPending}>
                {isPending ? "Adding..." : "Add"}
              </Button>
            </DialogClose>
              <Button variant="outline" className="w-16">
                Cancel
              </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
