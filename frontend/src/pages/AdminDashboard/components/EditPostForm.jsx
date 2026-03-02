import { useRef, useState } from "react"
import { IoMdCloudUpload } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export default function EditPostForm({ post, onClose }) {
  const [needingHelp, setNeedingHelp] = useState(post.type === "request");
  const [selectedThumbnail, setSelectedThumbnail] = useState(post.image);
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
    <div className="fixed bg-black/20 top-0 left-0 w-screen h-screen z-200 overflow-y-auto">
      <div className="bg-background mx-auto my-12 w-8/12 max-w-200 p-6 rounded-2xl shadow-2xl flex flex-col gap-3">
        <div className="flex justify-between content-center">
          <h1>Edit a Post</h1>
          <div className="flex p-2 w-8 h-8 cursor-pointer rounded-full hover:bg-accent" onClick={onClose}><IoClose /></div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-row justify-stretch gap-2">
            <button id="create-post-offer-button" className={`${!needingHelp ? "button-primary" : "button-secondary"} w-1/2 h-20`} onClick={() => setNeedingHelp(false)}>🤝 I Can Offer Help</button>
            <button id="create-post-request-button" className={`${needingHelp ? "button-primary" : "button-secondary"} w-1/2 h-20`} onClick={() => setNeedingHelp(true)}>🙋 I Need Help</button>
          </div>
          <div className="flex flex-col gap-2">
            <label>I need help with:</label>
            <select id="create-post-category" className="border border-gray-200 rounded-2xl shadow-sm p-3" value={post.category}>
              <option>Transportation</option>
              <option>Food</option>
              <option>Education</option>
              <option>Technology</option>
              <option>Home Repair</option>
              <option>Companionship</option>
              <option>Other</option>
            </select>
          </div>
          <input type="text" id="create-post-title" placeholder="Title" value={post.title} className="border border-gray-200 rounded-2xl shadow-sm p-3" />
          <textarea id="create-post-description" placeholder="Description" className="border border-gray-200 rounded-2xl shadow-sm p-3 min-h-24">{post.description}</textarea>
          {selectedThumbnail && <img src={selectedThumbnail} className="w-full h-auto max-h-100 object-cover rounded-3xl select-none"></img>}
          <div className="w-full p-12 border-4 border-dashed rounded-3xl flex items-center justify-center gap-2 select-none cursor-pointer" onClick={() => thumbnailUploadInput.current?.click()}>
            <IoMdCloudUpload className="w-6 h-6" /> Upload a thumbnail (optional)
          </div>
          <input type="file" id="create-post-thumbnail" placeholder="Upload image" onChange={thumbnailChanged} ref={thumbnailUploadInput} accept="image/*" hidden />
          <button id="create-post-submit">Post</button>
        </div>
      </div>
    </div>
  )
}
