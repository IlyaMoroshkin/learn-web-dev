import React from 'react';

export default function SelectionBanner() {
  return (
    <section className="selection-banner">
      <div className="selection-banner__master">
        <div className="selection-banner__avatar-wrap">
          <img
            className="selection-banner__avatar"
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80"
            alt="Анна Соколова"
          />
        </div>
        <div className="selection-banner__info">
          <h2 className="selection-banner__name">Анна Соколова</h2>
          <p className="selection-banner__role">Стилист-колорист</p>
        </div>
      </div>

      <div className="selection-banner__service">
        <span>Стрижка и укладка</span>
      </div>

      <div className="selection-banner__price">
        <span>60 мин · 5 000 ₽</span>
      </div>
    </section>
  );
}
