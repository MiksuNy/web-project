const Login = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 p-6 border border-gray-200 rounded-2xl shadow-sm">
      <h2>Login</h2>
      <form className="flex flex-col gap-4 mt-4">
        <input type="text" placeholder="Username" className="border border-gray-200 rounded-2xl shadow-sm p-3" />
        <input type="password" placeholder="Password" className="border border-gray-200 rounded-2xl shadow-sm p-3" />
        <button type="submit" className="button-primary mt-2">Log In</button>
      </form>
    </div>
  );
};

export default Login;
