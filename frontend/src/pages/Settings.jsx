import { useState } from "react";
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdInfo,
  MdSave
} from "react-icons/md";

function Settings() {
  // initialize state from localStorage
  const [form, setForm] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("profile"));
    return saved || {
      name: "",
      email: "",
      phone: "",
      location: "",
      bio: ""
    };
  });

  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // save profile
 const handleSave = () => {

  if (!form.name || !form.email) {
    setError("Name and email are required.");
    return;
  }

  localStorage.setItem("profile", JSON.stringify(form));

  setError("");
  setSaved(true);

  setTimeout(() => {
    setSaved(false);
  }, 2000);

  window.location.reload();

};
  return (
    <div className="min-h-screen bg-muted/20 p-6">
      {/* PAGE HEADER */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">
        {/* SIDEBAR */}
        <div className="bg-card border rounded-xl p-4 h-fit">
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-100 text-green-700 font-medium">
              <MdPerson />
              Account
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
              Notifications
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
              Privacy
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
              Accessibility
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-3 bg-card border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-1">
            Account Information
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Update your personal details and profile information
          </p>

          <div className="space-y-5">
            {/* NAME */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <MdPerson /> Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <MdEmail /> Email Address
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <MdPhone /> Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* LOCATION */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <MdLocationOn /> Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* BIO */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium">
                <MdInfo /> Bio
              </label>

              <textarea
                name="bio"
                rows="4"
                maxLength="500"
                value={form.bio}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />

              <div className="text-xs text-muted-foreground mt-1">
                {form.bio.length}/500 characters
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {saved && (
              <div className="text-green-600 text-sm font-medium">
                Profile updated successfully!
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="button-primary flex items-center gap-2 px-5 py-2 rounded-lg"
              >
                <MdSave />
                Save Changes
              </button>

              <button
                className="button-secondary px-5 py-2 rounded-lg"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;