import React from 'react';
import './NavbarSuperior.css';

const clubs = [
  'america', 'arsenal', 'astonbiela', 'banda_ds', 'CDPH',
  'corinthzonas', 'dream_team', 'juventudph', 'piamonte', 'princejr','soccer machine',
  'the_walls'
];

const NavbarSuperior: React.FC = () => {
  return (
    <div className="navbar-superior px-4 py-2 ">
      <div className="clubs-scroll d-flex align-items-center gap-3 mb-2 hEJfTo">
        <p className="styled__TextStyled-sc-1mby3k1-0 dXgpqT">Web Clubes</p>
        {clubs.map((club) => (
          <img key={club} src={`/logos/${club}.png`} alt={club} className="club-icon" />
        ))}
      </div>
    </div>
  );
};

export default NavbarSuperior;
