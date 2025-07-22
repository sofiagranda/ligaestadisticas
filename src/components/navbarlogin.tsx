import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './navbarlogin.css'

const NavbarLogin: React.FC = () => {
  const { username } = useAuth();

  if (!username) return null; // No mostrar si no está logueado

  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li><Link to="/jugadores">Jugadores</Link></li>
        <li><Link to="/equipos">Equipos</Link></li>
        <li><Link to="/partidos">Partidos</Link></li>
        <li className="navbar__user">Hola, {username}</li>
      </ul>
    </nav>
  );
};

export default NavbarLogin;
