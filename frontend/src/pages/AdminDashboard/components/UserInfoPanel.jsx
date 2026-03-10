import { useState } from 'react'
import { IoClose } from "react-icons/io5";
import authApi from '../../../api/auth';

export default function UserInfoPanel({ user, onClose }) {
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

  function onClickOutside(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function onClickSave() {
    const token = localStorage.getItem("token");
    const newUser = { ...user, role: role };
    await authApi.saveUserInfo(newUser, token);
  }

  return (
    <div className="fixed bg-black/20 top-0 left-0 w-screen h-screen z-200 overflow-y-auto" onClick={onClickOutside}>
      <div className="bg-background mx-auto my-12 w-8/12 max-w-110 p-6 rounded-2xl shadow-2xl flex flex-col gap-3">
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
          <button className="w-1/2" disabled={role === user.role} onClick={onClickSave}>
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
