import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const { register, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    try {
      await register({ username, email, password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Handled by store error state
    }
  };

  return (
    <div className="max-w-[440px] w-full mx-auto my-12 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-md">
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <span className="text-3xl font-extrabold text-primary select-none tracking-tight">StayScape</span>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">Create Account</h2>
        <p className="text-xs text-gray-500 font-semibold">Join us to explore and book amazing places</p>
      </div>

      {success && (
        <Alert type="success" className="mb-4">
          Registration successful! Redirecting to login...
        </Alert>
      )}

      {error && (
        <Alert type="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Username"
          id="username"
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          label="Email Address"
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Choose a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Register
        </Button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  );
}
