export default function Sidebar({ sessions, onSelect, onNewChat, selectedChatId }) {
  return (
    <div className="w-64 bg-gray-800 p-4 border-r border-gray-700">
      <button
        onClick={onNewChat}
        className="mb-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500"
      >
        + New Chat
      </button>
      <ul className="space-y-2">
        {sessions.map((session, idx) => {
          const id = session._id || session.chat_id;
          console.log("Session ID:", id);
          const isSelected = id === selectedChatId;
          return (
            <li
              key={id}
              onClick={() => onSelect(id)}
              className={`cursor-pointer px-2 py-1 rounded text-white ${
                isSelected ? "bg-indigo-600" : "hover:text-indigo-300"
              }`}
            >
              {session.title || `Chat ${idx + 1}`}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
