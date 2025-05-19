import { useState } from 'react';
import InputBox from '../components/InputBox';
import ChatArea from '../components/ChatArea';

export default function MainChatPage() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasStarted = messages.length > 0;

  const handleSend = async ({ text, image }) => {
    if (!text.trim() && !image) return;

    // Add user message immediately (mark isUser: true)
    setMessages((prev) => [...prev, { text, image, isUser: true }]);

    setIsTyping(true);

    const formData = new FormData();
    if (text) formData.append('text', text);

    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      formData.append('image', blob, 'image.jpg');
    }

    for (const [key, value] of formData.entries()) {
  console.log(key, value);
}

    // Send data to backend
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      console.log('Response from server:', data);
      const bots = data.message[data.message.length - 1];
      const botResponse = bots[bots.length - 1];

      console.log('Bot response:', botResponse);
      if (!botResponse) {
        setMessages((prev) => [
          ...prev,
          { text: '[Error: No response from server]', isUser: false },
        ]);
        return;
      }


      // Add bot message (mark isUser: false)
      setMessages((prev) => [...prev, { text: botResponse, isUser: false }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: '[Error contacting server. Please try again.]', isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br p-4 from-gray-900 via-indigo-900 to-purple-900 text-white flex flex-col">
      {!hasStarted ? (
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="w-full max-w-md shadow-lg rounded-lg bg-gray-900/90 backdrop-blur-sm">
            <InputBox onSend={handleSend} isCentered />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full bg-gray-900 bg-opacity-60 rounded-t-lg shadow-inner shadow-indigo-900/80 flex flex-col">
            <ChatArea messages={messages} isTyping={isTyping} />
          </div>

          <div className="border-indigo-700 w-full max-w-2xl mx-auto px-4 py-3 bg-gray-900 flex items-center gap-3 rounded-b-lg shadow-md">
            <InputBox onSend={handleSend} />
          </div>
        </>
      )}
    </div>
  );
}
