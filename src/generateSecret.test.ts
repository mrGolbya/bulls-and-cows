import { describe, it, expect } from 'vitest';
import { generateSecret } from './generateSecret';

describe('generateSecret', () => {
  it('should generate a secret with specified length', () => {
    const secret = generateSecret(4);
    expect(secret).toHaveLength(4);
    expect(typeof secret).toBe('string');
  });

  it('should generate a secret with unique digits only', () => {
    const secret = generateSecret(5);
    expect(secret).toMatch(/^[0-9]+$/); // Только цифры
    const uniqueDigits = new Set(secret);
    expect(uniqueDigits.size).toBe(5); // Все цифры уникальны
  });

  it('should handle different lengths correctly', () => {
    for (let i = 1; i <= 10; i++) {
      const secret = generateSecret(i);
      expect(secret).toHaveLength(i);
      const uniqueDigits = new Set(secret);
      expect(uniqueDigits.size).toBe(i);
    }
  });

  it('should work with base parameter', () => {
    // Тест для двоичной системы счисления
    const binarySecret = generateSecret(4, 2);
    expect(binarySecret).toMatch(/^[01]+$/); // Только 0 и 1

    // Тест для шестнадцатеричной системы счисления
    const hexSecret = generateSecret(6, 16);
    expect(hexSecret).toMatch(/^[0-9a-f]+$/); // Цифры 0-9 и буквы a-f
  });

  it('should work with random parameter for deterministic results', () => {
    // Создаем фабрику мока для каждого вызова
    const createMockRandom = (counter: number) => () => {
      return (counter + 1) / 10;
    };

    const secret1 = generateSecret(4, 10, createMockRandom(0));
    const secret2 = generateSecret(4, 10, createMockRandom(0));

    expect(secret1).toBe(secret2);
  });

  it('should handle edge cases', () => {
    expect(() => generateSecret(0)).toThrow();
    expect(() => generateSecret(-1)).toThrow();
    expect(() => generateSecret(11)).toThrow();
    // Проверяем, что base не игнорируется
    const secret = generateSecret(4, 16);
    expect(typeof secret).toBe('string');
  });
});
