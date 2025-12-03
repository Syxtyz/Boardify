import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import RegisterForm from "@/app/(auth)/registerForm";

export default function RegisterButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline">Register</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="self-center">Register</DialogTitle>
                    <DialogDescription>Create your account</DialogDescription>
                </DialogHeader>
                <RegisterForm/>
            </DialogContent>
        </Dialog>
    )
}