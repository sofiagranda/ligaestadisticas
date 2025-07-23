import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Jugador, Vocalia, Equipo } from '../types';
import './modal vocali.css'; // asegúrate de tener estilos para .modal, .form-group, etc.
// import Partidos from '../pages/Partidos';

type NominaConGoles = {
    jugadorId: number;
    equipoId: number;
    jugo: boolean;
    numeroGoles?: number;
};
type Props = {
    partidoId: number;
    onClose: () => void;
    onSave?: () => void;
};

const EditarVocaliaModal: React.FC<Props> = ({ partidoId, onClose, onSave }) => {
    const [vocalia, setVocalia] = useState<Vocalia | null>(null);
    const [vocaliaId, setVocaliaId] = useState<string>('');
    const [jugadores, setJugadores] = useState<Jugador[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [nominaLocal, setNominaLocal] = useState<NominaConGoles[]>([]);
    const [nominaVisitante, setNominaVisitante] = useState<NominaConGoles[]>([]);
    const [tarjetasAmarillas, setTarjetasAmarillas] = useState<{ jugadorId: number; equipoId: number }[]>([]);
    const [tarjetasRojas, setTarjetasRojas] = useState<{ jugadorId: number; equipoId: number }[]>([]);





    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todas las vocalías y buscar la que coincida con el partidoId
                const resAll = await api.get(`/vocalias`);
                const vocaliaEncontrada = resAll.data.find((v: Vocalia) => v.partidoId === partidoId);
                if (!vocaliaEncontrada) return;

                setVocalia(vocaliaEncontrada);
                setVocaliaId(vocaliaEncontrada._id);
                setNominaLocal(vocaliaEncontrada.nominaLocal || []);
                setNominaVisitante(vocaliaEncontrada.nominaVisitante || []);
                setTarjetasAmarillas(vocaliaEncontrada.tarjetasAmarillas || []);
                setTarjetasRojas(vocaliaEncontrada.tarjetasRojas || []);

                // Cargar jugadores
                const resJugadores = await api.get(`/jugadores`);
                setJugadores(resJugadores.data.data.items);

                // Cargar equipos
                const resEquipos = await api.get(`/equipos`);
                setEquipos(resEquipos.data.data.items);
            } catch (error) {
                console.error('Error al cargar vocalía o jugadores:', error);
            }
        };

        fetchData();
    }, [partidoId]);

    if (!vocalia) return null;

    const nombreLocal = equipos.find(e => e.id === vocalia.equipoLocalId)?.nombre || 'Local';
    const nombreVisitante = equipos.find(e => e.id === vocalia.equipoVisitanteId)?.nombre || 'Visitante';


    const jugadoresLocal = jugadores.filter(j => j.equipoId === vocalia.equipoLocalId);
    const jugadoresVisitante = jugadores.filter(j => j.equipoId === vocalia.equipoVisitanteId);

    const updateNomina = (
        team: 'local' | 'visitante',
        index: number,
        field: 'jugadorId' | 'jugo' | 'numeroGoles',
        value: any
    ) => {
        const updated = team === 'local' ? [...nominaLocal] : [...nominaVisitante];
        updated[index] = { ...updated[index], [field]: value };
        team === 'local' ? setNominaLocal(updated) : setNominaVisitante(updated);
    };

    const addTarjeta = (color: 'amarilla' | 'roja') => {
        const allJugadores = [...jugadoresLocal, ...jugadoresVisitante];
        if (allJugadores.length === 0) return;
        const defaultJugador = allJugadores[0];
        const nuevaTarjeta = { jugadorId: defaultJugador.id, equipoId: defaultJugador.equipoId };

        if (color === 'amarilla') setTarjetasAmarillas([...tarjetasAmarillas, nuevaTarjeta]);
        else setTarjetasRojas([...tarjetasRojas, nuevaTarjeta]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanNomina = (nomina: any[]) =>
            nomina.map(({ numeroGoles, _id, ...rest }) => rest); // elimina numeroGoles y _id si existieran

        const cleanTarjetas = (tarjetas: any[]) =>
            tarjetas.map(({ _id, ...rest }) => rest);

        const goleadoresLocal = nominaLocal
            .filter(n => n.numeroGoles && n.numeroGoles > 0)
            .map(n => ({ jugadorId: n.jugadorId, numeroGoles: n.numeroGoles }));

        const goleadoresVisita = nominaVisitante
            .filter(n => n.numeroGoles && n.numeroGoles > 0)
            .map(n => ({ jugadorId: n.jugadorId, numeroGoles: n.numeroGoles }));

        try {
            await api.put(`/vocalias/${vocaliaId}`, {
                nominaLocal: cleanNomina(nominaLocal),
                nominaVisitante: cleanNomina(nominaVisitante),
                tarjetasAmarillas: cleanTarjetas(tarjetasAmarillas),
                tarjetasRojas: cleanTarjetas(tarjetasRojas),
                goleadoresLocal,  // Enviamos goles en otra propiedad
                goleadoresVisita,
            });
            if (onSave) onSave();
            onClose();
        } catch (error: any) {
            console.error('Error al guardar vocalía:', error.response?.data || error.message);
            alert(`Error al guardar vocalía: ${error.response?.data?.message || error.message}`);
        }

    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Editar Vocalía {nombreLocal} vs {nombreVisitante}</h3>

                <form onSubmit={handleSubmit}>
                    <div>
                        <h4>Nómina Local</h4>
                        {nominaLocal.map((n, i) => (
                            <div className="form-row" key={i}>
                                <select
                                    value={n.jugadorId}
                                    onChange={(e) => updateNomina('local', i, 'jugadorId', Number(e.target.value))}
                                >
                                    {jugadoresLocal.map(j => (
                                        <option key={j.id} value={j.id}>
                                            {j.nombre} {j.apellido} - #({j.edad})
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={n.jugo ? 'true' : 'false'}
                                    onChange={(e) => updateNomina('local', i, 'jugo', e.target.value === 'true')}
                                >
                                    <option value="true">Jugó</option>
                                    <option value="false">No jugó</option>
                                </select>
                                <input
                                    type="number"
                                    min={0}
                                    value={n.numeroGoles || 0}
                                    disabled={!n.jugo}
                                    placeholder="Goles"
                                    onChange={(e) => updateNomina('local', i, 'numeroGoles', Number(e.target.value))}
                                    style={{ width: '60px' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4>Nómina Visitante</h4>
                        {nominaVisitante.map((n, i) => (
                            <div className="form-row" key={i}>
                                <select
                                    value={n.jugadorId}
                                    onChange={(e) =>
                                        updateNomina('visitante', i, 'jugadorId', Number(e.target.value))
                                    }
                                >
                                    {jugadoresVisitante.map((j) => (
                                        <option key={j.id} value={j.id}>
                                            {j.nombre} {j.apellido} - #({j.edad})
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={n.jugo ? 'true' : 'false'}
                                    onChange={(e) =>
                                        updateNomina('visitante', i, 'jugo', e.target.value === 'true')
                                    }
                                >
                                    <option value="true">Jugó</option>
                                    <option value="false">No jugó</option>
                                </select>

                                {/* 👇 ESTA PARTE FALTABA */}
                                <input
                                    type="number"
                                    min={0}
                                    value={n.numeroGoles || 0}
                                    disabled={!n.jugo}
                                    placeholder="Goles"
                                    onChange={(e) =>
                                        updateNomina('visitante', i, 'numeroGoles', Number(e.target.value))
                                    }
                                    style={{ width: '60px' }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="tarjetas-section">
                        <h4>Tarjetas</h4>
                        <div className="form-row tarjetas">
                            <div className="tarjetas-col">
                                <strong>Amarillas:</strong>
                                {tarjetasAmarillas.map((t, i) => (
                                    <div key={i} className="tarjeta-item">
                                        <select
                                            value={t.jugadorId}
                                            onChange={(e) => {
                                                const updated = [...tarjetasAmarillas];
                                                updated[i] = { ...updated[i], jugadorId: Number(e.target.value) };
                                                setTarjetasAmarillas(updated);
                                            }}
                                        >
                                            {[...jugadoresLocal, ...jugadoresVisitante].map((j) => (
                                                <option key={j.id} value={j.id}>
                                                    {j.nombre} {j.apellido} - #({j.edad})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-eliminar"
                                            onClick={() => {
                                                setTarjetasAmarillas(tarjetasAmarillas.filter((_, idx) => idx !== i));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addTarjeta('amarilla')} className="btn btn-primary">
                                    + Amarilla
                                </button>
                            </div>

                            <div className="tarjetas-col">
                                <strong>Rojas:</strong>
                                {tarjetasRojas.map((t, i) => (
                                    <div key={i} className="tarjeta-item">
                                        <select
                                            value={t.jugadorId}
                                            onChange={(e) => {
                                                const updated = [...tarjetasRojas];
                                                updated[i] = { ...updated[i], jugadorId: Number(e.target.value) };
                                                setTarjetasRojas(updated);
                                            }}
                                        >
                                            {[...jugadoresLocal, ...jugadoresVisitante].map((j) => (
                                                <option key={j.id} value={j.id}>
                                                    {j.nombre} {j.apellido} - # {j.edad}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            className="btn btn-eliminar"
                                            onClick={() => {
                                                setTarjetasRojas(tarjetasRojas.filter((_, idx) => idx !== i));
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addTarjeta('roja')} className="btn btn-primary">
                                    + Roja
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">Guardar</button>
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarVocaliaModal;
