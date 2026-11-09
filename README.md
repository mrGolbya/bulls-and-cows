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
