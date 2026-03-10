import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { apiRequest } from "../api/user_profile";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiRequest("/api/users", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      navigate(-1);
    } catch (err) {
      console.log("Backend endpoint not ready yet");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FiArrowLeft />
          <h2 className="text-xl font-semibold">Edit Profile</h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="button-primary px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md p-6 space-y-4">
        <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
        <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
        <Input label="Email" name="email" value={form.email} onChange={handleChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Input label="Location" name="location" value={form.location} onChange={handleChange} />

        <div>
          <label className="text-sm block mb-1">Bio</label>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded-md p-2"
          />
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm block mb-1">{label}</label>

      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-md p-2"
      />
    </div>
  );
}