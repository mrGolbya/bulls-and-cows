# Design

## Architecture

The project is split between pure game logic and browser UI:

- `src/generateSecret.ts`, `src/evaluateGuess.ts`, `src/isValidGuess.ts`,
  `src/createDigitValidator.ts`, `src/countPossibleSecrets.ts`, and `src/game.ts`
  implement the rules and immutable game state transitions without accessing the
  DOM.
- `src/app.ts` renders the settings, round, history, and leaderboard with DOM
  methods. `src/main.ts` mounts the app when a browser document is available.
- `src/leaderboard.ts` validates, sorts, and persists score records in
  `localStorage`.

The secret and guesses are strings of radix digits. Keeping them as strings
preserves leading zeroes, which are significant digits in a fixed-length
secret. A `GameState` stores the secret, selected length and base, current
status, start and finish timestamps, and `history: GuessRecord[]`. The history
is an ordered array because guesses are events in submission order: rendering
the round history is a direct iteration, and its length gives the attempt
count. Each submission creates a new array (`[...history, entry]`), so previous
state snapshots remain unchanged and can be safely inspected or tested.

The leaderboard uses one persisted array of `ScoreRecord` objects, rather than
separate lists or storage keys for each game mode. Each record includes
`attempts`, `durationMs`, `length`, `base`, and `completedAt`; length and base
let the same table display the context of every result. A single list provides
one consistent ranking across modes and keeps persistence and rendering
simple. Records are ranked first by fewer attempts and then by shorter time,
and only the top ten are retained by default. This is a deliberate global
ranking: the selected mode is shown as record metadata, not used to partition
or normalize scores.

## Algorithms and complexity

Let `n` be the secret length and `b` the numeral base.

| Function                               | Algorithm                                                                                                                                                                                                          | Time                                                                                                                                                         | Auxiliary space                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `generateSecret(length, base, random)` | Build the radix digit alphabet, choose a random index from the remaining digits, remove that digit immutably, and recurse until the secret is complete. Injecting `random` makes selection deterministic in tests. | `O(b × n)`: each of at most `n` recursive steps filters at most `b` digits.                                                                                  | `O(b × n)`: the remaining-digit arrays are recreated at each step.                                     |
| `evaluateGuess(secret, guess)`         | Normalize both values to lowercase. A `reduce` counts position matches (bulls); a `filter` and membership checks count shared digits, then bulls are subtracted to get cows.                                       | `O(n²)`: each of `n` guess digits can scan the secret with `includes`.                                                                                       | `O(n)`: normalized digit arrays are created.                                                           |
| `isValidGuess(guess, length, base)`    | Reject invalid parameters and length first; normalize digits, validate each with `createDigitValidator`, then compare the digit count with a `Set` of unique digits.                                               | `O(n × b)`: each digit check uses `includes` on the generated radix alphabet. In the supported game bases (2, 8, 10, 16), `b` is bounded, so this is `O(n)`. | `O(n + b)`: normalized guess digits and the validator alphabet.                                        |
| `countPossibleSecrets(length, base)`   | Recursively applies `P(b, n) = b × P(b − 1, n − 1)`, with the one-digit case as the base case. A module-level `Map` caches results by `(length, base)`.                                                            | `O(n)` for a cache miss; `O(1)` average lookup for a cached pair.                                                                                            | `O(n)` recursion depth for a cache miss, plus `O(k)` persistent cache for `k` distinct argument pairs. |

`createDigitValidator(base)` builds the accepted digit alphabet once per
validator. Creation uses `O(b)` time and space; each predicate call uses
`O(b)` time because it searches that alphabet with `includes`.

## Functional and clean-code decisions

- **Dependency injection:** `generateSecret` accepts a random source instead
  of hard-coding randomness. Its tests use a deterministic source.
- **Pure rule functions:** digit validation, guess evaluation, guess validation,
  and secret counting do not read or modify browser state.
- **Higher-order array operations:** `evaluateGuess` uses `reduce`, `filter`,
  `map`, and `includes`; it does not use loops to count matches.
- **Currying / reusable predicate:** `createDigitValidator(base)` returns a
  character predicate. It is shared by `isValidGuess` and UI input filtering.
- **Immutability:** `submitGuess` returns a new state and appends history by
  creating a new array. Previous state and history entries remain unchanged.
- **Single responsibility:** rule calculations live outside `app.ts`;
  `leaderboard.ts` owns persistence and ranking, while `app.ts` handles DOM and
  user interaction.
- **Explicit failures:** invalid game parameters throw at the function
  boundary. Invalid guesses return a typed reason, and malformed leaderboard
  data or storage errors are surfaced in the UI rather than silently ignored.
- **Accessible, safe rendering:** UI text is created with `textContent` and
  standard DOM methods; dynamic markup does not use `innerHTML`.

## Test-driven development

Each core function has a test commit before its implementation commit. The
commit hashes and ordering are listed in the README's TDD evidence section.
The test runner is Vitest; `npm test` executes the suite, and the Husky
pre-push hook runs it before publishing commits.
