# Go imports search

## ⚠️ Deprecation notice

**Sourcegraph extensions have been deprecated with the September 2022 Sourcegraph
release. [Learn more](https://docs.sourcegraph.com/extensions/deprecation).**

The repo and the docs below are kept to support older Sourcegraph versions.

## Description

Lets you easily search for all files using a Go package. Adds a new operator `go.imports:` for all import statements of the package passed to the operator.

This extension also adds a "See all usages" link at the end of import statement lines, which will execute the `go.imports` search for the relevant package. To enable "See all usages" links, add `"goImports.showAllUsagesLinks": true` in your user settings.

## Prerequisites

Sourcegraph extensions are written in TypeScript and are distributed as bundled JavaScript files that run on the client. For creation, publishing, and viewing, you need:

- **Creation**: Install [Node.js](https://nodejs.org).
- **Publishing**: Install the [Sourcegraph CLI (`src`)](https://github.com/sourcegraph/src-cli#installation) and create a [Sourcegraph.com account](https://sourcegraph.com/sign-up).
- **Viewing**: Install the Sourcegraph extension for [Chrome](https://chrome.google.com/webstore/detail/sourcegraph/dgjhfomjieaadpoljlnidmbgkdffpack) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/sourcegraph/).

## Set up

```
npm install
```

## Lint and type check

```
npm run tslint
npm run typecheck
```

## Publish

```
src extensions publish
```

## Sourcegraph extension API

Visit the [Sourcegraph extension documentation](https://github.com/sourcegraph/sourcegraph-extension-docs) and check out some [Sourcegraph extension samples](https://github.com/sourcegraph/sourcegraph-extension-samples).
