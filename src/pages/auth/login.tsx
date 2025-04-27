import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseService } from "../../services/supabase.service";

console.log("[LoginPage] Component rendered");

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("[LoginPage] Loaded");
    const supabase = supabaseService.getClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          console.log(
            "[LoginPage] Existing session detected:",
            data.session.user
          );
        } else {
          console.log("[LoginPage] No existing session");
        }
      });
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[LoginPage] Login attempt started", { email });
    const supabase = supabaseService.getClient();
    if (!supabase) {
      setError("Supabase is not initialized.");
      console.error("[LoginPage] Supabase is not initialized");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      console.error("[LoginPage] Login failed", error.message);
    } else {
      console.log("[LoginPage] Login successful, user:", data?.user);
      navigate("/"); // Redirect to home/dashboard
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      style={{
        maxWidth: 320,
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h1 style={{ color: "red", textAlign: "center" }}>Login Page</h1>
      <h2>Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        autoComplete="username"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        autoComplete="current-password"
      />
      <button type="submit">Login</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default LoginPage;
