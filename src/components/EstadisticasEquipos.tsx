import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Equipo, EstadisticaEquipo } from '../types';
import './EstadisticasGenerales.css';
import { Link } from 'react-router-dom';

interface EstadisticaConEquipo extends EstadisticaEquipo {
    equipo: Equipo;
}

const EstadisticasEquipos: React.FC = () => {
    const [estadisticas, setEstadisticas] = useState<EstadisticaConEquipo[]>([]);
    const [filtro] = useState<'goleadores' | 'tarjetasAmarillas' | 'tarjetasRojas'>('goleadores');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [equiposRes, estadisticasRes] = await Promise.all([
                    api.get('/equipos'),
                    api.get('/estadisticas'),
                ]);

                const equipos: Equipo[] = equiposRes.data.data.items;
                console.log(equipos)
                const stats: EstadisticaEquipo[] = estadisticasRes.data.data.items;

                const combinadas: EstadisticaConEquipo[] = stats
                    .map(est => {
                        const equipo = equipos.find(e => e.id === est.equipoId);
                        if (!equipo) return null;
                        return { ...est, equipo };
                    })
                    .filter(Boolean) as EstadisticaConEquipo[];

                setEstadisticas(combinadas);
            } catch (error) {
                console.error('Error al cargar datos de equipos y estadísticas:', error);
            }
        };

        fetchData();
    }, []);

    // Ordenar y limitar a 10
    const ordenadas = [...estadisticas];
    switch (filtro) {
        case 'goleadores':
            ordenadas.sort((a, b) => b.golesFavor - a.golesFavor);
            break;
        case 'tarjetasAmarillas':
            ordenadas.sort((a, b) => b.tarjetasAmarillas - a.tarjetasAmarillas);
            break;
        case 'tarjetasRojas':
            ordenadas.sort((a, b) => b.tarjetasRojas - a.tarjetasRojas);
            break;
    }
    const top10 = ordenadas.slice(0, 10);

    return (
        <div className="estadisticas-generales">
            <div className="jornada-titulo">
                <div className='enlaces'>
                    <a className="link" href="/">
                        <span className="span-link">Inicio</span>
                    </a>
                    <span className='span-link'>&gt;</span>
                    <a className="link" href="/estadisticas/equipos">
                        <span className="span-link">Estadísticas por Equipo</span>
                    </a>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center">Estadísticas por Equipo</h2>
            </div>
            <table className="tabla-estadisticas">
                <thead>
                    <tr>
                        <th></th>
                        <th>Equipo</th>
                        <th>Goles a Favor</th>
                        <th>Goles en Contra</th>
                        <th>Tarjetas Amarillas</th>
                        <th>Tarjetas Rojas</th>
                    </tr>
                </thead>
                <tbody>
                    {top10.map((e, i) => (
                        <tr key={e.id}>
                            <td className="ranking"><span >{i + 1}</span> {/* ← Posición */}</td>
                            <td>
                                <div className="equipo-info">
                                    <Link to={`/equipo/${e.equipo.id}`} className="equipo-info">
                                        {e.equipo.foto && (
                                            <img
                                                src={`/logos/${e.equipo.foto}`}
                                                alt={e.equipo.nombre}
                                                className="logo-equipo"
                                            />
                                        )}
                                        {e.equipo.nombre}
                                    </Link>
                                </div>
                            </td>
                            <td>{e.golesFavor}</td>
                            <td>{e.golesContra}</td>
                            <td>{e.tarjetasAmarillas}</td>
                            <td>{e.tarjetasRojas}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EstadisticasEquipos;
