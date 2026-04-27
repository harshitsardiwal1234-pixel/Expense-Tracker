import { useState } from 'react';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/signin' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Authentication failed');
      }
      
      if (isLogin) {
        const data = await response.json();
        onLogin(data.token, { id: data.id, username: data.username });
      } else {
        setIsLogin(true);
        setError('Signup successful! Please login.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container glass-panel">
      <h2>{isLogin ? 'Welcome' : 'Create Account'}</h2>
      {error && <div style={{color: error.includes('successful') ? '#10b981' : '#e11d48', marginBottom: '1rem'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            required
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password"
            required
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
      <p style={{textAlign: 'center', marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem'}}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          style={{color: 'var(--primary)', cursor: 'pointer'}} 
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
        >
          {isLogin ? 'Sign up' : 'Login'}
        </span>
      </p>
    </div>
  );
}
