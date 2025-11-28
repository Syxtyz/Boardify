import { useState } from "react"
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { List } from "@/lib/objects/data"
import { useListDeleteMutation, useListUpdateMutation } from "@/lib/hooks/useList"

const schema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
})

type FormValues = z.infer<typeof schema>

export function ListMenu({ list }: { list: List }) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const updateMutation = useListUpdateMutation()
  const deleteMutation = useListDeleteMutation()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "" }
  })

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({ boardId: list.board_id, listId: list.id, title: data.title })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" aria-label="Open menu" size="sm" className="inline-block -ml-12">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup className="self-center">
            <DropdownMenuItem className="justify-center" onSelect={async () => {
              setShowRenameDialog(true)
            }}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem className="justify-center" onSelect={() => setShowDeleteDialog(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Title</DialogTitle>
            <DialogDescription>
              Provide a new title for your list. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="pb-3">
              <Field>
                <FieldLabel htmlFor="listtitle">List Title</FieldLabel>
                <Input id="listtitle" {...form.register("title")} placeholder={list.title} />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                )}
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="w-16">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="w-16">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this list? This process cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="w-16">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="w-16" onClick={() => {
              if (!list.board_id || !list.id) return;
              // deleteList(list.board_id, list.id);
              deleteMutation.mutate({ boardId: list.board_id, listId: list.id })
            }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
