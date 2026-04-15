# Lode Runner Electron

An [Electron](https://www.electronjs.org/) wrapper for [Lode Runner Total Recall](https://github.com/jungx098/LodeRunner_TotalRecall).

## Requirements

- [Node.js](https://nodejs.org/) 18.x or 20.x (matches CI)

## Install

```sh
npm install
```

## Run

```sh
npm start
```

## Build

Package the app for your current platform (output under `dist/`):

```sh
npm run build
```

Build for macOS, Windows, and Linux in one go:

```sh
npm run build:all
```

## Tests

```sh
npm test
```

The test script is still a placeholder; CI runs it with `continue-on-error` until real tests exist.

## Continuous integration

[GitHub Actions](https://docs.github.com/en/actions) workflow **Build and Test** (`.github/workflows/build-test.yml`):

- **Triggers:** pushes and pull requests to `main`, `master`, `develop`, or `ci`.
- **Test job:** `npm install` and `npm test` on Ubuntu, Windows, and macOS, with Node 18.x and 20.x.
- **Build job:** after tests, `npm run build` per platform (`--linux`, `--win`, `--mac`) with `--publish never`, then uploads `dist/*` as workflow artifacts (7-day retention).
