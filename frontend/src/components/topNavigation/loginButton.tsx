import LoginForm from "@/app/(auth)/loginForm";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export default function LoginButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Login</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="self-center">Login</DialogTitle>
                    <DialogDescription>Enter your login credentials</DialogDescription>
                </DialogHeader>
                <LoginForm/>
            </DialogContent>
        </Dialog>
    )
}