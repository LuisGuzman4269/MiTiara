import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [dateOfBirth, setDateOfBirth] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Handle login logic here
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Date of Birth:', dateOfBirth);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
                <h2>Sign Up</h2>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
                />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
                />
                <label htmlFor="firstName">First Name:</label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
                />
                <label htmlFor="lastName">Last Name:</label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
                />
                <label htmlFor="dateOfBirth">Date of Birth:</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    style={{ marginBottom: '20px', padding: '8px', fontSize: '16px' }}
                />
                <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#000000', color: '#FFFFFF' }}>Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;