import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Partido }from '../types';

const Partidos: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);

  useEffect(() => {
    api.get('/partidos').then(res => setPartidos(res.data));
  }, []);

  return (
    <div>
      <h2 className="mb-4">Partidos</h2>
      <ul className="list-group">
        {partidos.map(p => (
          <li className="list-group-item" key={p.id}>
            <strong>{p.equipoLocal} {p.golesLocal} - {p.golesVisitante} {p.equipoVisitante}</strong><br />
            Fecha: {new Date(p.fecha).toLocaleDateString()} - Estado: {p.estado}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Partidos;
