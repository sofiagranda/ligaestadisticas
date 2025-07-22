import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Jugador, Equipo } from '../types';
import { useAuth } from '../context/AuthContext';  // importar useAuth
import './Jugadores.css';
import './modal.css'

// Componente tarjeta jugador
const JugadorCard: React.FC<{
  j: Jugador;
  equipo?: Equipo;
  onEdit: (jugador: Jugador) => void;  // Cambiado para recibir objeto completo
  onDelete: (id: number) => void;
}> = ({ j, equipo, onEdit, onDelete }) => {
  const { username } = useAuth();

  return (
    <div className="fut-card" key={j.id}>
      <div className="fut-card-bg" />
      <div className="card-overlay">
        <div className="card-header">
          <span className="card-rating">{j.edad}</span>
          <span className="card-position">{j.posicion}</span>

          {/* Botones solo si hay usuario logueado */}
          {username && (
            <div className="card-actions">
              <button
                className="btn-edit"
                onClick={() => onEdit(j)}  // Aquí paso el jugador completo
                title="Editar jugador"
              >
                ✏️
              </button>
              <button
                className="btn-delete"
                onClick={() => onDelete(j.id)}
                title="Eliminar jugador"
              >
                ❌
              </button>
            </div>
          )}
        </div>

        <div className="card-photo">
          <img
            src={
              j.foto && j.foto.trim() !== ''
                ? `/jugadores/${j.foto}`
                : '/logos/silueta.png'
            }
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
};

const Jugadores: React.FC = () => {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [modalJugador, setModalJugador] = useState<Jugador | null>(null);
  const [modalNuevoJugador, setModalNuevoJugador] = useState(false);
  const { username } = useAuth();
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroEquipoId, setFiltroEquipoId] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: 0,
    posicion: '',
    equipoId: '',
    pais: 'ecuador.png'
  });

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

  const createJugador = async (data: typeof formData) => {
    try {
      const res = await api.post('/jugadores', {
        nombre: data.nombre,
        apellido: data.apellido,
        edad: data.edad,
        posicion: data.posicion,
        equipoId: parseInt(data.equipoId),
        pais: data.pais
        // otros campos si tienes
      });
      return res.data.data; // o la estructura que tu API retorne con el nuevo jugador
    } catch (error: any) {
      console.error('Error creando jugador:', error.response?.data || error.message);

      if (error.response?.data?.message) {
        console.error('Detalles del error:', error.response.data.message);
        alert('Error al crear jugador:\n' + error.response.data.message.join('\n'));
      } else {
        alert('Error al crear jugador. Intenta de nuevo.');
      }
      return null;
    }
  };


  const updateJugador = async (id: number, data: typeof formData) => {
    try {
      await api.put(`/jugadores/${id}`, {
        nombre: data.nombre,
        apellido: data.apellido,
        edad: data.edad,
        posicion: data.posicion,
        equipoId: parseInt(data.equipoId),
        // si tienes más campos, los agregas acá
      });
    } catch (error) {
      console.error('Error actualizando jugador:', error);
      alert('Error al actualizar jugador. Intenta de nuevo.');
    }
  };

  const deleteJugador = async (id: number) => {
    try {
      await api.delete(`/jugadores/${id}`);
      setJugadores(prev => prev.filter(j => j.id !== id));
    } catch (error) {
      console.error('Error eliminando jugador:', error);
      alert('Error al eliminar el jugador. Intenta de nuevo.');
    }
  };


  // Funciones para editar y eliminar
  const handleEdit = (jugador: Jugador) => {
    setModalJugador(jugador);
    setFormData({
      nombre: jugador.nombre,
      apellido: jugador.apellido,
      edad: jugador.edad,
      posicion: jugador.posicion,
      equipoId: jugador.equipoId.toString(), // para usar como string en <select>
      pais: 'ecuador'
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Seguro que quieres eliminar este jugador?')) {
      deleteJugador(id);
    }
  };

  const jugadoresFiltradosGlobal = jugadores.filter(j => {
    const nombreCompleto = `${j.nombre} ${j.apellido}`.toLowerCase();
    const coincideNombre = nombreCompleto.includes(filtroNombre.toLowerCase());
    const coincideEquipo = filtroEquipoId === '' || j.equipoId === parseInt(filtroEquipoId);
    return coincideNombre && coincideEquipo;
  });


  return (
    <div>
      {username && (
        <button
          onClick={() => {
            setModalNuevoJugador(true);
            setFormData({
              nombre: '',
              apellido: '',
              edad: 0,
              posicion: '',
              equipoId: '',
              pais: 'ecuador.png'
            });
          }}
          className="btn-nuevo-jugador"
        >
          + Nuevo Jugador
        </button>
      )}
      <div className="filtros-container">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="filtro-input"
        />

        <select
          value={filtroEquipoId}
          onChange={(e) => setFiltroEquipoId(e.target.value)}
          className="filtro-select"
        >
          <option value="">Todos los equipos</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id.toString()}>
              {eq.nombre}
            </option>
          ))}
        </select>
      </div>


      {posicionesOrdenadas.map(pos => {
        const jugadoresFiltrados = jugadoresFiltradosGlobal.filter(j => j.posicion === pos);
        if (jugadoresFiltrados.length === 0) return null;

        return (
          <div key={pos}>
            <h3 className='pos-title lmgZEJ'>{pos}</h3>
            <div className="jugadores-container">
              {jugadoresFiltrados.map(j => {
                const equipo = equipos.find(e => e.id === j.equipoId);
                return (
                  <JugadorCard
                    key={j.id}
                    j={j}
                    equipo={equipo}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Modal de edición */}
      {modalJugador && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Jugador</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (!modalJugador) return;

                // 1. Actualizar en backend
                await updateJugador(modalJugador.id, formData);

                // 2. Actualizar estado local (para que la UI se actualice)
                setJugadores((prev) =>
                  prev.map((j) =>
                    j.id === modalJugador.id
                      ? { ...j, ...formData, equipoId: parseInt(formData.equipoId) }
                      : j
                  )
                );

                // 3. Cerrar modal
                setModalJugador(null);
              }}
            >

              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre"
                required
              />

              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Apellido"
                required
              />

              <input
                type="number"
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: Number(e.target.value) })}
                placeholder="Edad"
                required
              />

              <select
                value={formData.posicion}
                onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
                required
              >
                <option value="">Selecciona posición</option>
                <option value="ARQ">ARQ</option>
                <option value="DEF">DEF</option>
                <option value="MC">MC</option>
                <option value="DEL">DEL</option>
              </select>

              <select
                value={formData.equipoId}
                onChange={(e) => setFormData({ ...formData, equipoId: e.target.value })}
                required
              >
                <option value="">Selecciona equipo</option>
                {equipos.map((eq) => (
                  <option key={eq.id} value={eq.id.toString()}>
                    {eq.nombre}
                  </option>
                ))}
              </select>

              {/* Imagen actual */}
              <div className="preview-foto">
                <img
                  src={
                    modalJugador.foto && modalJugador.foto.trim() !== ''
                      ? `/jugadores/${modalJugador.foto}`
                      : '/logos/silueta.png'
                  }
                  alt="Jugador"
                  width={100}
                />
              </div>

              <div className="modal-actions">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setModalJugador(null)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalNuevoJugador && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Crear Nuevo Jugador</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const nuevoJugador = await createJugador(formData);
                if (nuevoJugador) {
                  setJugadores((prev) => [...prev, nuevoJugador]);
                  setModalNuevoJugador(false);
                }
              }}
            >
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre"
                required
              />

              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Apellido"
                required
              />

              <input
                type="number"
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: Number(e.target.value) })}
                placeholder="Edad"
                required
              />

              <select
                value={formData.posicion}
                onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
                required
              >
                <option value="">Selecciona posición</option>
                <option value="ARQ">ARQ</option>
                <option value="DEF">DEF</option>
                <option value="MC">MC</option>
                <option value="DEL">DEL</option>
              </select>

              <select
                value={formData.equipoId}
                onChange={(e) => setFormData({ ...formData, equipoId: e.target.value })}
                required
              >
                <option value="">Selecciona equipo</option>
                {equipos.map((eq) => (
                  <option key={eq.id} value={eq.id.toString()}>
                    {eq.nombre}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="submit">Crear</button>
                <button type="button" onClick={() => setModalNuevoJugador(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Jugadores;
