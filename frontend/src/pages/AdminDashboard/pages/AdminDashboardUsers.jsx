import userData from "@/data/users.json";
import { useEffect, useState } from "react";
import AdminDashboardUserItem from "../components/AdminDashboardUserItem";

export default function AdminDashboardUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(userData);
  }, []);

  return (
    <div>

      <h1 className="mb-3">Users</h1>

      <div className="overflow-x-auto border border-border rounded-2xl">
        <table className="w-full">
          <thead className="bg-accent border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Join Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Activity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <AdminDashboardUserItem key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
