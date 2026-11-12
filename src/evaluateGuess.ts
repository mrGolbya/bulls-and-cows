/**
 * Counts exact and misplaced digit matches between a secret and a guess.
 * Time complexity: O(n²); space complexity: O(n).
 */
export function evaluateGuess(
  secret: string | string[],
  guess: string,
): { bulls: number; cows: number } {
  const secretDigits = (typeof secret === 'string' ? [...secret] : secret).map(
    (digit) => digit.toLowerCase(),
  );
  const guessDigits = [...guess].map((digit) => digit.toLowerCase());

  const bulls = guessDigits.reduce(
    (total, digit, index) => total + Number(secretDigits[index] === digit),
    0,
  );
  const matches = guessDigits.filter((digit) =>
    secretDigits.includes(digit),
  ).length;

  return { bulls, cows: matches - bulls };
}
