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

Workflows live under [`.github/workflows/`](.github/workflows/).

### Build and Test

[`build-test.yml`](.github/workflows/build-test.yml) — **Build and Test**

| Event | When it runs |
|-------|----------------|
| **Push** | To branches `main`, `master`, `develop`, or `ci` |
| **Pull request** | When the PR targets one of those same branches |

**Test job:** `npm ci`, then `npm test` (continues on failure until tests exist) on Ubuntu, Windows, and macOS, with Node 18.x and 20.x. Checkout includes **git submodules** (`recursive`).

**Build job:** runs after tests; `npm ci`, then `npm run build -- --linux` / `--win` / `--mac` on each OS. Uploads `dist/*` as workflow artifacts (7-day retention).

### Release

[`release.yml`](.github/workflows/release.yml) — **Release**

| Event | When it runs |
|-------|----------------|
| **Push** | **Tags** matching `v*` (for example `v1.0.5`) |

Builds on all three platforms with `npm ci`, submodules, and `npm run build -- --<platform> --publish always`, publishing to **GitHub Releases** using `GITHUB_TOKEN`.

**Draft vs published:** By default, electron-builder can create a **draft** release on GitHub. This repo sets `build.publish.releaseType` to **`release`** in [`package.json`](package.json) so each successful run **publishes the release immediately** (no extra “Publish release” click). Use **`draft`** instead if you prefer to review assets and edit notes before making the release public—then publish it manually on the Releases page.

**Version must match the tag.** [electron-builder](https://www.electron.build/) publishes using the **`version`** field in [`package.json`](package.json) (and the lockfile), not the git tag name. If the tag is `v1.0.5` but `package.json` still says `1.0.4`, artifacts attach to the **existing** GitHub release for **`1.0.4`** / **`v1.0.4`**, and a **new** release for the `v1.0.5` tag may not appear.

**Typical release steps:**

1. Bump the app version (keeps `package.json` and `package-lock.json` in sync):

   ```sh
   npm version 1.0.6 --no-git-tag-version
   ```

   Use the same semver as the tag you will create (tag `v1.0.6` → version **`1.0.6`**).

2. Commit the version bump, tag, and push:

   ```sh
   git add package.json package-lock.json
   git commit -m "chore: bump version to 1.0.6"
   git tag -a v1.0.6 -m "Release v1.0.6"
   git push origin <your-branch>
   git push origin v1.0.6
   ```

   Replace `<your-branch>` with the branch you commit on (for example `master` or `main`).
