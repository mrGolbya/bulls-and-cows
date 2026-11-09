import { countPossibleSecrets } from './countPossibleSecrets.js';
import { createDigitValidator } from './createDigitValidator.js';
import { generateSecret } from './generateSecret.js';
import { createGameState, submitGuess, type GameState } from './game.js';
import { loadScores, saveScore, type ScoreRecord } from './leaderboard.js';

const BASES = [
  { value: 2, label: 'BIN (2)' },
  { value: 8, label: 'OCT (8)' },
  { value: 10, label: 'DEC (10)' },
  { value: 16, label: 'HEX (16)' },
];
const LENGTHS = [2, 3, 4, 5, 6];

const createElement = <Tag extends keyof HTMLElementTagNameMap>(
  document: Document,
  tag: Tag,
  text?: string,
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
};

const getBaseLabel = (base: number): string =>
  BASES.find((option) => option.value === base)?.label ?? String(base);

const formatDuration = (durationMs: number): string => {
  const totalSeconds = Math.floor(Math.max(0, durationMs) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const renderLeaderboard = (
  document: Document,
  scores: ScoreRecord[],
  title: string,
): HTMLElement => {
  const section = createElement(document, 'section');
  section.className = 'panel';
  section.append(createElement(document, 'h2', title));

  if (scores.length === 0) {
    section.append(
      createElement(document, 'p', 'Рекордов пока нет. Станьте первым!'),
    );
    return section;
  }

  const table = createElement(document, 'table');
  const head = createElement(document, 'thead');
  const headerRow = createElement(document, 'tr');
  ['#', 'Попытки', 'Время', 'Длина', 'Система'].forEach((label) => {
    headerRow.append(createElement(document, 'th', label));
  });
  head.append(headerRow);
  table.append(head);

  const body = createElement(document, 'tbody');
  scores.forEach((score, index) => {
    const row = createElement(document, 'tr');
    [
      String(index + 1),
      String(score.attempts),
      formatDuration(score.durationMs),
      String(score.length),
      getBaseLabel(score.base),
    ].forEach((value) => row.append(createElement(document, 'td', value)));
    body.append(row);
  });
  table.append(body);
  section.append(table);

  return section;
};

export function mountGame(document: Document): void {
  let game: GameState | null = null;
  let timer: number | undefined;
  let scoreSaveError: string | null = null;

  const stopTimer = (): void => {
    if (timer !== undefined) {
      document.defaultView?.clearInterval(timer);
      timer = undefined;
    }
  };

  const showScreen = (screen: HTMLElement): void => {
    document.body.replaceChildren(screen);
  };

  const showSettings = (): void => {
    stopTimer();
    game = null;

    const screen = createElement(document, 'main');
    screen.className = 'app-shell';
    screen.append(
      createElement(document, 'h1', 'Быки и коровы'),
      createElement(
        document,
        'p',
        'Угадайте секрет из уникальных цифр. После каждой попытки вы узнаете количество быков и коров.',
      ),
    );

    const settings = createElement(document, 'section');
    settings.className = 'panel settings';
    settings.append(createElement(document, 'h2', 'Новая игра'));

    const baseSelect = createElement(document, 'select');
    baseSelect.id = 'base';
    BASES.forEach(({ value, label }) => {
      const option = createElement(document, 'option', label);
      option.value = String(value);
      baseSelect.append(option);
    });
    baseSelect.value = '10';

    const baseLabel = createElement(document, 'label', 'Система счисления');
    baseLabel.htmlFor = baseSelect.id;
    baseLabel.append(baseSelect);

    const lengthSelect = createElement(document, 'select');
    lengthSelect.id = 'length';
    LENGTHS.forEach((length) => {
      const option = createElement(document, 'option', String(length));
      option.value = String(length);
      lengthSelect.append(option);
    });
    lengthSelect.value = '4';

    const lengthLabel = createElement(document, 'label', 'Длина секрета');
    lengthLabel.htmlFor = lengthSelect.id;
    lengthLabel.append(lengthSelect);

    const possibleSecrets = createElement(document, 'p');
    possibleSecrets.className = 'muted';

    const updateSettings = (): void => {
      const base = Number(baseSelect.value);
      Array.from(lengthSelect.options).forEach((option) => {
        option.disabled = Number(option.value) > base;
      });

      if (lengthSelect.selectedOptions[0]?.disabled) {
        lengthSelect.value = String(
          Math.min(base, LENGTHS[LENGTHS.length - 1]),
        );
      }

      possibleSecrets.textContent = `Возможных секретов: ${countPossibleSecrets(
        Number(lengthSelect.value),
        base,
      ).toLocaleString('ru-RU')}`;
    };

    baseSelect.addEventListener('change', updateSettings);
    lengthSelect.addEventListener('change', updateSettings);
    updateSettings();

    const startButton = createElement(document, 'button', 'Начать игру');
    startButton.type = 'button';
    startButton.addEventListener('click', () => {
      const base = Number(baseSelect.value);
      const length = Number(lengthSelect.value);
      game = createGameState(
        generateSecret(length, base),
        length,
        base,
        Date.now(),
      );
      scoreSaveError = null;
      showGame();
    });

    settings.append(baseLabel, lengthLabel, possibleSecrets, startButton);

    let scoresPanel: HTMLElement;
    try {
      scoresPanel = renderLeaderboard(
        document,
        loadScores(),
        'Таблица рекордов',
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Неизвестная ошибка хранения.';
      scoresPanel = createElement(document, 'section');
      scoresPanel.className = 'panel';
      scoresPanel.append(
        createElement(document, 'h2', 'Таблица рекордов'),
        createElement(
          document,
          'p',
          `Не удалось загрузить рекорды: ${message}`,
        ),
      );
    }

    screen.append(settings, scoresPanel);
    showScreen(screen);
  };

  const showGame = (): void => {
    stopTimer();
    if (game === null) {
      showSettings();
      return;
    }

    const currentGame = game;
    const screen = createElement(document, 'main');
    screen.className = 'app-shell';
    screen.append(createElement(document, 'h1', 'Быки и коровы'));

    const summary = createElement(document, 'section');
    summary.className = 'panel game-summary';
    summary.append(
      createElement(
        document,
        'p',
        `Система: ${getBaseLabel(currentGame.base)} · Длина: ${currentGame.length}`,
      ),
    );
    const attempts = createElement(
      document,
      'p',
      `Попыток: ${currentGame.history.length}`,
    );
    const elapsed = createElement(document, 'p');
    elapsed.setAttribute('aria-live', 'polite');
    const updateElapsed = (): void => {
      const endTime = currentGame.finishedAt ?? Date.now();
      elapsed.textContent = `Время: ${formatDuration(endTime - currentGame.startedAt)}`;
    };
    updateElapsed();
    summary.append(attempts, elapsed);
    screen.append(summary);

    if (currentGame.status === 'playing') {
      const form = createElement(document, 'form');
      form.className = 'panel guess-form';
      const input = createElement(document, 'input');
      input.id = 'guess';
      input.name = 'guess';
      input.type = 'text';
      input.autocomplete = 'off';
      input.maxLength = currentGame.length;
      input.setAttribute('aria-describedby', 'guess-error');
      const label = createElement(document, 'label', 'Ваша попытка');
      label.htmlFor = input.id;
      label.append(input);

      const errorMessage = createElement(document, 'p');
      errorMessage.id = 'guess-error';
      errorMessage.className = 'error';
      errorMessage.setAttribute('role', 'alert');

      input.addEventListener('input', () => {
        const isValidDigit = createDigitValidator(currentGame.base);
        const seen = new Set<string>();
        const filtered = [...input.value]
          .filter((digit) => {
            const normalized = digit.toLowerCase();
            if (!isValidDigit(digit) || seen.has(normalized)) {
              return false;
            }
            seen.add(normalized);
            return true;
          })
          .slice(0, currentGame.length)
          .join('');
        if (input.value !== filtered) {
          input.value = filtered;
        }
        errorMessage.textContent = '';
      });

      const submitButton = createElement(document, 'button', 'Проверить');
      submitButton.type = 'submit';
      form.append(label, submitButton, errorMessage);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const result = submitGuess(
          game ?? currentGame,
          input.value,
          Date.now(),
        );
        if (!result.ok) {
          errorMessage.textContent =
            result.reason === 'invalid-guess'
              ? `Введите ${currentGame.length} уникальные допустимые цифры.`
              : 'Игра уже завершена.';
          return;
        }

        const wasPlaying = game?.status === 'playing';
        game = result.state;
        if (wasPlaying && game.status === 'won' && game.finishedAt !== null) {
          const record = {
            attempts: game.history.length,
            durationMs: game.finishedAt - game.startedAt,
            length: game.length,
            base: game.base,
            completedAt: game.finishedAt,
          };
          try {
            saveScore(record);
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : 'Неизвестная ошибка хранения.';
            scoreSaveError = `Рекорд не удалось сохранить: ${message}`;
          }
        }
        showGame();
      });
      screen.append(form);

      timer = document.defaultView?.setInterval(updateElapsed, 1000);
    } else {
      const result = createElement(document, 'section');
      result.className = 'panel result';
      result.append(
        createElement(document, 'h2', 'Вы выиграли!'),
        createElement(
          document,
          'p',
          `Секрет: ${currentGame.secret.toUpperCase()}`,
        ),
        createElement(document, 'p', `Попыток: ${currentGame.history.length}`),
        createElement(
          document,
          'p',
          `Время: ${formatDuration(
            (currentGame.finishedAt ?? currentGame.startedAt) -
              currentGame.startedAt,
          )}`,
        ),
      );
      if (scoreSaveError !== null) {
        const saveError = createElement(document, 'p', scoreSaveError);
        saveError.className = 'error';
        result.append(saveError);
      }
      try {
        result.append(renderLeaderboard(document, loadScores(), 'Рекорды'));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Неизвестная ошибка хранения.';
        result.append(
          createElement(
            document,
            'p',
            `Не удалось загрузить рекорды: ${message}`,
          ),
        );
      }
      screen.append(result);
    }

    const newGameButton = createElement(document, 'button', 'Новая игра');
    newGameButton.type = 'button';
    newGameButton.addEventListener('click', showSettings);
    screen.append(newGameButton);

    const historyPanel = createElement(document, 'section');
    historyPanel.className = 'panel';
    historyPanel.append(createElement(document, 'h2', 'История попыток'));
    if (currentGame.history.length === 0) {
      historyPanel.append(createElement(document, 'p', 'Попыток пока нет.'));
    } else {
      const table = createElement(document, 'table');
      const head = createElement(document, 'thead');
      const headerRow = createElement(document, 'tr');
      ['#', 'Попытка', 'Быки', 'Коровы'].forEach((label) => {
        headerRow.append(createElement(document, 'th', label));
      });
      head.append(headerRow);
      table.append(head);

      const body = createElement(document, 'tbody');
      currentGame.history.forEach((entry, index) => {
        const row = createElement(document, 'tr');
        [
          String(index + 1),
          entry.guess.toUpperCase(),
          String(entry.bulls),
          String(entry.cows),
        ].forEach((value) => row.append(createElement(document, 'td', value)));
        body.append(row);
      });
      table.append(body);
      historyPanel.append(table);
    }
    screen.append(historyPanel);
    showScreen(screen);
  };

  showSettings();
}
