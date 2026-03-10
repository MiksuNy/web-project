import { useState, useEffect } from "react";
import { MdPerson, MdEmail, MdSave } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/user_profile";

function Settings() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {

    const data = await apiRequest("/api/auth/userinfo");

    setForm({
      firstName: data.user?.firstName || "",
      lastName: data.user?.lastName || "",
      email: data.user?.email || ""
    });

  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  const handleSave = async () => {

    try {

      await apiRequest("/api/auth/edit", {
        method: "PUT",
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email
        })
      });

      // بعد از save مستقیم برو profile
      navigate("/profile");

    } catch (err) {
      console.log(err);
    }

  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h2 className="text-xl font-semibold">Account Settings</h2>

      <div className="space-y-4">

        <Input icon={<MdPerson />} label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />

        <Input icon={<MdPerson />} label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />

        <Input icon={<MdEmail />} label="Email" name="email" value={form.email} onChange={handleChange} />

        <button
          onClick={handleSave}
          className="button-primary flex items-center gap-2 px-5 py-2 rounded-lg"
        >
          <MdSave />
          Save Changes
        </button>

      </div>

    </div>
  );
}

function Input({ icon, label, name, value, onChange }) {

  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium">
        {icon} {label}
      </label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full p-3 border rounded-lg"
      />
    </div>
  );
}

export default Settings;