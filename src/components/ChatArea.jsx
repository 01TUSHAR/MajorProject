import { useEffect, useRef } from 'react';

export default function ChatArea({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 w-full">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-sm w-fit p-3 rounded-lg shadow-md break-words ${
            msg.isUser
              ? 'bg-indigo-600 text-white ml-auto'
              : 'bg-gray-800 text-white mr-auto'
          }`}
        >
          {msg.text && (
            <p className="whitespace-pre-wrap">{msg.text}</p>
          )}
          {msg.image && (
            <img
              src={msg.image}
              alt="sent"
              className="w-48 h-32 rounded-lg border border-indigo-300 shadow-sm object-cover mt-2"
            />
          )}
        </div>
      ))}

      {isTyping && (
        <div className="max-w-sm w-fit p-3 rounded-lg shadow-md bg-gray-800 text-white mr-auto">
          <TypingDots />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex space-x-1 items-center">
      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-0" />
      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-200" />
      <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-400" />
    </div>
  );
}
