import { describe, expect, it } from 'vitest';
import { loadScores, saveScore, type ScoreRecord } from './leaderboard';

const createMemoryStorage = (initialValue: string | null = null) => {
  let value = initialValue;

  return {
    getItem: (key: string) => (key === 'bulls-and-cows.scores' ? value : null),
    setItem: (key: string, nextValue: string) => {
      if (key === 'bulls-and-cows.scores') {
        value = nextValue;
      }
    },
  };
};

const createScore = (
  attempts: number,
  durationMs: number,
  completedAt: number,
): ScoreRecord => ({
  attempts,
  durationMs,
  length: 4,
  base: 10,
  completedAt,
});

describe('leaderboard', () => {
  it('returns an empty list when no scores have been saved', () => {
    expect(loadScores(createMemoryStorage())).toEqual([]);
  });

  it('stores scores sorted by attempts and then duration', () => {
    const storage = createMemoryStorage();
    const slower = createScore(3, 9000, 3);
    const faster = createScore(3, 5000, 2);
    const fewerAttempts = createScore(2, 12000, 1);

    saveScore(slower, storage);
    saveScore(fewerAttempts, storage);
    saveScore(faster, storage);

    expect(loadScores(storage)).toEqual([fewerAttempts, faster, slower]);
  });

  it('keeps only the highest-ranked scores up to the requested limit', () => {
    const storage = createMemoryStorage();

    saveScore(createScore(4, 1000, 1), storage, 2);
    saveScore(createScore(2, 9000, 2), storage, 2);
    saveScore(createScore(3, 2000, 3), storage, 2);

    expect(loadScores(storage)).toEqual([
      createScore(2, 9000, 2),
      createScore(3, 2000, 3),
    ]);
  });

  it('reports malformed saved data instead of silently discarding it', () => {
    expect(() => loadScores(createMemoryStorage('{'))).toThrow(
      'Saved leaderboard data is invalid.',
    );
    expect(() => loadScores(createMemoryStorage('[{"attempts":0}]'))).toThrow(
      'Saved leaderboard data is invalid.',
    );
  });
});
