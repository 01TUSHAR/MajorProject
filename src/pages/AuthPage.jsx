import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function AuthPage({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  const handleSubmit = async () => {
    const endpoint = `${import.meta.env.VITE_BACKEND_URL}/${mode}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {


      if (mode === 'signup') {
      alert('Signup successful! Please login.');
      setMode('login'); // Redirect to login mode
      setPassword('');  // Optionally clear password
      return;
    }

        console.log('Auth success', data);
      // Store token in localStorage
      localStorage.setItem('token', data.token);

      // Decode token to extract email
    try {
      const decoded = jwtDecode(data.token);
      console.log('Decoded token', decoded);
      const userEmail = decoded.email || decoded.sub || decoded.identity; // depends on how your JWT is structured

      localStorage.setItem('email', userEmail);
    } catch (err) {
      console.error('Failed to decode token', err);
    }
      onAuth(); // notify App
    } else {
      alert(data.msg || 'Auth failed');
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 className="text-xl font-semibold mb-4 text-center">
      {mode === 'login' ? 'Login' : 'Sign Up'}
    </h2>

    <form
      onSubmit={(e) => {
        e.preventDefault(); // Prevent page reload
        handleSubmit();     // Your custom auth logic
      }}
    >
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 p-2 rounded"
      >
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>

    <p className="text-sm mt-4 text-center">
      {mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
      <button
        className="text-indigo-400 hover:underline"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'Sign Up' : 'Login'}
      </button>
    </p>
  </div>
</div>

  );
}

