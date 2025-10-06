import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import App from './App.jsx';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است');
    }
  }

  return (
    <App>
      <div className="flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="card max-w-md w-full">
          <h1 className="text-2xl font-bold text-brand-800 mb-4">ورود ادمین</h1>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input className="input" placeholder="نام کاربری" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input className="input" type="password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button className="button w-full" type="submit">ورود</button>
          </form>
        </motion.div>
      </div>
    </App>
  );
}
