import { useRef, useState } from "react"
import { IoMdCloudUpload } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useField from "../hooks/useField";
import api from "../api/posts";
import municipalities from "@/data/municipalities.json";
import { useAuth } from "../context/AuthContext";

export default function Post() {
  const navigate = useNavigate();

  const { user } = useAuth();
  if (!user) {
    navigate("/");
    return null;
  }

  const title = useField("text");
  const description = useField("text");
  const category = useField("text", "Transportation");
  const location = useField("text", user.location);
  const budget = useField("number");

  const [error, setError] = useState(null);

  const [needingHelp, setNeedingHelp] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState();
  const [_, setSelectedThumbnailFile] = useState();

  const thumbnailUploadInput = useRef(null);

  function thumbnailChanged(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files[0];
    setSelectedThumbnail(URL.createObjectURL(file));
    setSelectedThumbnailFile(file);
  }

  async function submit() {
    setError(null);

    const newPost = {
      type: needingHelp ? "request" : "offer",
      title: title.value,
      description: description.value,
      category: category.value ?? "Other",
      budget: needingHelp ? parseFloat(budget.value ?? "0") : null,
    };

    try {
      const token = localStorage.getItem("token");
      await api.createPost(newPost, token);
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="flex flex-col gap-6 py-8 max-w-3xl w-10/12 mx-auto">
      <div className="flex flex-row justify-between items-center">
        <h1>Create a Post</h1>
        <span onClick={() => navigate("/")} className="cursor-pointer text-2xl text-gray-500 hover:text-gray-700"><IoClose /></span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-stretch gap-2">
          <button id="create-post-offer-button" className={`${!needingHelp ? "button-primary" : "button-secondary"} w-1/2 h-20`} onClick={() => setNeedingHelp(false)}>🤝 I Can Offer Help</button>
          <button id="create-post-request-button" className={`${needingHelp ? "button-primary" : "button-secondary"} w-1/2 h-20`} onClick={() => setNeedingHelp(true)}>🙋 I Need Help</button>
        </div>
        <div className="flex flex-col gap-2">
          <label>I need help with:</label>
          <select {...category} className="border border-gray-200 rounded-2xl shadow-sm p-3">
            <option>Transportation</option>
            <option>Food</option>
            <option>Education</option>
            <option>Technology</option>
            <option>Home Repair</option>
            <option>Companionship</option>
            <option>Other</option>
          </select>
        </div>
        <input {...title} placeholder="Title" className="border border-gray-200 rounded-2xl shadow-sm p-3" />
        <textarea {...description} placeholder="Description" className="border border-gray-200 rounded-2xl shadow-sm p-3 min-h-24"></textarea>
        {needingHelp && <>
          <input {...budget} step="0.01" placeholder="Budget" className="border border-gray-200 rounded-2xl shadow-sm p-3" />
          <select
            className="border border-gray-200 rounded-2xl shadow-sm p-3 w-full"
            {...location}
          >
            {municipalities.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </>}
        {selectedThumbnail && <img src={selectedThumbnail} className="w-full h-auto rounded-3xl select-none"></img>}
        <div className="w-full p-12 border-4 border-dashed rounded-3xl flex items-center justify-center gap-2 select-none cursor-pointer" onClick={() => thumbnailUploadInput.current?.click()}>
          <IoMdCloudUpload className="w-6 h-6" /> Upload a thumbnail (optional)
        </div>
        <input type="file" id="create-post-thumbnail" placeholder="Upload image" onChange={thumbnailChanged} ref={thumbnailUploadInput} accept="image/*" hidden />
        <button id="create-post-submit" onClick={submit}>Post</button>
        {error && <div className="bg-red-200 p-4 border border-red-600 rounded-2xl mt-4"><p className="text-red-600">{error}</p></div>}
      </div>
    </div>
  )
}
