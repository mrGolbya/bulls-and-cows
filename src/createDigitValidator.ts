/**
 * Creates a case-insensitive predicate for radix digits.
 * Creation time and space: O(base); predicate time: O(base).
 */
export function createDigitValidator(base: number): (char: string) => boolean {
  const validChars = Array.from({ length: Math.min(base, 16) }, (_, i) =>
    i.toString(base).toLowerCase(),
  );

  return (char: string): boolean => {
    const lowerChar = char.toLowerCase();
    return validChars.includes(lowerChar);
  };
}
