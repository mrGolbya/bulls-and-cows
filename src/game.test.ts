import { describe, expect, it } from 'vitest';
import { createGameState, submitGuess } from './game';

describe('game state', () => {
  it('creates a new round with immutable empty history', () => {
    const state = createGameState('1234', 4, 10, 1000);

    expect(state).toEqual({
      secret: '1234',
      length: 4,
      base: 10,
      status: 'playing',
      history: [],
      startedAt: 1000,
      finishedAt: null,
    });
  });

  it('appends a valid guess and leaves the previous state unchanged', () => {
    const initial = createGameState('1234', 4, 10, 1000);
    const result = submitGuess(initial, '1325', 2000);

    expect(result).toEqual({
      ok: true,
      state: {
        ...initial,
        history: [{ guess: '1325', bulls: 1, cows: 2, submittedAt: 2000 }],
      },
    });
    expect(initial.history).toEqual([]);
  });

  it('rejects invalid guesses without changing game state', () => {
    const initial = createGameState('1234', 4, 10, 1000);
    const result = submitGuess(initial, '1123', 2000);

    expect(result).toEqual({
      ok: false,
      state: initial,
      reason: 'invalid-guess',
    });
  });

  it('finishes the game when the guess matches the secret', () => {
    const initial = createGameState('a2F9', 4, 16, 1000);
    const result = submitGuess(initial, 'A2f9', 2500);

    expect(result).toEqual({
      ok: true,
      state: {
        ...initial,
        status: 'won',
        history: [{ guess: 'A2f9', bulls: 4, cows: 0, submittedAt: 2500 }],
        finishedAt: 2500,
      },
    });
  });

  it('rejects further guesses after the game is won', () => {
    const initial = createGameState('1234', 4, 10, 1000);
    const win = submitGuess(initial, '1234', 2000);

    if (!win.ok) {
      throw new Error('Expected the winning guess to be accepted.');
    }

    expect(submitGuess(win.state, '4321', 3000)).toEqual({
      ok: false,
      state: win.state,
      reason: 'game-over',
    });
  });
});
