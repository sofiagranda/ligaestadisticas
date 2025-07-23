import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Partido, Equipo } from '../types';
import EditarVocaliaModal from '../components/EditarVocaliaModal';
import './Partidos.css';
import { getToken } from '../services/authService';

const getStartOfWeek = (date: Date) => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

const formatWeek = (startOfWeek: Date) => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
};

const Partidos: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [equipos, setEquipos] = useState<{ [key: number]: Equipo }>({});
  const [partidoSeleccionado, setPartidoSeleccionado] = useState<Partido | null>(null);
  const [vocaliaPartidoId, setVocaliaPartidoId] = useState<number | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarVocaliaModal, setMostrarVocaliaModal] = useState(false);
  const [mostrarCrearModal, setMostrarCrearModal] = useState(false);
  const [nuevoPartido, setNuevoPartido] = useState<Partial<Partido>>({
    fecha: new Date(),
    equipoLocalId: undefined,
    equipoVisitanteId: undefined,
    golesLocal: 0,
    golesVisitante: 0,
    estado: 'pendiente',
  });

  const isLoggedIn = !!getToken();// ⚠️ Reemplazar con lógica real de autenticación

  useEffect(() => {
    api.get('/partidos').then(res => {
      setPartidos(res.data);
      api.get('/equipos').then(response => {
        const equiposData = response.data.data.items;
        const equiposMap = equiposData.reduce((acc: { [key: number]: Equipo }, equipo: Equipo) => {
          acc[equipo.id] = equipo;
          return acc;
        }, {});
        setEquipos(equiposMap);
      });
    });
  }, []);

  const cargarPartidos = async () => {
    const res = await api.get('/partidos');
    setPartidos(res.data);
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este partido y su vocalía?')) {
      try {
        await api.delete(`/partidos/${id}`);
        cargarPartidos();
      } catch (error) {
        alert('Error al eliminar el partido');
      }
    }
  };

  const handleCrearPartido = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar equipos distintos
    if (nuevoPartido.equipoLocalId === nuevoPartido.equipoVisitanteId) {
      alert('El equipo local y visitante deben ser diferentes.');
      return;
    }

    if (!nuevoPartido.equipoLocalId || !nuevoPartido.equipoVisitanteId || !nuevoPartido.fecha) {
      alert('Completa todos los campos.');
      return;
    }

    try {
      await api.post('/partidos', {
        fecha: nuevoPartido.fecha,
        equipoLocalId: nuevoPartido.equipoLocalId,
        equipoVisitanteId: nuevoPartido.equipoVisitanteId,
        golesLocal: nuevoPartido.golesLocal ?? 0,
        golesVisitante: nuevoPartido.golesVisitante ?? 0,
        estado: nuevoPartido.estado ?? 'pendiente',
      });
      setMostrarCrearModal(false);
      setNuevoPartido({
        fecha: new Date(),
        equipoLocalId: undefined,
        equipoVisitanteId: undefined,
        golesLocal: 0,
        golesVisitante: 0,
        estado: 'pendiente',
      });
      cargarPartidos();
    } catch {
      alert('Error al crear el partido');
    }
  };

  const partidosPorSemana = partidos.reduce((acc, partido) => {
    const startOfWeek = getStartOfWeek(new Date(partido.fecha));
    const weekLabel = formatWeek(startOfWeek);
    if (!acc[weekLabel]) acc[weekLabel] = [];
    acc[weekLabel].push(partido);
    return acc;
  }, {} as { [key: string]: Partido[] });

  return (
    <div>
      <div className="jornada-titulo">
        <div className="enlaces">
          <a className="link" href="/"><span className="span-link">Inicio</span></a>
          <span className="span-link">&gt;</span>
          <a className="link" href="/partidos"><span className="span-link">Calendario</span></a>
        </div>
        <h2 className='text-center'>Calendario de Partidos</h2>
      </div>
      {isLoggedIn && (
        <div className='crear-partido'>
          <button
            className="btn"
            style={{ marginTop: '10px' }}
            onClick={() => setMostrarCrearModal(true)}
          >
            Crear Partido
          </button>
        </div>
      )}

      <div className="jornadas-grid">
        {Object.keys(partidosPorSemana).map(semana => (
          <div className="jornada" key={semana}>
            <h3 className="jornada-subtitulo">{semana}</h3>
            <div className="partidos">
              {partidosPorSemana[semana].map(partido => {
                const equipoLocal = equipos[partido.equipoLocalId];
                const equipoVisitante = equipos[partido.equipoVisitanteId];
                if (!equipoLocal || !equipoVisitante) return null;

                return (
                  <div key={partido.id}>
                    <div className="partido">
                      <div className="equipo equipo-local">
                        <span>{equipoLocal.nombre}</span>
                        <img src={`/logos/${equipoLocal.foto}`} alt={equipoLocal.nombre} />
                      </div>

                      <div className="vs">
                        {partido.estado === 'pendiente'
                          ? 'vs'
                          : `${partido.golesLocal} - ${partido.golesVisitante}`}
                      </div>

                      <div className="equipo equipo-visitante">
                        <img src={`/logos/${equipoVisitante.foto}`} alt={equipoVisitante.nombre} />
                        <span>{equipoVisitante.nombre}</span>
                      </div>

                      {isLoggedIn && (
                        <div className="acciones-partido" style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                          <button className="btn" onClick={() => {
                            setPartidoSeleccionado(partido);
                            setMostrarModal(true);
                          }}>
                            Editar
                          </button>
                          <button className="btn" onClick={() => handleEliminar(partido.id)}>
                            Eliminar
                          </button>
                          <button className="btn" onClick={() => {
                            setVocaliaPartidoId(partido.id);
                            setMostrarVocaliaModal(true);
                          }}>
                            Editar Vocalía
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && partidoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Partido</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.put(`/partidos/${partidoSeleccionado.id}`, partidoSeleccionado);
                setMostrarModal(false);
                cargarPartidos();
              } catch (err) {
                alert('Error al actualizar partido');
              }
            }}>
              <label>Fecha:
                <input
                  type="datetime-local"
                  value={new Date(partidoSeleccionado.fecha).toISOString().slice(0, 16)}
                  onChange={(e) => setPartidoSeleccionado({ ...partidoSeleccionado, fecha: new Date(e.target.value) })}
                  required
                />
              </label>
              <br />
              <label>Goles Local:
                <input
                  type="number"
                  value={partidoSeleccionado.golesLocal}
                  onChange={(e) => setPartidoSeleccionado({ ...partidoSeleccionado, golesLocal: Number(e.target.value) })}
                />
              </label>
              <br />
              <label>Goles Visitante:
                <input
                  type="number"
                  value={partidoSeleccionado.golesVisitante}
                  onChange={(e) => setPartidoSeleccionado({ ...partidoSeleccionado, golesVisitante: Number(e.target.value) })}
                />
              </label>
              <br />
              <label>Estado:
                <select
                  value={partidoSeleccionado.estado}
                  onChange={(e) => setPartidoSeleccionado({ ...partidoSeleccionado, estado: e.target.value as 'pendiente' | 'completo' })}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completo">Completo</option>
                </select>
              </label>
              <br />
              <div style={{ marginTop: '10px' }}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setMostrarModal(false)} style={{ marginLeft: '8px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Modal crear */}
      {mostrarCrearModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Crear Partido</h3>
            <form onSubmit={handleCrearPartido}>
              <label>Fecha:
                <input
                  type="datetime-local"
                  value={new Date(nuevoPartido.fecha!).toISOString().slice(0, 16)}
                  onChange={(e) => setNuevoPartido({ ...nuevoPartido, fecha: new Date(e.target.value) })}
                  required
                />
              </label>
              <br />
              <label>Equipo Local:
                <select
                  value={nuevoPartido.equipoLocalId ?? ''}
                  onChange={(e) => setNuevoPartido({ ...nuevoPartido, equipoLocalId: Number(e.target.value) })}
                  required
                >
                  <option value="" disabled>Selecciona equipo local</option>
                  {Object.values(equipos).map(equipo => (
                    <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>Equipo Visitante:
                <select
                  value={nuevoPartido.equipoVisitanteId ?? ''}
                  onChange={(e) => setNuevoPartido({ ...nuevoPartido, equipoVisitanteId: Number(e.target.value) })}
                  required
                >
                  <option value="" disabled>Selecciona equipo visitante</option>
                  {Object.values(equipos).map(equipo => (
                    <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                  ))}
                </select>
              </label>
              <br />
              <label>Goles Local:
                <input
                  type="number"
                  value={nuevoPartido.golesLocal ?? 0}
                  onChange={(e) => setNuevoPartido({ ...nuevoPartido, golesLocal: Number(e.target.value) })}
                />
              </label>
              <br />
              <label>Goles Visitante:
                <input
                  type="number"
                  value={nuevoPartido.golesVisitante ?? 0}
                  onChange={(e) => setNuevoPartido({ ...nuevoPartido, golesVisitante: Number(e.target.value) })}
                />
              </label>
              <br />
              <label>Estado:
                <select
                  value={nuevoPartido.estado ?? 'pendiente'}
                  onChange={(e) => setNuevoPartido({ ...nuevoPartido, estado: e.target.value as 'pendiente' | 'completo' })}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completo">Completo</option>
                </select>
              </label>
              <br />
              <div style={{ marginTop: '10px' }}>
                <button type="submit">Crear</button>
                <button type="button" onClick={() => setMostrarCrearModal(false)} style={{ marginLeft: '8px' }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mostrarVocaliaModal && vocaliaPartidoId !== null && (
        <EditarVocaliaModal
          partidoId={vocaliaPartidoId}
          onClose={() => setMostrarVocaliaModal(false)}
        />
      )}
    </div>
  );
};

export default Partidos;
