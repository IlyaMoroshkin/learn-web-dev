import React from 'react';

const STEPS = [
  { id: 1, label: 'Мастер', completed: true },
  { id: 2, label: 'Услуга', completed: true },
  { id: 3, label: 'Дата и время', current: true },
  { id: 4, label: 'Ваши данные' },
  { id: 5, label: 'Подтверждение' }
];

export default function Stepper() {
  return (
    <nav className="stepper" aria-label="Этапы записи">
      <ol className="stepper__list">
        {STEPS.map((step, idx) => {
          let itemClass = 'stepper__item';
          if (step.completed) itemClass += ' stepper__item--completed';
          if (step.current) itemClass += ' stepper__item--active';

          return (
            <React.Fragment key={step.id}>
              <li className={itemClass} aria-current={step.current ? 'step' : undefined}>
                <span className="stepper__badge">
                  {step.completed ? '✓' : step.id}
                </span>
                <span className="stepper__label">{step.label}</span>
              </li>
              {idx < STEPS.length - 1 && (
                <li
                  className={`stepper__line ${step.completed ? 'stepper__line--completed' : ''}`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
