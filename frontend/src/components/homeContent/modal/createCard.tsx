import AddIcon from "@mui/icons-material/Add"
import clsx from "clsx";

interface CreateCardProps {
  onClick: () => void;
  style?: string;
}

export default function CreateCard({ onClick, style }: CreateCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(style,`mb-1 p-2 bg-zinc-200 dark:bg-zinc-800 rounded border hover:border-zinc-800 dark:hover:border-zinc-300 cursor-pointer flex items-center text-sm font-medium text-muted-foreground`)}
    >
      <AddIcon className="h-4 w-4 mr-2" />
      Add Card
    </div>
  );
}