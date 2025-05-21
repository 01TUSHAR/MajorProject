import { useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function InputBox({ onSend }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setImagePreview(url);
    }
  };

  const handleSend = () => {
    if (!text.trim() && !image) return;
    onSend({ text, image });
    setText("");
    setImage(null);
    setImagePreview(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center w-full gap-3">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Image upload button / preview */}
      <div
        onClick={triggerFileInput}
        className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg border border-gray-600 cursor-pointer hover:border-indigo-500"
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <FiPlus className="text-white" />
        )}
      </div>

      {/* Text input */}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition"
      >
        Send
      </button>
    </div>
  );
}
