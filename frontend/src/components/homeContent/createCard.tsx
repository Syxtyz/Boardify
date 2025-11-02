import AddIcon from "@mui/icons-material/Add"

interface CreateCardProps {
  onClick: () => void;
}

export default function CreateCard({ onClick }: CreateCardProps) {
  return (
    <div
      onClick={onClick}
      className="my-1 mx-1 p-2 bg-zinc-200 dark:bg-zinc-800 rounded border hover:border-zinc-800 dark:hover:border-zinc-300 cursor-pointer flex items-center text-sm font-medium text-muted-foreground"
    >
      <AddIcon className="h-4 w-4 mr-2" />
      Add Card
    </div>
  );
}
