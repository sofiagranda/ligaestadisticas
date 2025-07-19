import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import type { Jugador, Equipo } from '../types';
import '../pages/Partidos.css';
import '../pages/Jugadores.css';


const JugadoresPorEquipo: React.FC = () => {
  const { equipoId } = useParams<{ equipoId: string }>();
  const [activeTab, setActiveTab] = useState<'CLUB' | 'PLANTILLA' | 'PARTIDOS' | 'RESULTADOS' | 'ESTADISTICAS' | 'FICHAJES'>('PLANTILLA');

  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);

  const posicionesOrdenadas = ['ARQ', 'DEF', 'MC', 'DEL'];

  // Cargar datos de equipo y plantilla
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resEquipos, resJugadores, resEquipo] = await Promise.all([
          api.get('/equipos'),
          api.get('/jugadores'),
          api.get(`/equipos/${equipoId}`)
        ]);

        setEquipos(resEquipos.data.data.items);
        const todos = resJugadores.data.data.items;
        setJugadores(todos.filter((j: Jugador) => j.equipoId === parseInt(equipoId || '0')));
        setEquipo(resEquipo.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [equipoId]);

  return (
    <div>
      {/* Breadcrumb y encabezado */}
      <div className="jornada-titulo">
        <div className="enlaces">
          <a className="link" href="/"><span className="span-link">Inicio</span></a>
          <span className="span-link">&gt;</span>
          <a className="link" href={`/equipos`}><span className="span-link">Equipos</span></a>
          <span className="span-link">&gt;</span>
          <a className="link" href={`/equipo/${equipoId}`}><span className="span-link">{equipo?.nombre}</span></a>
        </div>

        <div className="logo-banner">
          <img src={`/logos/${equipo?.foto}`} alt={equipo?.nombre} />
          <div>
            <h2 className="mb-4">{equipo?.nombre}</h2>
            <h6 className="mb-4 fundacion">Año de Fundación</h6>
            <h6 className="mb-4 fundacion">{equipo?.fundacion}</h6>
          </div>
        </div>
      </div>

      {/* Menú de pestañas */}
      <div className="menu-tabs">
        {['CLUB', 'PLANTILLA', 'PARTIDOS', 'RESULTADOS', 'ESTADISTICAS'].map(tab => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab === 'PARTIDOS' ? 'PRÓXIMOS PARTIDOS' : tab}
          </div>
        ))}
      </div>

      {/* Contenido por pestaña */}
      {activeTab === 'CLUB' && <div><p>Información del club próximamente...</p></div>}

      {activeTab === 'PLANTILLA' && (
        <>
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
                    const equipoJugador = equipos.find(e => e.id === j.equipoId);

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
                              <img src={`/logos/ecuaddor.png`} alt={j.pais} className="card-flag" />
                              <img src={`/logos/logo_liga.png`} alt="Torneo" className="torneo-logo" />
                              {equipoJugador?.foto && (
                                <img src={`/logos/${equipoJugador.foto}`} alt={equipoJugador.nombre} className="team-logo" />
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
        </>
      )}

      {activeTab === 'PARTIDOS' && (
        <PartidosPorEstado equipoId={equipoId} estado="pendiente" equipos={equipos} />
      )}
      {activeTab === 'RESULTADOS' && (
        <PartidosPorEstado equipoId={equipoId} estado="completo" equipos={equipos} />
      )}
      {activeTab === 'ESTADISTICAS' && <EstadisticasEquipoYJugadores equipoId={equipoId} />}
      {activeTab === 'FICHAJES' && <p>Sección de fichajes próximamente...</p>}
    </div>
  );
};

export default JugadoresPorEquipo;

//
// COMPONENTE: PartidosPorEstado
//
interface PartidosPorEstadoProps {
  equipoId?: string;
  estado: string;
  equipos: Equipo[];
}

const PartidosPorEstado: React.FC<PartidosPorEstadoProps> = ({ equipoId, estado, equipos }) => {
  const [partidos, setPartidos] = useState<any[]>([]);

  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const res = await api.get('/partidos');
        const todos = res.data;
        const filtrados = todos.filter(
          (p: any) =>
            (p.equipoLocalId === Number(equipoId) || p.equipoVisitanteId === Number(equipoId)) &&
            p.estado === estado
        );
        console.log('Filtrados completos:', filtrados);
        setPartidos(filtrados);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPartidos();
  }, [equipoId, estado]);

  const getNombreEquipo = (id: number) => {
    const equipo = equipos.find((e) => e.id === id);
    return equipo ? equipo.nombre : 'Desconocido';
  };

  return (
    <div>
      <h3>{estado === 'pendiente' ? 'Próximos Partidos' : 'Resultados'}</h3>
      {partidos.length === 0 ? (
        <p>No hay partidos disponibles.</p>
      ) : (
        <ul>
          {partidos.map((p) => (
            <li key={p.id}>
              {getNombreEquipo(p.equipoLocalId)} vs {getNombreEquipo(p.equipoVisitanteId)} - {new Date(p.fecha).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

//
// COMPONENTE: EstadisticasEquipoYJugadores
//
interface Props {
  equipoId?: string;
}
const EstadisticasEquipoYJugadores: React.FC<Props> = ({ equipoId }) => {
  const [estadisticasEquipo, setEstadisticasEquipo] = useState<any | null>(null);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cargar TODAS las estadísticas de equipos
        const resEstadisticas = await api.get('/estadisticas');
        const todasEstadisticas = resEstadisticas.data.data.items;

        // Filtrar por el equipo actual
        const equipoStats = todasEstadisticas.find((e: any) => e.equipoId === parseInt(equipoId || '0'));
        setEstadisticasEquipo(equipoStats || null);

        // 2. Cargar jugadores del equipo (con estadísticas incluidas)
        const resJugadores = await api.get('/jugadores');
        const todos = resJugadores.data.data.items;
        const filtrados = todos.filter((j: Jugador) => j.equipoId === parseInt(equipoId || '0'));
        setJugadores(filtrados);
      } catch (err) {
        console.error('Error cargando estadísticas:', err);
      }
    };

    fetchData();
  }, [equipoId]);

  return (
    <div>
      <h3>📊 Estadísticas del Equipo</h3>
      {estadisticasEquipo ? (
        <ul>
          {Object.entries(estadisticasEquipo).map(([key, value]) => (
            <li key={key}><strong>{key}:</strong> {String(value)}</li>
          ))}
        </ul>
      ) : (
        <p>No hay estadísticas del equipo.</p>
      )}

      <h3>👥 Estadísticas de los Jugadores</h3>
      {jugadores.length > 0 ? (
        jugadores.map(j => (
          <div key={j.id} style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #ccc' }}>
            <strong>{j.nombre} {j.apellido}</strong>
            <ul>
              <li>Goles: {j.goles}</li>
              <li>Partidos Jugados: {j.partidosJugados}</li>
              <li>Tarjetas Amarillas: {j.tarjetasAmarillas}</li>
              <li>Tarjetas Rojas: {j.tarjetasRojas}</li>
            </ul>
          </div>
        ))
      ) : (
        <p>No hay jugadores con estadísticas.</p>
      )}
    </div>
  );
};
