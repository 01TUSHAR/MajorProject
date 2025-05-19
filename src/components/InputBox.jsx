import { useState, useRef } from 'react';
import { FiPlus, FiSend } from 'react-icons/fi';

export default function InputBox({ onSend, isCentered = false }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      fileInputRef.current.value = null;
    }
  };

  const handleSend = () => {
    if (text.trim() || image) {
      onSend({ text, image });
      setText('');
      setImage(null);
    }
  };

  return (
    <div
      className={`${
        isCentered
          ? 'shadow-lg rounded-lg bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700'
          : 'border-gray-700 bg-gray-900'
      } w-full px-4 py-2 flex items-center gap-3`}
      style={{ minHeight: '44px' }}
    >
      <label className="cursor-pointer relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-700 transition overflow-hidden">
        {image ? (
          <img
            src={image}
            alt="preview"
            className="w-full h-full object-cover rounded-md border-2 border-indigo-500"
          />
        ) : (
          <FiPlus className="text-indigo-400 text-xl" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
      </label>

      <textarea
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 resize-none rounded-md bg-gray-800 text-white placeholder-indigo-300 px-3 py-2 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition"
        style={{ lineHeight: '1.3', minHeight: '44px' }}
      />

      {(text.trim() || image) && (
        <button
          onClick={handleSend}
          className="flex items-center justify-center p-2 rounded-md bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm"
          aria-label="Send message"
        >
          <FiSend className="text-white text-xl" />
        </button>
      )}
    </div>
  );
}
