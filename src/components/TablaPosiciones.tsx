import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Posicion, Equipo } from '../types';
import './EstadisticasGenerales.css'
import { Link } from 'react-router-dom';
import '../pages/Partidos.css'

const TablaPosiciones: React.FC = () => {
    const [posiciones, setPosiciones] = useState<Posicion[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [posicionesRes, equiposRes] = await Promise.all([
                    api.get('/tabla-posiciones'),
                    api.get('/equipos')
                ]);
                setPosiciones(posicionesRes.data);
                setEquipos(equiposRes.data.data.items);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getEquipoInfo = (equipoId: number) =>
        equipos.find((equipo) => equipo.id === equipoId);

    if (loading) return <p>Cargando tabla de posiciones...</p>;

    return (
        <div className="estadisticas-generales">
            <div className="jornada-titulo">
                <div className='enlaces'>
                    <a className="link" href="/">
                        <span className="span-link">Inicio</span>
                    </a>
                    <span className='span-link'>&gt;</span>
                    <a className="link" href="/estadisticas/equipos">
                        <span className="span-link">Tabla de Posiciones</span>
                    </a>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">Tabla de Posiciones</h2>
            </div>
            <table className="tabla-estadisticas">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Equipo</th>
                        <th>PJ</th>
                        <th>PG</th>
                        <th>PE</th>
                        <th>PP</th>
                        <th>GF</th>
                        <th>GC</th>
                        <th>DIF</th>
                        <th>PTS</th>
                    </tr>
                </thead>
                <tbody>
                    {[...posiciones]
                        .sort((a, b) => {
                            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
                            if (b.diferenciaGol !== a.diferenciaGol) return b.diferenciaGol - a.diferenciaGol;
                            if (b.golesFavor !== a.golesFavor) return b.golesFavor - a.golesFavor;
                            return b.partidosGanados - a.partidosGanados;
                        })
                        .map((pos, index) => {
                            const equipo = getEquipoInfo(pos.equipoId);
                            return (
                                <tr key={pos._id}>
                                    <td className="ranking">{index + 1}</td>
                                    <td>
                                        <div className="equipo-info">
                                            {equipo ? (
                                                <Link to={`/equipo/${equipo.id}`} className="equipo-info">
                                                    {equipo.foto && (
                                                        <img
                                                            src={`/logos/${equipo.foto}`}
                                                            alt={equipo.nombre}
                                                            className="logo-equipo"
                                                        />
                                                    )}
                                                    {equipo.nombre}
                                                </Link>
                                            ) : (
                                                `Equipo ${pos.equipoId}`
                                            )}
                                        </div>
                                    </td>
                                    <td>{pos.partidosJugados}</td>
                                    <td>{pos.partidosGanados}</td>
                                    <td>{pos.partidosEmpatados}</td>
                                    <td>{pos.partidosPerdidos}</td>
                                    <td>{pos.golesFavor}</td>
                                    <td>{pos.golesContra}</td>
                                    <td>{pos.diferenciaGol}</td>
                                    <td>{pos.puntos}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default TablaPosiciones;
