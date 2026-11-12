const STORAGE_KEY = 'bulls-and-cows.scores';
const DEFAULT_SCORE_LIMIT = 10;

export type ScoreRecord = {
  attempts: number;
  durationMs: number;
  length: number;
  base: number;
  completedAt: number;
};

type ScoreStorage = Pick<Storage, 'getItem' | 'setItem'>;

const isScoreRecord = (value: unknown): value is ScoreRecord => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    Number.isInteger(record.attempts) &&
    Number(record.attempts) > 0 &&
    typeof record.durationMs === 'number' &&
    Number.isFinite(record.durationMs) &&
    record.durationMs >= 0 &&
    Number.isInteger(record.length) &&
    Number(record.length) >= 2 &&
    Number(record.length) <= 6 &&
    [2, 8, 10, 16].includes(Number(record.base)) &&
    typeof record.completedAt === 'number' &&
    Number.isFinite(record.completedAt)
  );
};

const sortScores = (scores: ScoreRecord[]): ScoreRecord[] =>
  [...scores].sort(
    (first, second) =>
      first.attempts - second.attempts || first.durationMs - second.durationMs,
  );

/**
 * Loads validated scores from storage and ranks them by attempts, then time.
 * Time complexity: O(n log n); space complexity: O(n).
 */
export function loadScores(
  storage: ScoreStorage = localStorage,
): ScoreRecord[] {
  const serializedScores = storage.getItem(STORAGE_KEY);

  if (serializedScores === null) {
    return [];
  }

  let parsedScores: unknown;

  try {
    parsedScores = JSON.parse(serializedScores);
  } catch (error) {
    throw new Error('Saved leaderboard data is invalid.', { cause: error });
  }

  if (!Array.isArray(parsedScores) || !parsedScores.every(isScoreRecord)) {
    throw new Error('Saved leaderboard data is invalid.');
  }

  return sortScores(parsedScores);
}

/**
 * Saves a score, retaining only the highest-ranked entries.
 * Time complexity: O(n log n); space complexity: O(n).
 */
export function saveScore(
  score: ScoreRecord,
  storage: ScoreStorage = localStorage,
  limit: number = DEFAULT_SCORE_LIMIT,
): ScoreRecord[] {
  if (!isScoreRecord(score)) {
    throw new RangeError('Score record is invalid.');
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('Score limit must be a positive integer.');
  }

  const rankedScores = sortScores([...loadScores(storage), score]).slice(
    0,
    limit,
  );
  storage.setItem(STORAGE_KEY, JSON.stringify(rankedScores));

  return rankedScores;
}
