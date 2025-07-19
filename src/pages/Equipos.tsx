import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Equipo } from '../types';
import './Equipos.css';
import './Partidos.css'

const Equipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  useEffect(() => {
    api.get('/equipos').then(res => setEquipos(res.data.data.items));
  }, []);

  // Componente para mostrar el logo
  const LogoEquipo = ({ foto }: { foto: string }) => {
    const imageUrl = `/logos/${foto}`; // Ruta pública de la imagen
    return <img src={imageUrl} alt="Logo del equipo" />;
  };

  return (
    <div className="p-4">
      <div className="jornada-titulo">
        <div className='enlaces'>
          <a className="link" href="/">
            <span className="span-link">Inicio</span>
          </a>
          <span className='span-link'>&gt;</span>
          <a className="link" href={`/equipos`}>
            <span className="span-link">Equipos</span>
          </a>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Equipos</h2>
      </div>
      <div className="equipos-container">
        {equipos.map((e) => (
          <div className="equipo-card bpRpqo" key={e.id}>
            <LogoEquipo foto={e.foto} /> {/* Aquí pasamos el nombre del archivo */}
            <h3 >{e.nombre}</h3>
            <p className='equipos'>Fundación {e.fundacion}</p>
            <a href={`/equipo/${e.id}`} className="btn">
              Ver Jugadores
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipos;
