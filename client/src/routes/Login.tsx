import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const navigate = useNavigate();
    const handleCreateAccount = () => {
      navigate('/Signup')
    }
    return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <label htmlFor="email">Email:</label>
          <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          />
          <label htmlFor="password">Password:</label>
          <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <button type="submit">Login</button>
      </form>
      <div onClick={handleCreateAccount} className="create-account-link">
          <p>Create Account</p>
      </div>
    </div>
    );
};

export default Login;