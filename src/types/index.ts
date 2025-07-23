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
  equipoLocalId: number;
  equipoVisitanteId: number;
  fecha: Date;
  golesLocal: number;
  golesVisitante: number;
  estado: string;
}

export interface Posicion {
  _id: string;
  equipoId: number;
  puntos: number;
  partidosJugados: number;
  partidosGanados: number;
  partidosEmpatados: number;
  partidosPerdidos: number;
  golesFavor: number;
  golesContra: number;
  diferenciaGol: number;
}

// types.ts

export type NominaJugador = {
  jugadorId: number;
  equipoId: number;
  jugo: boolean;
};

export type Goleador = {
  jugadorId: number;
  numeroGoles: number;
};

export type Tarjeta = {
  jugadorId: number;
  equipoId: number;
};

export type Vocalia = {
  _id: string; // o number si usas IDs numéricos en Mongo
  partidoId: number;
  equipoLocalId: number;
  equipoVisitanteId: number;
  golesLocal: number;
  golesVisita: number;
  nominaLocal: NominaJugador[];
  nominaVisitante: NominaJugador[];
  goleadoresLocal: Goleador[];
  goleadoresVisita: Goleador[];
  tarjetasAmarillas: Tarjeta[];
  tarjetasRojas: Tarjeta[];
};
