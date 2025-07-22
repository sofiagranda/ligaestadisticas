import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'

const LoginPage = () => {
    const navigate = useNavigate();

    // Estado para inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // ⬅️ del contexto, no del service

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password); // ✅ esto actualiza el context
            navigate('/');
        } catch {
            alert('Credenciales inválidas');
        }
    };
    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2 className="login-form__title">Iniciar Sesión</h2>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario"
                required
                className="login-form__input"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
                className="login-form__input"
            />
            <button type="submit" className="login-form__button">Iniciar sesión</button>
        </form>
    );
};

export default LoginPage;
