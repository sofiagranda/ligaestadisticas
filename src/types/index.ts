export interface Jugador {
  id: number;
  nombre: string;
  apellido:string;
  posicion: string;
  equipoId: number;
  foto?: string;
  isActive: boolean;
  edad: number;
  pais: string; 
}

export interface Equipo {
  id: number;
  nombre: string;
  fundacion: number;
  foto: string;
  colorPrimario?: string; // opcional, hex o nombre
  colorSecundario?: string; // opcional
}


export interface Estadistica {
  id: number;
  jugadorId: number;
  goles: number;
  asistencias: number;
}

export interface Partido {
  id: number;
  equipoLocal: string;
  equipoVisitante: string;
  fecha: string;
  golesLocal: number;
  golesVisitante: number;
  estado: string;
}
