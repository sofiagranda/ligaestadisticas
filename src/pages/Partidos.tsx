import React, { useEffect, useState } from 'react';
import api from '../api/api';
import type { Partido, Equipo } from '../types';
import './Partidos.css'

const getStartOfWeek = (date: Date) => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const daysToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  startOfWeek.setDate(startOfWeek.getDate() - daysToMonday);
  startOfWeek.setHours(0, 0, 0, 0);  // Establecer la hora al inicio del día
  return startOfWeek;
};
const formatWeek = (startOfWeek: Date) => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Fin de la semana, 6 días después
  return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
};
const Partidos: React.FC = () => {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [equipos, setEquipos] = useState<{ [key: number]: Equipo }>({}); // Para almacenar los equipos por ID
  //
  useEffect(() => {
    // Traer los partidos
    api.get('/partidos').then(res => {
      setPartidos(res.data);
      // Obtener los equipos correspondientes a cada partido
      const equipoIds = [
        ...new Set(res.data.map((p: Partido) => [p.equipoLocalId, p.equipoVisitanteId]).flat()) // Usamos equipoLocalId y equipoVisitanteId
      ];
      console.log(equipoIds, 'kkkkk');

      // Hacemos una consulta para traer los detalles de los equipos
      api.get(`/equipos`).then(response => {
        const equiposData = response.data.data.items;  // Accedemos correctamente a 'data.items'
        console.log(equiposData)

        if (!Array.isArray(equiposData)) {
          console.error('La respuesta de equipos no es un array');
          return;
        }

        // Crear un mapa de equipos por su ID
        const equiposMap = equiposData.reduce((acc: { [key: number]: Equipo }, equipo: Equipo) => {
          acc[equipo.id] = equipo;
          return acc;
        }, {});
        console.log(equiposMap, "f")

        setEquipos(equiposMap); // Guardamos los equipos
      });
    });
  }, []);

  // Agrupar los partidos por semana
  const partidosPorSemana = partidos.reduce((acc, partido) => {
    const startOfWeek = getStartOfWeek(new Date(partido.fecha));  // Obtener inicio de semana para cada partido
    const weekLabel = formatWeek(startOfWeek);  // Formatear la semana

    if (!acc[weekLabel]) {
      acc[weekLabel] = [];
    }

    acc[weekLabel].push(partido);
    return acc;
  }, {} as { [key: string]: Partido[] });


  return (
    <div>
      <h2 className="mb-4">Calendario de Partidos</h2>
      <div className="jornadas-grid">
        {Object.keys(partidosPorSemana).map(semana => {
          return (
            <div className="jornada" key={semana}>
              <h3>{`Semana del ${semana}`}</h3>
              <div className="partidos">
                {partidosPorSemana[semana].map(partido => {
                  // Obtenemos los equipos por sus IDs (partido.equipoLocalId y partido.equipoVisitanteId)
                  const equipoLocal = equipos[partido.equipoLocalId];
                  const equipoVisitante = equipos[partido.equipoVisitanteId];

                  if (!equipoLocal || !equipoVisitante) return null; // Si los equipos no están cargados, no renderizamos el partido

                  return (
                    <div className="partido" key={partido.id}>
                      <img
                        src={`/logos/${equipoLocal.foto}`} // Ajusta según la ruta de tus imágenes
                        alt={equipoLocal.nombre}
                        className="logo"
                      />
                      <strong>{equipoLocal.nombre} {partido.golesLocal} - {partido.golesVisitante} {equipoVisitante.nombre}</strong>
                      <img
                        src={`/logos/${equipoVisitante.foto}`} // Ajusta según la ruta de tus imágenes
                        alt={equipoVisitante.nombre}
                        className="logo"
                      />
                      <br />
                      Fecha: {new Date(partido.fecha).toLocaleDateString()} - Estado: {partido.estado}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Partidos;
