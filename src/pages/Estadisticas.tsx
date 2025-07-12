import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Jugador } from '../types';

const JugadoresConEstadisticas: React.FC = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);

  useEffect(() => {
    api.get('/jugadores').then((res) => {
      setJugadores(res.data.data.items); // Asumiendo paginado
    });
  }, []);

  return (
    <div>
      <h2 className="mb-4">Jugadores y sus Estadísticas</h2>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>No</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Posición</th>
            <th>Goles</th>
            <th>Partidos Jugados</th>
            <th>Tarjetas Amarillas</th>
            <th>Tarjetas Rojas</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((jugador) => (
            <tr key={jugador.id}>
              <td>{jugador.edad}</td>
              <td>{jugador.nombre}</td>
              <td>{jugador.apellido}</td>
              <td>{jugador.posicion}</td>
              <td>{jugador.goles}</td>
              <td>{jugador.partidosJugados}</td>
              <td>{jugador.tarjetasAmarillas}</td>
              <td>{jugador.tarjetasRojas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JugadoresConEstadisticas;
