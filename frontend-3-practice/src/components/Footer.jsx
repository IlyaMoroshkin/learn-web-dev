import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__copyright">© 2026 Blossom Beauty. Все права защищены.</p>
        <div className="footer__links">
          <a href="tel:+74951234567" className="footer__link">Помощь: +7 (495) 123-45-67</a>
          <a href="#" className="footer__link">Конфиденциальность</a>
          <a href="#" className="footer__link">Условия записи</a>
        </div>
      </div>
    </footer>
  );
}
