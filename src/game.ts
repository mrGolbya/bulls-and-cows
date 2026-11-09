import { evaluateGuess } from './evaluateGuess.js';
import { isValidGuess } from './isValidGuess.js';

export type GuessEntry = {
  guess: string;
  bulls: number;
  cows: number;
  submittedAt: number;
};

export type GameState = {
  secret: string;
  length: number;
  base: number;
  status: 'playing' | 'won';
  history: GuessEntry[];
  startedAt: number;
  finishedAt: number | null;
};

export type SubmitGuessResult =
  | { ok: true; state: GameState }
  | {
      ok: false;
      state: GameState;
      reason: 'invalid-guess' | 'game-over';
    };

/**
 * Creates an initial immutable game state.
 * Time complexity: O(1).
 */
export function createGameState(
  secret: string,
  length: number,
  base: number,
  startedAt: number,
): GameState {
  return {
    secret,
    length,
    base,
    status: 'playing',
    history: [],
    startedAt,
    finishedAt: null,
  };
}

/**
 * Validates and records a guess, returning a new immutable game state.
 * Time complexity: O(n²); space complexity: O(n).
 */
export function submitGuess(
  state: GameState,
  guess: string,
  submittedAt: number,
): SubmitGuessResult {
  if (state.status === 'won') {
    return { ok: false, state, reason: 'game-over' };
  }

  if (!isValidGuess(guess, state.length, state.base)) {
    return { ok: false, state, reason: 'invalid-guess' };
  }

  const { bulls, cows } = evaluateGuess(state.secret, guess);
  const won = bulls === state.length;
  const entry: GuessEntry = { guess, bulls, cows, submittedAt };

  return {
    ok: true,
    state: {
      ...state,
      status: won ? 'won' : state.status,
      history: [...state.history, entry],
      finishedAt: won ? submittedAt : state.finishedAt,
    },
  };
}
