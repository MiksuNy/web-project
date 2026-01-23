export default function CreatePostForm() {
  return (
    <div className="flex flex-col">
      <h1>Create a Post</h1>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <button id="create-post-offer-button">🤝 I Can Offer Help</button>
          <button id="create-post-request-button">🙋 I Need Help</button>
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
        <textarea id="create-post-description" placeholder="Description"></textarea>
        <input type="file" id="create-post-thumbnail" placeholder="Upload image" />
      </div>
    </div>
  )
}
