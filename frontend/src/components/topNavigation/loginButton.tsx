import LoginForm from "@/app/(auth)/loginForm";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { ReactNode } from "react";

interface LoginButtonProps {
    children: ReactNode
    variant: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

export default function LoginButton({children, variant , size}: LoginButtonProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant={variant} size={size}>{children}</Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="self-center">Login</DialogTitle>
                    <DialogDescription>Enter your login credentials</DialogDescription>
                </DialogHeader>
                <LoginForm/>
            </DialogContent>
        </Dialog>
    )
}