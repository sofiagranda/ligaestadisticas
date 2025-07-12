export interface Jugador {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  posicion: string;
  equipoId: number;
  foto?: string;
  pais?: string;
  goles: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
  partidosJugados: number;
  isActive: boolean;
}

export interface Equipo {
  id: number;
  nombre: string;
  fundacion: number;
  foto: string;
  colorPrimario?: string; // opcional, hex o nombre
  colorSecundario?: string; // opcional
}


export interface EstadisticaEquipo {
  id: number;
  equipoId: number;
  equipo: Equipo;
  golesFavor: number;
  golesContra: number;
  tarjetasAmarillas: number;
  tarjetasRojas: number;
};

export interface Partido {
  id: number;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  golesLocal: number;
  golesVisitante: number;
  estado: string;
}
