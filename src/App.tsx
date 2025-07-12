import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarSuperior from './components/NavbarSuperior';
import Jugadores from './pages/Jugadores';
import Equipos from './pages/Equipos';
import Estadisticas from './pages/Estadisticas';
import Partidos from './pages/Partidos';
import JugadoresPorEquipo from './components/JugadoresPorEquipo';

function App() {
  return (
    <>
      <NavbarSuperior />
      <Navbar />
      <main className="container mt-4">
        <Routes>
          <Route path="/jugadores" element={<Jugadores />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/partidos" element={<Partidos />} />
          <Route path="/jugadores/equipo/:equipoId" element={<JugadoresPorEquipo />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
