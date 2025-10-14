import { type ReactNode } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50 transition-opacity ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className="relative p-6 rounded-lg shadow-lg w-96 bg-white dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <ArrowBackIcon
          onClick={onClose}
          className="absolute top-2 left-2 cursor-pointer"
        />
      </div>
    </div>
  );
}
