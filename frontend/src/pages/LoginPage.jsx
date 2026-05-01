import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    if (isRegister) {
      // after registering, switch to login
      setIsRegister(false);
      setForm({ email: '', password: '' });
      return;
    }

    login(data.user, data.token);
    navigate('/');
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto' }}>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
        </div>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>

      <p style={{ marginTop: '20px' }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => setIsRegister(!isRegister)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'blue' }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}