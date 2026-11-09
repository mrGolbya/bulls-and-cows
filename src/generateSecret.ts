/**
 * Generates a secret containing unique digits for the given base.
 * Time and space complexity: O(base * length).
 */
export function generateSecret(
  length: number,
  base: number,
  random: () => number = Math.random,
): string {
  if (!Number.isInteger(base) || base < 2 || base > 36) {
    throw new RangeError('Base must be an integer between 2 and 36.');
  }

  if (!Number.isInteger(length) || length < 1 || length > base) {
    throw new RangeError('Length must be an integer between 1 and the base.');
  }

  const selectDigits = (remaining: string[], count: number): string[] => {
    if (count === 0) {
      return [];
    }

    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) {
      throw new RangeError('Random source must return a number in [0, 1).');
    }

    const selectedIndex = Math.floor(sample * remaining.length);
    const selectedDigit = remaining[selectedIndex];

    return [
      selectedDigit,
      ...selectDigits(
        remaining.filter((_, index) => index !== selectedIndex),
        count - 1,
      ),
    ];
  };

  const digits = Array.from({ length: base }, (_, digit) =>
    digit.toString(base),
  );

  return selectDigits(digits, length).join('');
}
