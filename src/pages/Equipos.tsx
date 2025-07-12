import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Equipo } from '../types';
import './Equipos.css';

const Equipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  useEffect(() => {
    api.get('/equipos').then(res => setEquipos(res.data.data.items));
  }, []);

  // Componente para mostrar el logo
  const LogoEquipo = ({ foto }: { foto: string }) => {
    const imageUrl = `https://estadisticas-api.desarrollo-software.xyz/public/logos/${foto}`; // Ruta pública de la imagen
    return <img src={imageUrl} alt="Logo del equipo" />;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Equipos</h2>
      <div className="equipos-container">
        {equipos.map((e) => (
          <div className="equipo-card bpRpqo" key={e.id}>
            <LogoEquipo foto={e.foto} /> {/* Aquí pasamos el nombre del archivo */}
            <h3 >{e.nombre}</h3>
            <p className='equipos'>Fundación {e.fundacion}</p>
            <a href={`/jugadores/equipo/${e.id}`} className="btn">
              Ver Jugadores
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipos;
