import { useEffect, useRef } from 'react';

export default function ChatArea({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="px-8 py-4 space-y-4 h-full w-full flex flex-col overflow-y-auto max-w-2xl mx-auto">
      {messages.map((msg, idx) => {
        const isUser = msg.isUser;
        return (
          <div
            key={idx}
            className={`max-w-sm w-fit p-2 rounded-lg shadow-md break-words
              ${isUser 
                ? 'bg-indigo-600 text-white justify-end ml-auto' 
                : 'bg-gray-800 bg-opacity-90 text-white justify-start mr-auto'}`}
          >
            {msg.text && (
              <p className="whitespace-pre-wrap text-base leading-tight">
                {msg.text}
              </p>
            )}
            {msg.image && (
              <img
                src={msg.image}
                alt="sent"
                className="w-48 h-32 rounded-lg border border-indigo-300 shadow-sm object-cover mt-2"
              />
            )}
          </div>
        );
      })}

      {isTyping && (
        <div className="max-w-sm w-fit p-2 rounded-lg shadow-md bg-gray-800 bg-opacity-90 text-white self-start mr-auto">
          <TypingDots />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex space-x-1">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
