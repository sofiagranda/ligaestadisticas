import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Jugador, Equipo } from '../types';
import './EstadisticasGenerales.css';

const EstadisticasGenerales: React.FC = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filtro, setFiltro] = useState<'goleadores' | 'tarjetasAmarillas' | 'tarjetasRojas'>('goleadores');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [jugadoresRes, equiposRes] = await Promise.all([
          api.get('/jugadores'),
          api.get('/equipos'),
        ]);

        setJugadores(jugadoresRes.data.data.items);
        setEquipos(equiposRes.data.data.items);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchDatos();
  }, []);

  const obtenerEquipo = (equipoId: number) => {
    return equipos.find(e => e.id === equipoId);
  };

  const jugadoresFiltrados = () => {
    const activos = jugadores.filter(j => j.isActive);

    switch (filtro) {
      case 'goleadores':
        return activos.filter(j => j.goles >= 0).sort((a, b) => b.goles - a.goles).slice(0, 10);;
      case 'tarjetasAmarillas':
        return activos
          .filter(j => j.tarjetasAmarillas >= 0)
          .sort((a, b) => b.tarjetasAmarillas - a.tarjetasAmarillas) // ← CORREGIR AQUÍ
          .slice(0, 10);
      case 'tarjetasRojas':
        return activos.
          filter(j => j.tarjetasRojas >= 0)
          .sort((a, b) => b.tarjetasRojas - a.tarjetasRojas)
          .slice(0, 10);;
      default:
        return activos;
    }
  };

  return (
    <div className="estadisticas-generales">
      <div className="jornada-titulo">
        <div className='enlaces'>
          <a className="link" href="/">
            <span className="span-link">Inicio</span>
          </a>
          <span className='span-link'>&gt;</span>
          <a className="link" href="/estadisticas/generales">
            <span className="span-link">Estadísticas Generales</span>
          </a>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Estadísticas Generales</h2>
      </div>

      <div className="filtros mb-4">
        <button
          className={filtro === 'goleadores' ? 'active' : ''}
          onClick={() => setFiltro('goleadores')}
        >
          Goleadores
        </button>
        <button
          className={filtro === 'tarjetasAmarillas' ? 'active' : ''}
          onClick={() => setFiltro('tarjetasAmarillas')}
        >
          Tarjetas amarillas
        </button>
        <button
          className={filtro === 'tarjetasRojas' ? 'active' : ''}
          onClick={() => setFiltro('tarjetasRojas')}
        >
          Tarjetas rojas
        </button>
      </div>

      <table className="tabla-estadisticas">
        <thead>
          <tr>
            <th></th>
            <th>Jugador</th>
            <th>Equipo</th>
            {filtro === 'goleadores' && <>
              <th>Goles</th>
              <th>Partidos</th>
              <th>Promedio</th>
            </>}
            {filtro === 'tarjetasAmarillas' && <th>Tarjetas Amarillas</th>}
            {filtro === 'tarjetasRojas' && <th>Tarjetas Rojas</th>}
          </tr>
        </thead>
        <tbody>
          {jugadoresFiltrados().map((j, i) => {
            const equipo = obtenerEquipo(j.equipoId);
            return (
              <tr key={j.id}>
                <td className="ranking"><span >{i + 1}</span> {/* ← Posición */}</td>
                <td>
                  <div className="jugador-info">
                    <img
                      src={j.foto && j.foto.trim() !== '' ? `/jugadores/${j.foto}` : '/logos/silueta.png'}
                      alt={j.nombre}
                      className="foto-jugador"
                    />
                    {j.nombre} {j.apellido}
                  </div>
                </td>
                <td>
                  <div className="equipo-info">
                    {equipo?.foto && <img src={`/logos/${equipo.foto}`} alt={equipo.nombre} className="logo-equipo" />}
                    {equipo?.nombre || 'Desconocido'}
                  </div>
                </td>

                {filtro === 'goleadores' && (
                  <>
                    <td>{j.goles}</td>
                    <td>{j.partidosJugados}</td>
                    <td>{j.partidosJugados > 0 ? (j.goles / j.partidosJugados).toFixed(2) : '0.00'}</td>
                  </>
                )}

                {filtro === 'tarjetasAmarillas' && <td>{j.tarjetasAmarillas}</td>}
                {filtro === 'tarjetasRojas' && <td>{j.tarjetasRojas}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EstadisticasGenerales;
