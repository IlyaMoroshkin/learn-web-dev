import assert from 'node:assert/strict';
import { test } from 'node:test';

// A model of the written requirements, independent of the booking application.
function evaluateConfirmation(name, phone) {
  const errors = {};

  if (name === '') errors.name = 'required';
  else if (!/^[А-Яа-яЁё]{2,40}$/u.test(name)) errors.name = 'invalid';

  if (phone === '') errors.phone = 'required';
  else if (!/^\+7 \(9\d{2}\) \d{3}-\d{2}-\d{2}$/u.test(phone)) errors.phone = 'invalid';

  return { canSubmit: Object.keys(errors).length === 0, errors };
}

const validName = 'Алёна';
const validPhone = '+7 (999) 123-45-67';

const cases = [
  ['TC-09: 10 digits', validName, '+7 (999) 123-45-6', { phone: 'invalid' }],
  ['TC-10 / R1: valid contacts', validName, validPhone, {}],
  ['TC-11: 12 digits', validName, '+7 (999) 123-45-678', { phone: 'invalid' }],
  ['TC-12: empty name', '', validPhone, { name: 'required' }],
  ['TC-12: one letter', 'Я', validPhone, { name: 'invalid' }],
  ['TC-12: two letters including Ё', 'Ёя', validPhone, {}],
  ['TC-13: 39 letters', 'А'.repeat(39), validPhone, {}],
  ['TC-13: 40 letters', 'А'.repeat(40), validPhone, {}],
  ['TC-13: 41 letters', 'А'.repeat(41), validPhone, { name: 'invalid' }],
  ...['Аннa', 'Анн1', 'Анн-', 'Ан а'].map(name =>
    ['TC-14: ' + name, name, validPhone, { name: 'invalid' }]),
  ...['+1 (999) 123-45-67', '+7 (899) 123-45-67', '+7 (999) 123-45-6А', '+7 [999) 123-45-67'].map(phone =>
    ['TC-15: ' + phone, validName, phone, { phone: 'invalid' }]),
  ['TC-16 R2: invalid phone', validName, '123', { phone: 'invalid' }],
  ['TC-16 R4: missing phone', validName, '', { phone: 'required' }],
  ['TC-16 R5: missing name', '', validPhone, { name: 'required' }],
  ['TC-16 R6: missing name and invalid phone', '', '123', { name: 'required', phone: 'invalid' }],
  ['TC-16 R8: missing contacts', '', '', { name: 'required', phone: 'required' }],
];

for (const [title, name, phone, expectedErrors] of cases) {
  test(title, () => {
    assert.deepEqual(evaluateConfirmation(name, phone), {
      canSubmit: Object.keys(expectedErrors).length === 0,
      errors: expectedErrors,
    });
  });
}
