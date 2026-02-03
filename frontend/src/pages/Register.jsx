import { useState } from "react";
import { register } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const dateOfBirthMonthHiddenField = {};
  const dateOfBirthYearHiddenField = {};

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [dobDay, setDobDay] = useState(undefined);
  const [dobMonth, setDobMonth] = useState(undefined);
  const [dobYear, setDobYear] = useState(undefined);

  const [error, setError] = useState(undefined);

  const handleSubmit = async (e) => {
    setError(undefined);
    e.preventDefault();
    try {
      if (!firstName || !lastName || !email || !password || !repeatPassword || !dobDay || !dobMonth || !dobYear) {
        setError("Please fill in all fields");
        return;
      }

      if (password !== repeatPassword) {
        setError("Passwords do not match");
        return;
      }

      await register(firstName, lastName, email, password, new Date(dobYear, dobMonth - 1, dobDay).toISOString());
      navigate("/login");
    } catch (err) {
      setError("Registering failed: " + err.message);
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

      <div className="w-full max-w-md mx-auto my-6 p-6 border border-gray-200 rounded-2xl shadow-sm">
        <h1>Create an Account</h1>

        {error && <div className="bg-red-200 p-4 border border-red-600 rounded-2xl mt-4"><p className="text-red-600">{error}</p></div>}

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>

          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col w-1/2 gap-2">
              <label className="font-medium">First Name</label>
              <input
                type="text"
                placeholder="Matti"
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="flex flex-col w-1/2 gap-2">
              <label className="font-medium">Last Name</label>
              <input
                type="text"
                placeholder="Meikäläinen"
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Email</label>
            <input
              type="text"
              placeholder="your.email@example.com"
              className="border border-gray-200 rounded-2xl shadow-sm p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-200 rounded-2xl shadow-sm p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Repeat the password"
              className="border border-gray-200 rounded-2xl shadow-sm p-3"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Date of Birth</label>
            <div className="flex flex-row gap-4 w-full">
              <input
                type="number"
                min={1}
                max={31}
                placeholder="Day"
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={dobDay}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val < 1 || val > 31) return;
                  setDobDay(val);
                }}
              />

              <select
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={dobMonth}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDobMonth(isNaN(val) ? undefined : val);
                  dateOfBirthMonthHiddenField.value = isNaN(val) ? "" : val;
                }}
              >
                <option value={undefined}>Month</option>
                {[...Array(12).keys()].map((m) => (
                  <option key={m} value={m + 1}>{m + 1}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                max={12}
                hidden
                placeholder="Month"
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={dobMonth}
                ref={dateOfBirthMonthHiddenField}
              />

              <select
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={dobYear}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val < 1900 || val > new Date().getFullYear()) return;
                  setDobYear(isNaN(val) ? undefined : val);
                  dateOfBirthYearHiddenField.value = isNaN(val) ? "" : val;
                }}
              >
                <option value={undefined}>Year</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <input
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                hidden
                placeholder="Year"
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={dobYear}
                ref={dateOfBirthYearHiddenField}
              />
            </div>
          </div>

          <p className="text-center">By signing up, you agree to our <Link to="/legal/terms" className="text-green-700 underline">Terms of Service</Link> and <Link to="/legal/privacy" className="text-green-700 underline">Privacy Policy</Link>.</p>

          <button type="submit" className="button-primary mt-2">
            Create an Account
          </button>

          <h3 className="text-center">Already have an account? <Link to="/login" className="text-green-700 font-semibold underline">Log In</Link></h3>

        </form>
      </div>
    </div>
  );
};

export default Register;