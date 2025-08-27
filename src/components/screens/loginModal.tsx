import React from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface loginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const loginModal: React.FC<loginModalProps> = ({isOpen, onClose}) => {
    if (!isOpen) return null;

    return (
        <div id="modalOverlay">
            <div id="modalContent">
                <h1 className="text-2xl text-bold mb-4">Login Form</h1>
                <form className="flex flex-col gap-3">
                    <input type="email" placeholder="Email" className="border p-2 rounded"/>
                    <input  type="password" placeholder="Password" className="border p-2 rounded"/>
                    <button className="border p-2 rounded cursor-pointer" id="modalButton">Login</button>
                </form>
                <ArrowBackIcon onClick={onClose} className="absolute top-0 left-0 m-2 cursor-pointer" />
            </div>
        </div>
    );
};

export default loginModal;