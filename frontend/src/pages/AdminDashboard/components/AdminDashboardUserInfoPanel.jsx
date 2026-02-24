import { useState } from 'react'
import { IoClose } from "react-icons/io5";

export default function AdminDashboardUserInfoPanel({ user, onClose }) {
  const [role, setRole] = useState(user.role ?? "client");

  function formatDate(date) {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("fi-FI");
  }

  const roles = [
    {
      value: "client",
      text: "Client"
    },
    {
      value: "admin",
      text: "Administrator"
    },
  ];

  return (
    <div className="fixed bg-black/20 top-0 left-0 w-screen h-screen z-200">
      <div className="bg-background left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8/12 max-w-120 p-6 rounded-2xl shadow-2xl fixed flex flex-col gap-3">
        <div className="flex justify-between content-center">
          <h1>User info</h1>
          <div className="flex p-2 w-8 h-8 cursor-pointer rounded-full hover:bg-accent" onClick={onClose}><IoClose /></div>
        </div>

        <h2>{user.firstName} {user.lastName}</h2>

        <div>
          <strong>Email address</strong>
          <p>{user.email}</p>
        </div>

        <div>
          <strong>Location</strong>
          <p>{user.location}</p>
        </div>

        <div className="flex gap-3 justify-between">
          <div className="w-1/2 flex flex-col">
            <strong>Role</strong>
            <select value={role} onChange={(e) => setRole(e.currentTarget.value)}>
              {
                roles.map((role, index) =>
                  <option key={index} value={role.value}>{role.text}</option>
                )
              }
            </select>
          </div>

          <div className="w-1/2">
            <strong>Join date</strong>
            <p>{formatDate(user.joinDate)}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-between">
          <button className="w-1/2" disabled={role === user.role}>
            Save Changes
          </button>

          <button className="w-1/2 button-red">
            Suspend User
          </button>
        </div>
      </div>
    </div>
  )
}
