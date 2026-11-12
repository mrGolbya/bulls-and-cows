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

## Поведенческий чек-лист

- [x] Выбор BIN, OCT, DEC или HEX; доступны только длины, допустимые для
      выбранного основания (в BIN — только длина 2).
- [x] Секрет состоит из уникальных цифр, а ввод попытки фильтрует недопустимые
      и повторяющиеся символы без учета регистра.
- [x] После корректной попытки показываются быки и коровы; одинаковую попытку
      нельзя отправить повторно.
- [x] Угаданный секрет завершает раунд; после победы отображаются результат,
      число попыток и время, а ввод прекращается.
- [x] История попыток сохраняет порядок отправки и результаты каждого хода;
      таймер обновляется во время игры.
- [x] Рекорды сохраняются в `localStorage` единым списком, показываются по
      числу попыток и времени и содержат длину и систему счисления.
- [x] Можно перейти к настройкам и начать новую игру без перезагрузки страницы.

## Подтверждение порядка TDD-коммитов

Для каждой пары сначала зафиксированы тесты (RED), затем реализация (GREEN).
Хэши приведены в сокращенном формате Git:

| Функция / поведение          | Тесты (RED)                                         | Реализация (GREEN) |
| ---------------------------- | --------------------------------------------------- | ------------------ |
| `createDigitValidator`       | `6116764`                                           | `a108000`          |
| `generateSecret`             | `ee10b64`                                           | `415ac72`          |
| `evaluateGuess`              | `4ae1466` (`0a462f0` — уточнение ожиданий)          | `8225d1c`          |
| `isValidGuess`               | `7c7520f` (`dd1bb07`, `a76208e` — уточнения тестов) | `f63f80b`          |
| `countPossibleSecrets`       | `4ce75b5`                                           | `7b33c5f`          |
| Переходы состояния игры      | `bd506ed`                                           | `623289f`          |
| Хранение таблицы рекордов    | `f9ddd0b`                                           | `916436c`          |
| Отклонение повторных попыток | `76311df`                                           | `d6f291c`          |

Порядок каждой пары подтверждается историей коммитов: RED-коммит предшествует
соответствующему GREEN-коммиту.
