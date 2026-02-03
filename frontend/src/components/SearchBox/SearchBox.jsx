import { useState } from "react";

import { IoClose } from "react-icons/io5";

export default function SearchBox() {
  const [selectedTypes, setSelectedTypes] = useState([]); // 0 = all, 1 = offers, 2 = requests

  function setSelectedType(type) {
    if (type === 0) {
      setSelectedTypes([]);
      return;
    }

    if (selectedTypes.find((f) => f === type)) {
      setSelectedTypes(selectedTypes.filter((f) => f !== type));
      return;
    }
    setSelectedTypes([...selectedTypes, type]);
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-6 p-6 border border-gray-200 rounded-2xl shadow-sm">

      {/* Input field */}
      <input type="text" placeholder="Search for help..." className="w-full mx-auto p-2 py-3 mb-4 focus:outline-0" />

      {/* Selected types */}
      {selectedTypes.length > 0 && <div className="flex w-full align-middle gap-2 flex-wrap mb-2">

        {selectedTypes.find((f) => f === 1) && <div className={`flex items-center gap-1 text-nowrap px-3 py-2 h-min text-black rounded-full select-none cursor-pointer bg-gray-200 hover:bg-gray-300 active:bg-gray-400`}
          onClick={() => setSelectedType(1)}>🤝 Offers <IoClose /></div>}

        {selectedTypes.find((f) => f === 2) && <div className={`flex items-center gap-1 text-nowrap px-3 py-2 h-min text-black rounded-full select-none cursor-pointer bg-gray-200 hover:bg-gray-300 active:bg-gray-400`}
          onClick={() => setSelectedType(2)}>🙋‍♂️ Requests <IoClose /></div>}

      </div>}

      <div className="flex justify-stretch items-center">

        {/* Type selector */}
        <div className="flex w-full align-middle gap-2 flex-wrap">

          <div className={`text-nowrap px-3 py-2 h-min text-white rounded-full select-none cursor-pointer 
            ${selectedTypes.length === 0 ? "bg-gray-900 hover:bg-gray-800 active:bg-gray-700" : "bg-gray-600 hover:bg-gray-700 active:bg-gray-800"}`}
            onClick={() => setSelectedType(0)}>All posts</div>

          <div className={`text-nowrap px-3 py-2 h-min text-white rounded-full select-none cursor-pointer 
            ${selectedTypes.find((f) => f === 1) ? "bg-gray-900 hover:bg-gray-800 active:bg-gray-700" : "bg-green-600 hover:bg-green-700 active:bg-green-800"}`}
            onClick={() => setSelectedType(1)}>🤝 Offers</div>

          <div className={`text-nowrap px-3 py-2 h-min text-white rounded-full select-none cursor-pointer 
            ${selectedTypes.find((f) => f === 2) ? "bg-gray-900 hover:bg-gray-800 active:bg-gray-700" : "bg-gray-500 hover:bg-gray-600 active:bg-gray-700"}`}
            onClick={() => setSelectedType(2)}>🙋‍♂️ Requests</div>

        </div>

        {/* Category selector */}
        <select className="w-full min-w-50 ml-4 p-4 rounded-2xl border border-gray-200 shadow-sm">
          <option>All Categories</option>
          <option>Transportation</option>
          <option>Food</option>
          <option>Education</option>
          <option>Technology</option>
          <option>Home Repair</option>
          <option>Companionship</option>
          <option>Other</option>
        </select>

      </div>
    </div>
  )
}
