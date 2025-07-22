import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import type { Jugador, Equipo, Partido, Posicion, } from '../types';
import '../pages/Partidos.css';
import '../pages/Jugadores.css';

interface ClubTabProps {
  equipoId: number;
  equipos: Equipo[];
  partidos: Partido[];
  jugadores: Jugador[];
  tablaPosiciones: Posicion[];
}

const ClubTab: React.FC<ClubTabProps> = ({ equipoId, equipos, partidos, jugadores, tablaPosiciones }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Próximo partido pendiente para el equipo
  const proximos = partidos
    .filter(p => p.estado === 'pendiente' && (p.equipoLocalId === equipoId || p.equipoVisitanteId === equipoId))
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  const proximoPartido = proximos[0];

  const rivalId = proximoPartido
    ? proximoPartido.equipoLocalId === equipoId
      ? proximoPartido.equipoVisitanteId
      : proximoPartido.equipoLocalId
    : null;

  const rival = equipos.find(e => e.id === rivalId);

  const diff = proximoPartido ? new Date(proximoPartido.fecha).getTime() - now : 0;
  const days = Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0);
  const hours = Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0);
  const minutes = Math.max(Math.floor((diff / (1000 * 60)) % 60), 0);
  const seconds = Math.max(Math.floor((diff / 1000) % 60), 0);

  // Goleadores del equipo (jugadores ordenados por goles, filtrados por equipo)
  const goleadoresEquipo = jugadores
    .filter(j => j.equipoId === equipoId)
    .sort((a, b) => b.goles - a.goles)
    .slice(0, 5);

  // Partidos completados del equipo
  // const partidosJugados = partidos.filter(p => p.estado === 'completo' && (p.equipoLocalId === equipoId || p.equipoVisitanteId === equipoId));

  // Tabla posiciones ordenada por puntos descendente
  const tablaOrdenada = [...tablaPosiciones].sort((a, b) => b.puntos - a.puntos);

  // const getEquipoNombre = (id: number) => equipos.find(e => e.id === id)?.nombre || 'Desconocido';

  const getEquipoFoto = (id: number) => equipos.find(e => e.id === id)?.foto || '';

  return (
    <div
      className="club-tab"
      style={{
        display: 'flex',
        gap: 24,
        justifyContent: 'space-evenly',
        flexWrap: 'wrap', // para que se adapte si hay poco espacio
      }}
    >

      {/* Goleadores */}
      <div className="panel goleadores-panel" style={{ minWidth: 320 }}>
        <h3 className="texto-centro">🏆 Máximos Goleadores</h3>

        {goleadoresEquipo.length === 0 ? (
          <p>No hay goleadores disponibles.</p>
        ) : (
          <div className="top-goleador-box">
            <div className="goleador-principal">
              {/* Buscamos el máximo goleador */}
              {(() => {
                if (!goleadoresEquipo.length) return <p>No hay datos</p>;

                // Encontrar el máximo goleador
                const maxGoleador = goleadoresEquipo.reduce((max, jugador) =>
                  jugador.goles > max.goles ? jugador : max, goleadoresEquipo[0]);

                const equipoJugador = equipos.find(e => e.id === maxGoleador.equipoId);

                return (
                  <>
                    <div className='tablita'>
                      <div className="goles-numero">{maxGoleador.goles}</div>
                      <div className="etiqueta">GOLES</div>
                    </div>

                    <div className="fut-card" key={maxGoleador.id}>
                      <div className="fut-card-bg" />
                      <div className="card-overlay">
                        <div className="card-header">
                          <span className="card-rating">{maxGoleador.edad}</span>
                          <span className="card-position">{maxGoleador.posicion}</span>
                        </div>
                        <div className="card-photo">
                          <img
                            src={maxGoleador.foto && maxGoleador.foto.trim() !== '' ? `/jugadores/${maxGoleador.foto}` : '/logos/silueta.png'}
                            alt={maxGoleador.nombre}
                            className="player-image"
                          />
                        </div>
                        <div className="parte_abajo">
                          <p className="nombre_jugador">{maxGoleador.nombre} {maxGoleador.apellido}</p>
                        </div>
                        <div className="abajo">
                          <img src={`/logos/ecuaddor.png`} alt={maxGoleador.pais} className="card-flag" />
                          <img src={`/logos/logo_liga.png`} alt="Torneo" className="torneo-logo" />
                          {equipoJugador?.foto && (
                            <img src={`/logos/${equipoJugador.foto}`} alt={equipoJugador.nombre} className="team-logo" />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <table className="tabla-goleadores">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Goles</th>
            </tr>
          </thead>
          <tbody>
            {goleadoresEquipo.slice(0, 5).map((j, i) => (
              <tr key={j.id}>
                <td>{String(i + 1).padStart(2, '0')}</td>
                <td>{j.nombre} {j.apellido}</td>
                <td><strong>{j.goles}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
        <a className='texto-club' href="/estadisticas/generales">TODOS LOS LÍDERES EN GOLES</a>
      </div>
      {/* Partidos jugados */}
      <div className="panel goleadores-panel" style={{ minWidth: 320 }}>
        <h3 className="texto-centro">🏆 Partidos Jugados</h3>

        {goleadoresEquipo.length === 0 ? (
          <p>No hay goleadores disponibles.</p>
        ) : (
          <div className="top-goleador-box">
            <div className="goleador-principal">
              {/* Buscamos el máximo goleador */}
              {(() => {
                if (!goleadoresEquipo.length) return <p>No hay datos</p>;

                // Encontrar el máximo goleador
                const maxGoleador = goleadoresEquipo.reduce((max, jugador) =>
                  jugador.partidosJugados > max.partidosJugados ? jugador : max, goleadoresEquipo[0]);

                const equipoJugador = equipos.find(e => e.id === maxGoleador.equipoId);

                return (
                  <>
                    <div className='tablita'>
                      <div className="goles-numero">{maxGoleador.partidosJugados}</div>
                      <div className="etiqueta">Partidos</div>
                    </div>

                    <div className="fut-card" key={maxGoleador.id}>
                      <div className="fut-card-bg" />
                      <div className="card-overlay">
                        <div className="card-header">
                          <span className="card-rating">{maxGoleador.edad}</span>
                          <span className="card-position">{maxGoleador.posicion}</span>
                        </div>
                        <div className="card-photo">
                          <img
                            src={maxGoleador.foto && maxGoleador.foto.trim() !== '' ? `/jugadores/${maxGoleador.foto}` : '/logos/silueta.png'}
                            alt={maxGoleador.nombre}
                            className="player-image"
                          />
                        </div>
                        <div className="parte_abajo">
                          <p className="nombre_jugador">{maxGoleador.nombre} {maxGoleador.apellido}</p>
                        </div>
                        <div className="abajo">
                          <img src={`/logos/ecuaddor.png`} alt={maxGoleador.pais} className="card-flag" />
                          <img src={`/logos/logo_liga.png`} alt="Torneo" className="torneo-logo" />
                          {equipoJugador?.foto && (
                            <img src={`/logos/${equipoJugador.foto}`} alt={equipoJugador.nombre} className="team-logo" />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        <table className="tabla-goleadores">
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>P. JUGADOS</th>
            </tr>
          </thead>
          <tbody>
            {goleadoresEquipo.slice(0, 5).map((j, i) => (
              <tr key={j.id}>
                <td>{String(i + 1).padStart(2, '0')}</td>
                <td>{j.nombre} {j.apellido}</td>
                <td><strong>{j.partidosJugados}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Próximo rival */}
      <div
        className="panel proximo-rival"
        style={{
          flex: 1,
          textAlign: 'center',
          background: '#fff',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
          minWidth: 240,
        }}
      >
        <h3>PRÓXIMO RIVAL</h3>
        {rival ? (
          <>
            <img
              src={`/logos/${getEquipoFoto(rival.id)}`}
              alt={rival.nombre}
              style={{ width: "50%", marginBottom: 12 }}
            />
            <h4 className="nombre-proximo">{rival.nombre}</h4>
            {proximoPartido ? (
              <div className="countdown-container">
                <div className="time-segment">
                  <div className="time-number">{String(days).padStart(2, '0')}</div>
                  <div className="time-label">Days</div>
                </div>
                <div className="time-segment">
                  <div className="time-number">{String(hours).padStart(2, '0')}</div>
                  <div className="time-label">Hours</div>
                </div>
                <div className="time-segment">
                  <div className="time-number">{String(minutes).padStart(2, '0')}</div>
                  <div className="time-label">Minutes</div>
                </div>
                <div className="time-segment">
                  <div className="time-number">{String(seconds).padStart(2, '0')}</div>
                  <div className="time-label">Seconds</div>
                </div>
              </div>
            ) : (
              <p>No hay próximo partido.</p>
            )}
          </>
        ) : null}
      </div>
      {/* Tabla de posiciones */}
      <div
        className="panel"
        style={{
          flex: 1,
          background: '#fff',
          padding: 16,
          borderRadius: 8,
          boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
          minWidth: 240,
        }}
      >
        <h3 className='texto-centro'>Clasificación</h3>
        <table className="tabla-estadisticas" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={{ padding: '6px 8px' }}>P.</th>
              <th style={{ padding: '6px 8px' }}>Club</th>
              <th style={{ padding: '6px 8px' }}>PTS</th>
              <th style={{ padding: '6px 8px' }}>PJ</th>
            </tr>
          </thead>
          <tbody>
            {tablaOrdenada.map((pos, idx) => {
              const equipo = equipos.find(e => e.id === pos.equipoId);
              if (!equipo) return null;
              return (
                <tr
                  key={pos._id}
                  style={{
                    fontWeight: equipo.id === equipoId ? 'bold' : 'normal',
                    backgroundColor: equipo.id === equipoId ? '#f0f8ff' : 'transparent',
                  }}
                >
                  <td style={{ padding: '6px 8px' }}>{idx + 1}</td>
                  <td style={{ padding: '6px 8px' }}>{equipo.nombre}</td>
                  <td style={{ padding: '6px 8px' }}>{pos.puntos}</td>
                  <td style={{ padding: '6px 8px' }}>{pos.partidosJugados}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const JugadoresPorEquipo: React.FC = () => {
  const { equipoId } = useParams<{ equipoId: string }>();
  const [activeTab, setActiveTab] = useState<'CLUB' | 'PLANTILLA' | 'PARTIDOS' | 'RESULTADOS' | 'ESTADISTICAS' | 'FICHAJES'>('PLANTILLA');
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [tablaPosiciones, setTablaPosiciones] = useState<Posicion[]>([]);


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
    const fetchExtras = async () => {
      try {
        const [resPartidos, resTabla] = await Promise.all([
          api.get('/partidos'),
          api.get('/tabla-posiciones')
        ]);
        setPartidos(resPartidos.data);
        setTablaPosiciones(resTabla.data);
      } catch (error) {
        console.error('Error al cargar partidos o tabla:', error);
      }
    };

    fetchExtras();
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
      {activeTab === 'CLUB' && (
        <ClubTab
          equipoId={parseInt(equipoId || '0')}
          equipos={equipos}
          partidos={partidos}
          jugadores={jugadores}
          tablaPosiciones={tablaPosiciones}
        />
      )}

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

  const getLogoEquipo = (id: number) => {
    const equipo = equipos.find((e) => e.id === id);
    return equipo?.foto ?? 'silueta.png'; // Devuelve el nombre del archivo o imagen por defecto
  };


  return (
    <div>
      <h3 className="texto-centro">{estado === 'pendiente' ? '📅 Próximos Partidos' : '📊 Resultados'}</h3>
      {partidos.length === 0 ? (
        <p>No hay partidos disponibles.</p>
      ) : (
        <ul className="lista-partidos">
          {partidos.map((p) => (
            <li className="partido-item" key={p.id}>
              <span className="fecha">{new Date(p.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }).toUpperCase()}</span>
              <span className="hora">{new Date(p.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span>

              <div className="equipos">
                <span className="equipo">
                  <img src={`/logos/${getLogoEquipo(p.equipoLocalId)}`} alt="local" className="logo" />
                  {getNombreEquipo(p.equipoLocalId)}
                </span>
                <span className="vs">
                  {estado === 'completo'
                    ? `${p.golesLocal ?? 0} - ${p.golesVisitante ?? 0}`
                    : 'VS'}
                </span>                <span className="equipo">
                  <img src={`/logos/${getLogoEquipo(p.equipoVisitanteId)}`} alt="visitante" className="logo" />
                  {getNombreEquipo(p.equipoVisitanteId)}
                </span>
              </div>
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
      <h3 className='texto-centro'>📊 Estadísticas del Equipo</h3>
      <table className="tabla-estadisticas">
        <thead>
          <tr>
            <th>Goles a Favor</th>
            <th>Goles en Contra</th>
            <th>Tarjetas Amarillas</th>
            <th>Tarjetas Rojas</th>
          </tr>
        </thead>
        <tbody>
          {estadisticasEquipo ? (
            <tr>
              <td>{estadisticasEquipo.golesFavor}</td>
              <td>{estadisticasEquipo.golesContra}</td>
              <td>{estadisticasEquipo.tarjetasAmarillas}</td>
              <td>{estadisticasEquipo.tarjetasRojas}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={6}>No hay estadísticas para mostrar</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 className='texto-centro'>⚽ Estadísticas de los Jugadores</h3>
      <table className="tabla-estadisticas">
        <thead>
          <tr>
            <th>#</th>
            <th>Jugador</th>
            <th>Goles</th>
            <th>Partidos</th>
            <th>Tarjetas Amarillas</th>
            <th>Tarjetas Rojas</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.length > 0 ? (
            jugadores.map((j) => (
              <tr key={j.id}>
                <td className="ranking"><span>{j.edad}</span></td> {/* Posición */}
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
                <td>{j.goles}</td>
                <td>{j.partidosJugados}</td>
                <td>{j.tarjetasAmarillas}</td>
                <td>{j.tarjetasRojas}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No hay jugadores para mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  );
};