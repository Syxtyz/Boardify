import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuth } from "@/lib/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { RegisterSchema, type RegisterValues } from "@/lib/schemas/register";
import { LoginUrl, RegisterUrl } from "@/lib/helper/urls";

export default function RegisterForm() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const form = useForm<RegisterValues>({
        resolver: zodResolver(RegisterSchema),
    });

    const onSubmit = async (values: RegisterValues) => {
        try {
            setLoading(true);
            setError("");

            await axios.post(RegisterUrl, {
                username: values.username,
                email: values.email,
                password: values.password,
            });

            const loginRes = await axios.post(LoginUrl, {
                username: values.username,
                password: values.password,
            });

            login(loginRes.data.access, loginRes.data.refresh);
            console.log("Registration and login successful");
        } catch (err: any) {
            console.error("Registration error:", err.response?.data || err.message);
            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e) }} className="grid gap-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Input id="username" placeholder="Username" type="text" {...form.register("username")}/>
            <Input id="email" placeholder="Email" type="email" {...form.register("email")} />
            <Input id="password" placeholder="Password" type="password" {...form.register("password")}/>
            <Input id="confirmPassword" placeholder="Confirm Password" type="password" {...form.register("confirmPassword")} />
            <DialogFooter>
                <Button type="submit" className="w-24">
                    {loading ? "..." : "Register"}
                </Button>
            </DialogFooter>
        </form>
    );
}
