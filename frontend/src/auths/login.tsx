import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";

export default function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data, error, loading, request } = useFetch();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await request("http://127.0.0.1:8000/users/login/", {
      method: 'POST',
      body: { email, password },
    });

    console.log("Login API result:", result);

    if (result) {
      login(result.userId, result.userEmail);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold mb-4 self-center">Login Form</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="border p-2 rounded hover:bg-blue-600 hover:text-white cursor-pointer"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {data?.message && <p className="mt-2 text-sm">{data.message}</p>}
    </form>
  );
}
