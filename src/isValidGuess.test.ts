import { describe, expect, it } from 'vitest';
import { isValidGuess } from './isValidGuess';

describe('isValidGuess', () => {
  it.each([
    { guess: '10', length: 2, base: 2 },
    { guess: '207', length: 3, base: 8 },
    { guess: '9071', length: 4, base: 10 },
    { guess: 'a2F9', length: 4, base: 16 },
  ])(
    'accepts "$guess" of length $length in base $base',
    ({ guess, length, base }) => {
      expect(isValidGuess(guess, length, base)).toBe(true);
    },
  );

  it.each([
    { guess: '123', length: 4, base: 10 },
    { guess: '12345', length: 4, base: 10 },
    { guess: '1123', length: 4, base: 10 },
    { guess: '128', length: 3, base: 8 },
    { guess: '1g3', length: 3, base: 16 },
    { guess: '12', length: 2, base: 2 },
  ])(
    'rejects "$guess" of length $length in base $base',
    ({ guess, length, base }) => {
      expect(isValidGuess(guess, length, base)).toBe(false);
    },
  );

  it.each([
    { guess: '', length: 0, base: 10 },
    { guess: '12', length: -1, base: 10 },
    { guess: '12', length: 2, base: 1 },
  ])('rejects invalid parameters for "$guess"', ({ guess, length, base }) => {
    expect(isValidGuess(guess, length, base)).toBe(false);
  });
});
