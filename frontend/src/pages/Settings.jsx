import { useState, useEffect } from "react";
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdInfo } from "react-icons/md";

function Settings() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: ""
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("profile")) || {};
    setForm(saved);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(form));
    alert("Saved!");
  };

  return (
    <div className="min-h-screen bg-muted/20 p-6">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6">

        {/* LEFT SIDEBAR */}
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

        {/* RIGHT CONTENT */}
        <div className="col-span-3 bg-card border rounded-xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold mb-1">
            Account Information
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Update your personal details and profile information
          </p>

          <div className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MdPerson /> Full Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MdEmail /> Email Address
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MdPhone /> Phone Number
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MdLocationOn /> Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <MdInfo /> Bio
              </label>

              <textarea
                name="bio"
                rows="4"
                value={form.bio}
                onChange={handleChange}
                className="mt-2 w-full p-3 border rounded-lg bg-input-background"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">

              <button
                onClick={handleSave}
                className="button-primary px-5 py-2 rounded-lg"
              >
                Save Changes
              </button>

              <button className="button-secondary px-5 py-2 rounded-lg">
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