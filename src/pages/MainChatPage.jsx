import { useState, useEffect } from "react";
import InputBox from "../components/InputBox";
import ChatArea from "../components/ChatArea";
import Sidebar from "../components/Sidebar";

export default function MainChatPage({ selectedChatId, onSelectChat }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(selectedChatId);

  // Fetch and sort chat sessions
  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (!email) throw new Error("No email found");
      if (!token) throw new Error("No token found");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chatSession`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const json = await res.json();
      console.log("Response JSON:", json);

      if (json.success) {
        const sorted = [...(json.sessions || [])].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setChatSessions(sorted);
      } else {
        console.error("Backend returned an error:", json);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!currentChatId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/chatMessages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ chat_id: currentChatId }),
          }
        );
        const json = await res.json();
        console.log("Fetched messages:", json);
        if (json.success && Array.isArray(json.messages)) {
          setMessages(
            json.messages.flatMap((m) => [
              { text: m.input || "", image: null, isUser: true },
              { text: m.output || "", image: null, isUser: false },
            ])
          );
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("Failed to fetch chat messages", err);
      }
    };

    fetchMessages();
  }, [currentChatId]);

  const handleSend = async ({ text, image }) => {
    if (!text.trim() && !image) return;



    // Add user's message immediately
    const imageUrl = image ? URL.createObjectURL(image) : null;
    setMessages((prev) => [...prev, { text, image : imageUrl, isUser: true }]);
    setIsTyping(true);

    try {
      const formData = new FormData();

      if (text) formData.append("text", text);
      if (image) {
        // If image is a URL, fetch blob
        if (typeof image === "string") {
          const response = await fetch(image);
          const blob = await response.blob();
          formData.append("image", blob, "image.jpg");
        } else {
          // If image is already a File or Blob, append directly
          formData.append("image", image, "image.jpg");
        }
      }
      const email = localStorage.getItem("email");
      formData.append("email", email);
      // Use new_chat if no currentChatId, else normal chat update
      const url = currentChatId
        ? `${import.meta.env.VITE_BACKEND_URL}/chat`
        : `${import.meta.env.VITE_BACKEND_URL}/new_chat`;

      if (currentChatId) {
        formData.append("chat_id", currentChatId);
      }

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("Response from backend:", data);

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { text: data.response, isUser: false, image: null },
        ]);

        // If new chat created, update currentChatId & sidebar
        if (!currentChatId && data.chat_id) {
          setCurrentChatId(data.chat_id);
          onSelectChat?.(data.chat_id);
          await fetchSessions();
        }
      } else {
        console.error("Backend error:", data);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectChat = async (chatId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chatMessages`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chat_id: chatId }),
          method: "POST",
        }
      );
      const json = await res.json();
      console.log("Fetched chat messages:", json);
      if (json.success) {
        // Map backend messages format to UI format
        const mappedMessages = (json.messages || []).map((m) => ({
          text: m.output || m.text || "",
          image: m.image || null,
          isUser: m.isUser || false,
        }));

        setMessages(mappedMessages);
        setCurrentChatId(chatId);
        onSelectChat?.(chatId);
      } else {
        console.error("Failed to load chat messages:", json);
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    onSelectChat?.(null);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        sessions={chatSessions}
        onSelect={handleSelectChat}
        onNewChat={handleNewChat}
        selectedChatId={currentChatId}
      />
      <div className="flex flex-col flex-1 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 w-full bg-gray-900 bg-opacity-60">
          <ChatArea messages={messages} isTyping={isTyping} />
        </div>
        <div className="border-indigo-700 w-full mx-auto px-4 py-3 bg-gray-900 flex items-center gap-3">
          <InputBox onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
