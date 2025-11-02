import { Toaster } from "sonner";

export default function Toast() {
    return (
        <Toaster
            position="bottom-left"
            toastOptions={{
                style: {
                    background: "var(--popover)",
                    color: "var(--popover-foreground)",
                    border: "var(--border)",
                    borderRadius: "0.5rem",
                }
            }}
        >
        </Toaster>
    )
}