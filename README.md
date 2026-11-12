# Bulls and Cows

## Local development

```sh
npm ci
npm run build
npm test
npm run lint
```

Open `index.html` with Live Server to play locally.

## GitHub Pages deployment

The `Deploy to GitHub Pages` workflow runs tests, builds the application, and
deploys the generated `dist/` artifact whenever `bulls-and-cows` is pushed.
The build artifact contains its own `index.html`, compiled JavaScript, and CSS;
`dist/` does not need to be committed.

For the first deployment, open the repository's **Settings → Pages** and set
the build and deployment source to **GitHub Actions**. You can also start the
workflow manually from the Actions tab.

## Behavioral checklist

- [x] Choose BIN, OCT, DEC, or HEX; only lengths valid for the selected base
      are enabled (BIN allows length 2 only).
- [x] The secret contains unique digits, and guess input filters invalid and
      duplicate characters case-insensitively.
- [x] Each valid guess displays the number of bulls and cows; duplicate guesses
      cannot be submitted again.
- [x] Guessing the secret ends the round; the result, attempt count, and elapsed
      time are displayed, and further input is disabled.
- [x] Guess history preserves submission order and each turn's result; the
      timer updates during play.
- [x] Scores are stored in `localStorage` as one list, ranked by attempts and
      time, and include the secret length and numeral base.
- [x] Start a new game or return to settings without reloading the page.

## TDD commit order

For each pair, the tests (RED) were committed before the implementation
(GREEN). Hashes are shown in Git's abbreviated format:

| Function / behavior         | Tests (RED)                                         | Implementation (GREEN) |
| --------------------------- | --------------------------------------------------- | ---------------------- |
| `createDigitValidator`      | `6116764`                                           | `a108000`              |
| `generateSecret`            | `ee10b64`                                           | `415ac72`              |
| `evaluateGuess`             | `4ae1466` (`0a462f0` — expectation correction)      | `8225d1c`              |
| `isValidGuess`              | `7c7520f` (`dd1bb07`, `a76208e` — test corrections) | `f63f80b`              |
| `countPossibleSecrets`      | `4ce75b5`                                           | `7b33c5f`              |
| Game state transitions      | `bd506ed`                                           | `623289f`              |
| Leaderboard storage         | `f9ddd0b`                                           | `916436c`              |
| Rejecting duplicate guesses | `76311df`                                           | `d6f291c`              |

The commit history confirms that each RED commit precedes its corresponding
GREEN commit.
