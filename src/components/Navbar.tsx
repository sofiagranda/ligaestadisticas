// src/components/NavbarInferior.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import type { Equipo } from '../types';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NavbarInferior: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [mostrarMenuJugadores, setMostrarMenuJugadores] = useState(false);
  const [mostrarMenuEstadisticas, setMostrarMenuEstadisticas] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { username, logout } = useAuth();

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await api.get('/equipos');
        setEquipos(res.data.data.items);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEquipos();
  }, []);

  // Cierra los menús al cambiar ruta
  useEffect(() => {
    setMostrarMenuJugadores(false);
    setMostrarMenuEstadisticas(false);
  }, [location]);

  return (
    <div className="navbar-inferior px-4 py-2 d-flex align-items-center justify-content-between">
      <div>
        <div className="organizacion fondoarriba">
          <div className="fbIVah">LALIGA Institucional</div>
          <div className="fbIVah">LALIGA con el deporte</div>
          <div className="fbIVah">Dónde ver LALIGA</div>
        </div>
        <div className="organizacion">
          <span className="fw-bold">LALIGA HYPERMOTION</span>
          <span className="fw-bold">Fútbol Femenino</span>
          <span className="fw-bold">LALIGA GENUINE</span>
        </div>
      </div>

      <div className="img align-items-center gap-4">
        <Link to="/">
          <img src="/logos/logo_liga.png" alt="LALIGA" className="laliga-logo" />
        </Link>
      </div>

      <div>
        <div className="organizacion organizacion2 fondoarriba">
          <div className="fbIVah">LALIGA Group</div>
          <div className="fbIVah">Fanatics | Store</div>
          <div className="fbIVah">🌐 Español</div>

          <div
            className="fbIVah text-danger"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: !username ? 'pointer' : 'default' }}
            onClick={() => {
              if (!username) navigate('/login');
            }}
          >
            👤 {username ?? 'MILIGA'}
            {username && (
              <button
                onClick={logout}
                style={{
                  background: 'transparent',
                  border: '1px solid white',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Salir
              </button>
            )}
          </div>
        </div>

        <div className="organizacion">
          <div className="nav-item">
            <Link
              to="https://www.flickr.com/photos/200804046@N04/albums/"
              className="nav-link"
            >
              Fotografias
            </Link>
          </div>
          <div>
            <Link to="/partidos" className="nav-link">
              Partidos
            </Link>
          </div>

          <div className="nav-item">
            <Link
              to="/estadisticas"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                setMostrarMenuEstadisticas((prev) => !prev);
                setMostrarMenuJugadores(false);
              }}
            >
              Estadísticas
            </Link>

            {mostrarMenuEstadisticas && (
              <div className="submenu-2">
                <Link to="/estadisticas/generales" className="submenu-item">
                  Generales
                </Link>
                <Link to="/estadisticas/equipos" className="submenu-item">
                  Equipos
                </Link>
                <Link to="/estadisticas/tablaposiciones" className="submenu-item">
                  Tabla de Posiciones
                </Link>
              </div>
            )}
          </div>

          <div>
            <Link to="/equipos" className="nav-link">
              Equipos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarInferior;
