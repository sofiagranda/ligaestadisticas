import React from 'react';

const HomePage: React.FC = () => {
  return (
    <section style={{
      backgroundColor: '#0b0b0b',
      color: '#fff',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        color: '#e31b23', 
        fontSize: '3rem', 
        marginBottom: '1rem',
        fontWeight: '900',
        textAlign: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        Estadísticas de LaLiga en Tiempo Real
      </h1>

      <p style={{ 
        maxWidth: '600px', 
        textAlign: 'center', 
        fontSize: '1.2rem',
        marginBottom: '2rem',
        lineHeight: '1.5',
        color: '#ccc'
      }}>
        Consulta las estadísticas más actualizadas de los jugadores, equipos y partidos.
        Mantente informado y disfruta de cada detalle de la temporada.
      </p>

      <button style={{
        backgroundColor: '#e31b23',
        border: 'none',
        padding: '1rem 2.5rem',
        fontSize: '1.2rem',
        color: '#fff',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '700',
        boxShadow: '0 4px 8px rgba(227, 27, 35, 0.6)',
        transition: 'background-color 0.3s ease'
      }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#bf181f')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#e31b23')}
      >
        Ver Estadísticas
      </button>
    </section>
  );
};

export default HomePage;
