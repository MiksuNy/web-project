import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "minoo",
    email: "minoo@gmail.com",
    bio: "",
    phone: "",
    location: "",
  });

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
            onClick={() => navigate(-1)}
            className="button-primary w-auto px-4 py-2"
          >
            Save
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-green-600 to-gray-500" />

        <div className="p-6 relative space-y-5">
          {/* Avatar */}
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-gradient-to-br from-green-600 to-gray-500 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
            MI
          </div>

          <div className="mt-14 space-y-4">

            <Input
              label="Name"
              value={formData.name}
              onChange={(v) =>
                setFormData({ ...formData, name: v })
              }
            />

            <Input
              label="Email"
              value={formData.email}
              onChange={(v) =>
                setFormData({ ...formData, email: v })
              }
            />

            <Textarea
              label="Bio"
              value={formData.bio}
              onChange={(v) =>
                setFormData({ ...formData, bio: v })
              }
            />

            <Input
              label="Phone"
              value={formData.phone}
              onChange={(v) =>
                setFormData({ ...formData, phone: v })
              }
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(v) =>
                setFormData({ ...formData, location: v })
              }
            />

          </div>
        </div>
      </div>
    </div>
  );
}

/* Small reusable input */
function Input({ label, value, onChange }) {
  return (
    <div className="space-y-1">
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
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-lg px-3 py-2 h-24 resize-none"
      />
    </div>
  );
}