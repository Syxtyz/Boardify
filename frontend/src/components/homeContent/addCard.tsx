import AddIcon from "@mui/icons-material/Add";

export default function AddCard() {
    return (
        <div className="h-9 p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center rounded">
            <AddIcon/>
            <p className="font-medium">Add Card</p>
        </div>
    )
}