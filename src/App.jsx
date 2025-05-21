// App.jsx
import { useState, useEffect } from 'react';
import MainChatPage from './pages/MainChatPage';
import AuthPage from './pages/AuthPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [selectedChatId, setSelectedChatId] = useState(null);
  const handleAuth = () => setIsLoggedIn(true);

  return isLoggedIn ? (
    <MainChatPage selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />
  ) : (
    <AuthPage onAuth={handleAuth} />
  );
}
export default App;

