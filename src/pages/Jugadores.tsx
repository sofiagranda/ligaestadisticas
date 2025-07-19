import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Jugador, Equipo } from '../types';
import './Jugadores.css';

const Jugadores: React.FC = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await api.get('/equipos');
        setEquipos(res.data.data.items);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchJugadores = async () => {
      try {
        const res = await api.get('/jugadores');
        setJugadores(res.data.data.items);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEquipos();
    fetchJugadores();
  }, []);

  const posicionesOrdenadas = ['ARQ', 'DEF', 'MC', 'DEL'];

  return (
    <div>
      <h2 className="mb-4">Plantilla Oficial</h2>

      {posicionesOrdenadas.map(pos => {
        const jugadoresFiltrados = jugadores.filter(j => j.posicion === pos);

        if (jugadoresFiltrados.length === 0) return null;

        return (
          <div key={pos}>
            <h3 className="pos-title lmgZEJ">
              {pos === 'ARQ' ? 'Arqueros' :
                pos === 'DEF' ? 'Defensas' :
                  pos === 'MC' ? 'Mediocampistas' :
                    'Delanteros'}
            </h3>

            <div className="jugadores-container">
              {jugadoresFiltrados.map(j => {
                const equipo = equipos.find(e => e.id === j.equipoId);

                return (
                  <div className="fut-card" key={j.id}>
                    <div className="fut-card-bg" />
                    <div className="card-overlay">
                      <div className="card-header">
                        <span className="card-rating">{j.edad}</span>
                        <span className="card-position">{j.posicion}</span>
                      </div>
                      <div className="card-photo">
                        <img
                          src={j.foto && j.foto.trim() !== '' ? `/jugadores/${j.foto}` : '/logos/silueta.png'}
                          alt={j.nombre}
                          className="player-image"
                        />
                      </div>
                      <div className="parte_abajo">
                        <div>
                          <p className="nombre_jugador">{j.nombre} {j.apellido}</p>
                        </div>
                        <div className="abajo">
                          <img
                            src={`/logos/ecuaddor.png`}
                            alt={j.pais}
                            className="card-flag"
                          />
                          <img
                            src={`/logos/logo_liga.png`}
                            alt="Torneo"
                            className="torneo-logo"
                          />
                          {equipo?.foto && (
                            <img
                              src={`/logos/${equipo.foto}`}
                              alt={equipo.nombre}
                              className="team-logo"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Jugadores;
