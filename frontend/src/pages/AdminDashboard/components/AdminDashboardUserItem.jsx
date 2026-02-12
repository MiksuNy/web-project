import { FaGavel, FaInfo } from "react-icons/fa";

export default function AdminDashboardUserItem({ user }) {
  function formatDate(date) {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString("fi-FI");
  }

  return (
    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-accent bg-linear-150 from-green-600 to-gray-600 text-white font-bold flex justify-center items-center select-none">
            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold text-gray-900 text-nowrap">{user.firstName} {user.lastName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
      <td className="px-4 py-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-green-300' : 'bg-slate-300'
          }`}>
          {user.role === 'admin' ? "Admin" : "User"}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{user.location}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.joinDate)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        <div className="flex flex-col text-nowrap">
          <span>{user.postsCount ?? 0} posts</span>
          <span className="text-xs text-gray-500">{user.connectionsCount ?? 0} connections</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 flex items-center justify-center bg-blue-50 border border-blue-600 text-blue-700 rounded hover:bg-blue-100 transition-all"
            title="View Details"
          >
            <FaInfo />
          </button>
          {user.role !== 'admin' && (
            <button
              className="w-8 h-8 flex items-center justify-center bg-red-50 border border-red-600 text-red-700 rounded hover:bg-red-100 transition-all"
              title="Suspend User"
            >
              <FaGavel className="absolute" />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
