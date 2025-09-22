// components/ui/Modal.tsx
import type { ReactNode } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function ModalForm({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        {children}
        <ArrowBackIcon
          onClick={onClose}
          className="absolute top-2 left-2 cursor-pointer"
        />
      </div>
    </div>
  );
}
