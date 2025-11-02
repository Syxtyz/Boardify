import MenuOpenIcon from "@mui/icons-material/MenuOpen";

interface SidebarHeaderProps {
  onClose: () => void;
}

export default function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <>
      <div className="h-12 flex items-center gap-2 px-4">
        <button
          className="flex items-center rounded-lg cursor-pointer p-2"
          onClick={onClose}
          aria-label="Close side navigation"
        >
          <MenuOpenIcon />
        </button>
        <h2 className="font-bold text-lg">Your Boards</h2>
      </div>
      <div className="border-t border-zinc-900 mx-2 dark:border-neutral-200" />
    </>
  );
}
