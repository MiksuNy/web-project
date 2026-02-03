import { useState } from "react";
import { login } from "../api/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);

      alert("Login successful ✅");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Login failed ❌ " + err.message);
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-6 border border-gray-200 rounded-2xl shadow-sm">
      <h2>Login</h2>
      <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-200 rounded-2xl shadow-sm p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-200 rounded-2xl shadow-sm p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="button-primary mt-2">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
