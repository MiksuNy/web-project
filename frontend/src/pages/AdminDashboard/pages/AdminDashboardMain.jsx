import { FaExclamationCircle } from "react-icons/fa";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

export default function AdminDashboardMain() {
  return (
    <div>

      <h1 className="mb-3">Admin Dashboard</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-background p-5 rounded-3xl shadow-md border border-border">
          <div class="flex items-center gap-2 mb-2">
            <p class="text-sm text-gray-600 font-semibold">Total Users</p>
          </div>
          <p class="text-3xl font-bold text-gray-900">5</p>
          <p class="text-xs text-green-600 mt-1 flex items-center gap-1"><FaArrowTrendUp /> +2 this week</p>
        </div>
        <div class="bg-background p-5 rounded-3xl shadow-md border border-border">
          <div class="flex items-center gap-2 mb-2">
            <p class="text-sm text-gray-600 font-semibold">Total Posts</p>
          </div>
          <p class="text-3xl font-bold text-gray-900">4</p>
          <p class="text-xs text-red-600 mt-1 flex items-center gap-1"><FaArrowTrendDown /> -1 active this week</p>
        </div>
        <div class="bg-background p-5 rounded-3xl shadow-md border border-border">
          <div class="flex items-center gap-2 mb-2">
            <p class="text-sm text-gray-600 font-semibold">Active Connections</p>
          </div>
          <p class="text-3xl font-bold text-gray-900">0</p>
          <p class="text-xs mt-1 flex items-center gap-1">0% success rate</p>
        </div>
        <div class="bg-background p-5 rounded-3xl shadow-md border border-border">
          <div class="flex items-center gap-2 mb-2">
            <p class="text-sm text-gray-600 font-semibold">Pending Requests</p>
          </div>
          <p class="text-3xl font-bold text-gray-900">2</p>
          <p class="text-xs text-orange-400 mt-1 flex items-center gap-1"><FaExclamationCircle /> Needs attention</p>
        </div>
      </div>

    </div>
  )
}
