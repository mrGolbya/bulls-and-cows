/**
 * Фабрика валидаторов для цифр в системах счисления
 * Временная сложность: O(1)
 * @param base - основание системы счисления
 * @returns функция проверки символа на валидность
 */
export function createDigitValidator(base: number): (char: string) => boolean {
  // Создаем массив допустимых символов для системы счисления через Array.from без цикла
  const validChars = Array.from({ length: Math.min(base, 16) }, (_, i) =>
    i.toString(base).toLowerCase(),
  );

  // Возвращает функцию, которая проверяет, содержится ли символ в допустимых цифрах
  return (char: string): boolean => {
    // Приводим символ к нижнему регистру для регистронезависимости
    const lowerChar = char.toLowerCase();

    // Используем метод includes для проверки валидности - O(n) операция
    return validChars.includes(lowerChar);
  };
}
