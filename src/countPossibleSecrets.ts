const countCache = new Map<string, number>();

/**
 * Counts unique-digit secrets using the permutations formula.
 * Time complexity: O(length) per uncached call; space complexity: O(length).
 */
export function countPossibleSecrets(length: number, base: number): number {
  if (
    !Number.isInteger(length) ||
    !Number.isInteger(base) ||
    base < 2 ||
    base > 36 ||
    length < 1 ||
    length > base
  ) {
    throw new RangeError(
      'Length must be an integer between 1 and the base (2–36).',
    );
  }

  const cacheKey = `${length}:${base}`;
  const cachedCount = countCache.get(cacheKey);

  if (cachedCount !== undefined) {
    return cachedCount;
  }

  const count = (remainingLength: number, remainingBase: number): number =>
    remainingLength === 1
      ? remainingBase
      : remainingBase * count(remainingLength - 1, remainingBase - 1);

  const result = count(length, base);
  countCache.set(cacheKey, result);

  return result;
}
