import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuth } from "@/lib/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoginSchema, type LoginValues } from "@/lib/schemas/login";
import { DialogFooter } from "@/components/ui/dialog";
import { LoginUrl } from "@/lib/helper/urls";

export default function LoginForm() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginValues>({
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit = async (values: LoginValues) => {
        try {
            setLoading(true);
            const response = await axios.post(LoginUrl, {
                username: values.userEmail,
                password: values.password,
            });
            login(response.data.access, response.data.refresh);
            console.log("Login success:", response.data);
        } catch (error: any) {
            console.error("Login error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e) }} className="grid gap-4">
            <Input id="userEmail" {...form.register("userEmail")} placeholder="Email or Username" type="text"/>
            <Input id="password" {...form.register("password")} placeholder="Password" type="password"/>
            <DialogFooter>
                <Button type="submit" className="w-24">
                    {loading ? "..." : "Login"}
                </Button>
            </DialogFooter>
        </form>
    );
}
