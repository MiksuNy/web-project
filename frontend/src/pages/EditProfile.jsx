import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState(
    location.state || {
      name: "",
      email: "",
      bio: "",
      phone: "",
      location: "",
    }
  );

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FiArrowLeft />
          <h2 className="text-xl font-semibold">Edit Profile</h2>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md border border-border"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              navigate("/profile", {
                state: { updatedUser: formData },
              })
            }
            className="button-primary w-auto px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl shadow-md p-6 space-y-4">
        <Input label="Name" value={formData.name} onChange={(v) => handleChange("name", v)} />
        <Input label="Email" value={formData.email} onChange={(v) => handleChange("email", v)} />
        <Input label="Phone" value={formData.phone} onChange={(v) => handleChange("phone", v)} />
        <Input label="Location" value={formData.location} onChange={(v) => handleChange("location", v)} />
        <Textarea label="Bio" value={formData.bio} onChange={(v) => handleChange("bio", v)} />
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2 h-24 resize-none"
      />
    </div>
  );
}
