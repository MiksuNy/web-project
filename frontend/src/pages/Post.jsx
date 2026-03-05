import { useRef, useState } from "react"
import { IoMdCloudUpload } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function Post() {
  const navigate = useNavigate();

  const [needingHelp, setNeedingHelp] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState();
  const [selectedThumbnailFile, setSelectedThumbnailFile] = useState();

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
          <select id="create-post-category" className="border border-gray-200 rounded-2xl shadow-sm p-3">
            <option>Transportation</option>
            <option>Food</option>
            <option>Education</option>
            <option>Technology</option>
            <option>Home Repair</option>
            <option>Companionship</option>
            <option>Other</option>
          </select>
        </div>
        <input type="text" id="create-post-title" placeholder="Title" className="border border-gray-200 rounded-2xl shadow-sm p-3" />
        <textarea id="create-post-description" placeholder="Description" className="border border-gray-200 rounded-2xl shadow-sm p-3 min-h-24"></textarea>
        {selectedThumbnail && <img src={selectedThumbnail} className="w-full h-auto rounded-3xl select-none"></img>}
        <div className="w-full p-12 border-4 border-dashed rounded-3xl flex items-center justify-center gap-2 select-none cursor-pointer" onClick={() => thumbnailUploadInput.current?.click()}>
          <IoMdCloudUpload className="w-6 h-6" /> Upload a thumbnail (optional)
        </div>
        <input type="file" id="create-post-thumbnail" placeholder="Upload image" onChange={thumbnailChanged} ref={thumbnailUploadInput} accept="image/*" hidden />
        <button id="create-post-submit" className="button-primary">Post</button>
      </div>
    </div>
  )
}
