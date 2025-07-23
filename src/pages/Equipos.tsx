import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Equipo } from '../types';
import { getToken } from '../services/authService'; // ✅ Usa el token real
import './Equipos.css';
import './Partidos.css';

const Equipos: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const isLoggedIn = !!getToken(); // ✅ Verifica si el usuario está logueado

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = () => {
    api.get('/equipos').then(res => setEquipos(res.data.data.items));
  };

  const handleEliminar = async (id: number) => {
    if (confirm("¿Estás seguro que deseas eliminar este equipo?")) {
      try {
        await api.delete(`/equipos/${id}`);
        cargarEquipos();
      } catch (err) {
        alert('Error al eliminar el equipo.');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="jornada-titulo">
        <div className='enlaces'>
          <a className="link" href="/"><span className="span-link">Inicio</span></a>
          <span className='span-link'>&gt;</span>
          <a className="link" href={`/equipos`}><span className="span-link">Equipos</span></a>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Equipos</h2>
      </div>

      {isLoggedIn && (
        <div className='crear-equipo'>
          <button className="btn"
            onClick={() => {
              setEquipoSeleccionado(null); // Crear nuevo
              setMostrarModal(true);
            }}
            style={{ marginBottom: '20px' }}
          >
            Crear Equipo
          </button>
        </div>
      )}

      <div className="equipos-container">
        {equipos.map((e) => (
          <div className="equipo-card bpRpqo" key={e.id}>
            <img src={`/logos/${e.foto}`} alt={e.nombre} />
            <h3>{e.nombre}</h3>
            <p className='equipos-fundacion'>Fundación {e.fundacion}</p>
            <a href={`/equipo/${e.id}`} className="btn">Ver Jugadores</a>

            {isLoggedIn && (
              <div style={{ marginTop: '10px' }}>
                <button className="btn" onClick={() => { setEquipoSeleccionado(e); setMostrarModal(true); }}>
                  Editar
                </button>
                <button className="btn" onClick={() => handleEliminar(e.id)} style={{ marginLeft: '8px' }}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{equipoSeleccionado ? 'Editar equipo' : 'Crear equipo'}</h3>
            <EditarEquipoForm
              equipo={equipoSeleccionado}
              onClose={() => setMostrarModal(false)}
              onSave={() => {
                setMostrarModal(false);
                cargarEquipos();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

type EditarEquipoFormProps = {
  equipo?: Equipo | null;
  onClose: () => void;
  onSave: () => void;
};

const EditarEquipoForm: React.FC<EditarEquipoFormProps> = ({ equipo, onClose, onSave }) => {
  const [nombre, setNombre] = useState(equipo?.nombre || '');
  const [fundacion, setFundacion] = useState(equipo?.fundacion || 0);
  const [foto, setFoto] = useState(equipo?.foto || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (equipo) {
        await api.put(`/equipos/${equipo.id}`, { nombre, fundacion, foto });
      } else {
        await api.post('/equipos', { nombre, fundacion, foto });
      }
      onSave();
    } catch (err) {
      alert(`Error al ${equipo ? 'actualizar' : 'crear'} equipo`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre:
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </label>
      <br />
      <label>Fundación:
        <input type="number" value={fundacion} onChange={(e) => setFundacion(Number(e.target.value))} required />
      </label>
      <br />
      <label>Foto (nombre de archivo):
        <input value={foto} onChange={(e) => setFoto(e.target.value)} required />
      </label>
      <br />
      <div style={{ marginTop: '10px' }}>
        <button type="submit">{equipo ? 'Guardar' : 'Crear'}</button>
        <button type="button" onClick={onClose} style={{ marginLeft: '8px' }}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default Equipos;
