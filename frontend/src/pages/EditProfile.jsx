import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { apiRequest } from "../api/user_profile";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await apiRequest("/api/auth/userinfo");

      if (data?.user) {
        setForm({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await apiRequest("/api/auth/edit", {
        method: "PUT",
        body: JSON.stringify(form),
      });

      navigate("/profile");
    } catch (err) {
      console.log(err);
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
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md p-6 space-y-4">
        <Input
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />

        <Input
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
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