import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbarlogin.css';

const NavbarLogin: React.FC = () => {
  const { username } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false); // estado para toggle

  if (!username) return null; // No mostrar si no está logueado

  return (
    <nav className="navbar">
      <button className="navbar__toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      <ul className={`navbar__list ${menuOpen ? 'show' : ''}`}>
        <li><Link to="/jugadores">Jugadores</Link></li>
        <li><Link to="/equipos">Equipos</Link></li>
        <li><Link to="/partidos">Partidos</Link></li>
        <li className="navbar__user">Hola, {username}</li>
      </ul>
    </nav>
  );
};

export default NavbarLogin;
