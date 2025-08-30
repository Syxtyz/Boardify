import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface registerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const registerModal: React.FC<registerModalProps> = ({isOpen, onClose}) => {
    if (!isOpen) return null;

    return (
        <div id="modalOverlay">
            <div id="modalContent">
                <h1 className="text-2xl font-bold mb-4">Register Form</h1>
                <form className="flex flex-col gap-3">
                    <input type="text" placeholder="Username" className="border p-2 rounded" />
                    <input type="email" placeholder="Email" className="border p-2 rounded" />
                    <input type="password" placeholder="Password" className="border p-2 rounded" />
                    <button className="border p-2 rounded hover:bg-blue-600 cursor-pointer" id="modalButton">
                        Register
                    </button>
                </form>
                <ArrowBackIcon onClick={onClose} className="absolute top-0 left-0 m-2 cursor-pointer" />
            </div>
        </div>
    );
};

export default registerModal;