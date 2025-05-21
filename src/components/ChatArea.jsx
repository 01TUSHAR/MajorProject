import { useEffect, useRef } from 'react';

export default function ChatArea({ messages, isTyping }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping]);

  return (
    <div className="px-12 py-4 space-y-4 h-full w-full flex flex-col overflow-y-auto mx-auto">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`max-w-sm w-fit p-2 rounded-lg shadow-md break-words
            ${msg.isUser
              ? 'bg-indigo-600 text-white justify-end ml-auto'
              : 'bg-gray-800 bg-opacity-90 text-white justify-start mr-auto'}`}
        >
          {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
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
    <div className="flex space-x-1 items-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
