import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <a href="#" className="logo">
          <span className="logo__icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 0-4 4c0 3 4 7 4 7s4-4 4-7a4 4 0 0 0-4-4z"/>
              <path d="M12 13a4 4 0 0 0-4 4c0 3 4 5 4 5s4-2 4-5a4 4 0 0 0-4-4z"/>
              <path d="M2 12a4 4 0 0 0 4-4c3 0 7 4 7 4s-4 4-7 4a4 4 0 0 0-4-4z"/>
              <path d="M13 12a4 4 0 0 0 4-4c3 0 5 4 5 4s-2 4-5 4a4 4 0 0 0-4-4z"/>
            </svg>
          </span>
          <div className="logo__text-group">
            <span className="logo__title">Blossom Beauty</span>
            <span className="logo__subtitle">ВРЕМЯ ДЛЯ СЕБЯ</span>
          </div>
        </a>

        <nav className="nav">
          <ul className="nav__list">
            <li className="nav__item"><a href="#" className="nav__link">Услуги</a></li>
            <li className="nav__item"><a href="#" className="nav__link">Наши мастера</a></li>
            <li className="nav__item"><a href="#" className="nav__link">О салоне</a></li>
            <li className="nav__item"><a href="#" className="nav__link">Контакты</a></li>
          </ul>
        </nav>

        <a href="#" className="header__account">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Личный кабинет</span>
        </a>
      </div>
    </header>
  );
}
