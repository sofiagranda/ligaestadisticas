import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Estadistica, Jugador, } from '../types';

interface EstadisticaExpandida {
    nombre: string;
    goles: number;
    asistencias: number;
}
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

type EstadisticasPaginadas = {
    items: Estadistica[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
};
type JugadoresPaginados = {
    items: Jugador[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
};



const Estadisticas: React.FC = () => {
    const [data, setData] = useState<EstadisticaExpandida[]>([]);

    useEffect(() => {
        Promise.all([
            api.get('/jugadores'),
            api.get('/estadisticas'),
        ]).then(([jugadoresRes, estadisticasRes]) => {
            const jugadores = jugadoresRes.data.data.items;
            const estadisticas = estadisticasRes.data.data.items;

            const jugadoresMap = new Map(jugadores.map((j: Jugador) => [j.id, j.nombre]));

            const resultado = estadisticas.map((est: Estadistica) => ({
                nombre: jugadoresMap.get(est.jugadorId) || 'Desconocido',
                goles: est.goles,
                asistencias: est.asistencias,
            }));

            setData(resultado);
        });
    }, []);



    return (
        <div>
            <h2 className="mb-4">Estadísticas</h2>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Jugador</th>
                        <th>Goles</th>
                        <th>Asistencias</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((e, i) => (
                        <tr key={i}>
                            <td>{e.nombre}</td>
                            <td>{e.goles}</td>
                            <td>{e.asistencias}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Estadisticas;
