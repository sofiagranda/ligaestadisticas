import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import type { Equipo } from '../types';
import api from '../api/api';

const NavbarInferior: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const location = useLocation();

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

  // Cierra el menú al navegar a otra ruta
  useEffect(() => {
    setMostrarMenu(false);
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
        <img src="public/logos/logo_liga.png" alt="LALIGA" className="laliga-logo" />
      </div>
      <div>
        <div className="organizacion organizacion2 fondoarriba">
          <div className="fbIVah">LALIGA Group</div>
          <div className="fbIVah">Fanatics | Store</div>
          <div className="fbIVah">🌐 Español</div>
          <div className="fbIVah text-danger">👤 MILIGA</div>
        </div>
        <div className="organizacion">
          <div className="nav-item">
        <Link
          to="/jugadores"
          className="nav-link"
          onClick={(e) => {
            e.preventDefault(); // evita navegación inmediata
            setMostrarMenu(prev => !prev);
          }}>
          Jugadores 
        </Link>

            {mostrarMenu && (
              <div className="submenu">
                {equipos.map(e => (
                  <Link
                    key={e.id}
                    to={`/jugadores/equipo/${e.id}`}
                    className="submenu-item"
                  >
                    {e.nombre}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div><Link to="/partidos" className="nav-link">Partidos</Link></div>
          <div><Link to="/estadisticas" className="nav-link">Estadísticas</Link></div>
          <div><Link to="/equipos" className="nav-link">Equipos</Link></div>
        </div>
      </div>
    </div>
  );
};

export default NavbarInferior;
