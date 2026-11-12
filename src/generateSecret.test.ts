import { describe, expect, it, vi } from 'vitest';
import { generateSecret } from './generateSecret';

const toDigits = (secret: string | string[]): string[] =>
  typeof secret === 'string' ? [...secret] : secret;

const createRandomSequence = (values: number[]): (() => number) => {
  let index = 0;
  return () => {
    const value = values[index % values.length];
    index += 1;
    return value;
  };
};

describe('generateSecret', () => {
  it.each([
    { length: 2, base: 2 },
    { length: 4, base: 8 },
    { length: 6, base: 10 },
    { length: 6, base: 16 },
  ])('generates $length unique digits in base $base', ({ length, base }) => {
    const digits = toDigits(generateSecret(length, base));

    expect(digits).toHaveLength(length);
    expect(new Set(digits.map((digit) => digit.toLowerCase())).size).toBe(
      length,
    );
    expect(
      digits.every(
        (digit) =>
          digit.length === 1 &&
          Number.parseInt(digit, base) >= 0 &&
          Number.parseInt(digit, base) < base,
      ),
    ).toBe(true);
  });

  it('uses the injected random source and returns a repeatable result', () => {
    const createMockRandom = () =>
      vi.fn(
        createRandomSequence([
          0.01, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 0.99,
        ]),
      );
    const firstRandom = createMockRandom();
    const secondRandom = createMockRandom();

    const first = generateSecret(4, 10, firstRandom);
    const second = generateSecret(4, 10, secondRandom);

    expect(toDigits(first)).toEqual(toDigits(second));
    expect(firstRandom).toHaveBeenCalled();
  });

  it.each([
    { length: 0, base: 10 },
    { length: -1, base: 10 },
    { length: 3, base: 2 },
  ])('rejects impossible length $length for base $base', ({ length, base }) => {
    expect(() => generateSecret(length, base)).toThrow();
  });
});
