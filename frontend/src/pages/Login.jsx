import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined);

  if (user) {
    navigate("/");
    return;
  }

  const handleSubmit = async (e) => {
    setError(undefined);
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center mt-6">
        <img
            src="/logo.svg"
            alt="HelpConnect logo"
            className="w-20 h-20 object-cover"
          />
          <h1 className="text-xl font-medium bg-linear-to-r from-green-600 to-gray-700 bg-clip-text text-transparent">HelpConnect</h1>
          <p className="text-sm text-muted-foreground">Connect with your community</p>
      </div>

      <div className="w-full my-6 p-6 border border-gray-200 rounded-2xl shadow-sm">
        <h1>Welcome Back</h1>

        {error && <div className="bg-red-200 p-4 border border-red-600 rounded-2xl mt-4"><p className="text-red-600">{error}</p></div>}

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>

          <label className="font-medium">Email</label>
          <input
            type="text"
            placeholder="your.email@example.com"
            className="border border-gray-200 rounded-2xl shadow-sm p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-200 rounded-2xl shadow-sm p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="button-primary mt-2">
            Log In
          </button>

          <h3 className="text-center">Don't have an account? <Link to="/register" className="text-green-700 font-semibold underline">Sign Up</Link></h3>
        </form>
      </div>
    </div>
  );
};

export default Login;