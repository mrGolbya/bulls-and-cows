import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluateGuess';

describe('evaluateGuess', () => {
  it('counts exact matches as bulls', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('counts digits in the wrong position as cows', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows without counting bulls as cows', () => {
    expect(evaluateGuess('1234', '1325')).toEqual({ bulls: 1, cows: 2 });
  });

  it('returns zero bulls and cows when there are no matching digits', () => {
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('accepts a secret represented as an array of digits', () => {
    expect(evaluateGuess(['1', '2', '3', '4'], '1432')).toEqual({
      bulls: 2,
      cows: 2,
    });
  });

  it('compares hexadecimal letters without regard to case', () => {
    expect(evaluateGuess('a2F9', 'A9f0')).toEqual({ bulls: 2, cows: 1 });
  });
});
