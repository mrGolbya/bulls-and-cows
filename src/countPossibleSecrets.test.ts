import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets';

describe('countPossibleSecrets', () => {
  it.each([
    { length: 1, base: 2, count: 2 },
    { length: 2, base: 2, count: 2 },
    { length: 3, base: 8, count: 336 },
    { length: 4, base: 10, count: 5040 },
    { length: 6, base: 16, count: 5765760 },
  ])(
    'counts $length-digit secrets in base $base',
    ({ length, base, count }) => {
      expect(countPossibleSecrets(length, base)).toBe(count);
    },
  );

  it('counts secrets that start with zero', () => {
    expect(countPossibleSecrets(2, 10)).toBe(90);
  });

  it('returns the same count for repeated inputs', () => {
    const first = countPossibleSecrets(5, 12);
    const second = countPossibleSecrets(5, 12);

    expect(first).toBe(95040);
    expect(second).toBe(first);
  });

  it.each([
    { length: 0, base: 10 },
    { length: -1, base: 10 },
    { length: 3, base: 2 },
    { length: 2, base: 1 },
  ])('rejects invalid length $length for base $base', ({ length, base }) => {
    expect(() => countPossibleSecrets(length, base)).toThrow();
  });
});
