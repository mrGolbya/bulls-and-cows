import { describe, it, expect } from 'vitest';
import { createDigitValidator } from './createDigitValidator';

describe('createDigitValidator', () => {
  it('should create a validator for binary system (base 2)', () => {
    const validator = createDigitValidator(2);
    expect(validator('0')).toBe(true);
    expect(validator('1')).toBe(true);
    expect(validator('2')).toBe(false);
    expect(validator('a')).toBe(false);
  });

  it('should create a validator for octal system (base 8)', () => {
    const validator = createDigitValidator(8);
    expect(validator('0')).toBe(true);
    expect(validator('7')).toBe(true);
    expect(validator('8')).toBe(false);
    expect(validator('a')).toBe(false);
  });

  it('should create a validator for decimal system (base 10)', () => {
    const validator = createDigitValidator(10);
    expect(validator('0')).toBe(true);
    expect(validator('9')).toBe(true);
    expect(validator('a')).toBe(false);
    expect(validator('10')).toBe(false);
  });

  it('should create a validator for hexadecimal system (base 16)', () => {
    const validator = createDigitValidator(16);
    expect(validator('0')).toBe(true);
    expect(validator('f')).toBe(true);
    expect(validator('F')).toBe(true);
    expect(validator('g')).toBe(false);
    expect(validator('10')).toBe(false);
  });

  it('should be case insensitive', () => {
    const validator = createDigitValidator(16);
    expect(validator('A')).toBe(true);
    expect(validator('a')).toBe(true);
  });
});
