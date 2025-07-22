import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import NavbarSuperior from './components/NavbarSuperior';
import Jugadores from './pages/Jugadores';
import Equipos from './pages/Equipos';
import Estadisticas from './pages/Estadisticas';
import Partidos from './pages/Partidos';
import JugadoresPorEquipo from './components/JugadoresPorEquipo';
import HomePage from './components/Home';
import EstadisticasGenerales from './components/EstadisticasGenerales';
import EstadisticasEquipos from './components/EstadisticasEquipos';
import TablaPosiciones from './components/TablaPosiciones';
import LoginPage from './pages/LoginPage';
import NavbarLogin from './components/navbarlogin';

function App() {
  return (
    <>
      <NavbarLogin />
      <NavbarSuperior />
      <Navbar />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/jugadores" element={<Jugadores />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/partidos" element={<Partidos />} />
          <Route path="/equipo/:equipoId" element={<JugadoresPorEquipo />} />
          <Route path="/estadisticas/generales" element={<EstadisticasGenerales />} />
          <Route path="/estadisticas/equipos" element={<EstadisticasEquipos />} />
          <Route path="/estadisticas/tablaposiciones" element={<TablaPosiciones />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
