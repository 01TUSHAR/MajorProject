import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (!text && !image) return;

    // Add user message with both text and preview image
    const newUserMessage = {
      from: 'user',
      text: text || null,
      image: preview || null,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    setLoading(true);
    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, formData);
      setMessages((prev) => [...prev, { from: 'bot', text: res.data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { from: 'bot', text: "❌ Error generating response." }]);
    } finally {
      setText('');
      setImage(null);
      setPreview(null);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs rounded-lg p-3 ${
                msg.from === 'user'
                  ? 'bg-blue-500 text-white text-right'
                  : 'bg-gray-200 text-gray-900 text-left'
              }`}
            >
              {msg.text && <p className="mb-1 whitespace-pre-line">{msg.text}</p>}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="uploaded"
                  className="mt-2 rounded-md max-h-48 border border-white"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <textarea
        className="w-full border rounded p-2"
        rows="3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a story idea..."
        disabled={loading}
      ></textarea>

      <div className="flex items-center justify-between mt-2">
        <label className="cursor-pointer text-blue-600">
          📷 Upload Image
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
          />
        </label>
        <button
          className={`px-4 py-2 rounded text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
