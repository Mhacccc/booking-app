import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading, clearError, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    try {
      await login({ username, password });
      navigate("/");
    } catch (err) {
      // Handled by store error state
    }
  };

  return (
    <div className="max-w-[440px] w-full mx-auto my-12 bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-md">
      <div className="flex flex-col items-center text-center gap-2 mb-6">
        <span className="text-3xl font-extrabold text-primary select-none tracking-tight">StayScape</span>
        <h2 className="text-xl font-bold text-gray-900 leading-tight">Welcome Back</h2>
        <p className="text-xs text-gray-500 font-semibold">Sign in to manage your bookings and explore stays</p>
      </div>

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
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6 font-semibold">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
