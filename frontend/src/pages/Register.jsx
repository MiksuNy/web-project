import { useState } from "react";
import authApi from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import municipalities from "@/data/municipalities.json";
import PhoneInput from "react-phone-input-2";
import "./phone-input.css";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [dobDay, setDobDay] = useState(undefined);
  const [dobMonth, setDobMonth] = useState(undefined);
  const [dobYear, setDobYear] = useState(undefined);

  const [location, setLocation] = useState(undefined);

  const [phone, setPhone] = useState(undefined);

  const [error, setError] = useState(undefined);

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function getDaysInMonth(month, year) {
    if (month === 2) {
      return isLeapYear(year) ? 29 : 28;
    }
    return [4, 6, 9, 11].includes(month) ? 30 : 31;
  }

  const handleSubmit = async (e) => {
    setError(undefined);
    e.preventDefault();
    try {
      if (!firstName || !lastName || !email || !password || !repeatPassword || !dobDay || !dobMonth || !dobYear || !location || !phone) {
        setError("Please fill in all fields");
        return;
      }

      if (password !== repeatPassword) {
        setError("Passwords do not match");
        return;
      }

      await authApi.register(firstName, lastName, email, password, new Date(dobYear, dobMonth - 1, dobDay).toISOString(), location, phone);
      setRegistrationSuccessful(true);
      setTimeout(async () => {
        await login(email, password);
        navigate("/");
      }, 5000);
    } catch (err) {
      setError("Registering failed: " + err.message);
    }
  };

  if (registrationSuccessful) {
    return (
      <div className="fixed w-screen h-screen z-1000 bg-background flex flex-col items-center justify-center gap-6">
        <img
          src="/logo.svg"
          alt="HelpConnect logo"
          className="w-40 h-40 object-cover logo-pulse-animation"
        />
        <p className="registration-success-text-animation text-6xl font-bold bg-linear-to-r from-green-600 to-gray-700 bg-clip-text text-transparent">{firstName ? `Welcome, ${firstName}!` : "Welcome!"}</p>
        <p className="registration-success-text-animation text-xl text-muted-foreground">Your registration was successful! Please wait...</p>
      </div>
    );
  } else {
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
                type="email"
                placeholder="your.email@example.com"
                className="border border-gray-200 rounded-2xl shadow-sm p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="font-medium">Phone</label>
              <PhoneInput
                inputClass="!w-full !h-full"
                containerClass="w-full h-full"
                country={'fi'}
                value={phone}
                onChange={setPhone}
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
                <select
                  className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                  value={dobDay}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < 1 || val > getDaysInMonth(dobMonth ?? 1, dobYear ?? 2000)) return;
                    setDobDay(isNaN(val) ? undefined : val);
                  }}
                >
                  <option value={undefined}>Day</option>
                  {[...Array(getDaysInMonth(dobMonth ?? 1, dobYear ?? 2000)).keys()].map((d) => (
                    <option key={d} value={d + 1}>{d + 1}</option>
                  ))}
                </select>

                <select
                  className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                  value={dobMonth}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < 1 || val > 12) return;
                    setDobMonth(isNaN(val) ? undefined : val);
                  }}
                >
                  <option value={undefined}>Month</option>
                  {[...Array(12).keys()].map((m) => (
                    <option key={m} value={m + 1}>{m + 1}</option>
                  ))}
                </select>

                <select
                  className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                  value={dobYear}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val < 1900 || val > new Date().getFullYear()) return;
                    setDobYear(isNaN(val) ? undefined : val);
                  }}
                >
                  <option value={undefined}>Year</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium">Location</label>
              <select
                className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
                value={location}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocation(val);
                }}
              >
                <option value={undefined}></option>
                {municipalities.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
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
  }
};

export default Register;