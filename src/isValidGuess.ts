import { createDigitValidator } from './createDigitValidator.js';

/**
 * Checks that a guess has the required length and unique digits for its base.
 * Time complexity: O(n); space complexity: O(n).
 */
export function isValidGuess(
  guess: string,
  length: number,
  base: number,
): boolean {
  if (
    !Number.isInteger(length) ||
    length < 1 ||
    !Number.isInteger(base) ||
    base < 2 ||
    base > 36 ||
    length > base ||
    guess.length !== length
  ) {
    return false;
  }

  const digits = [...guess].map((digit) => digit.toLowerCase());
  const isValidDigit = createDigitValidator(base);

  return digits.every(isValidDigit) && new Set(digits).size === digits.length;
}
