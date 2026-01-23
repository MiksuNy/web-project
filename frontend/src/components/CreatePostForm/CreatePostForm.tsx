export default function CreatePostForm() {
  return (
    <div className="flex flex-col rounded-2xl shadow-xl m-6 p-6 border border-gray-200 max-w-3xl mx-auto">
      <h1>Create a Post</h1>
      <div className="flex flex-col">
        <div className="flex flex-row justify-stretch gap-2">
          <button id="create-post-offer-button" className="button-accent1 w-1/2 h-20">🤝 I Can Offer Help</button>
          <button id="create-post-request-button" className="button-accent2 w-1/2 h-20">🙋 I Need Help</button>
        </div>
        <select id="create-post-category">
          <option>Transportation</option>
          <option>Food</option>
          <option>Education</option>
          <option>Technology</option>
          <option>Home Repair</option>
          <option>Companionship</option>
          <option>Other</option>
        </select>
        <input type="text" id="create-post-title" placeholder="Title" />
        <textarea id="create-post-description" placeholder="Description" className="min-h-24"></textarea>
        <input type="file" id="create-post-thumbnail" placeholder="Upload image" />
      </div>
    </div>
  )
}
