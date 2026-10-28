# Deepsea Playground

[English](README.md) | [简体中文](README.zh-CN.md)

A private Rsbuild-powered React app for manual interaction and visual verification against actual workspace libraries. The current example demonstrates ScrollMask.

## Run

```sh
# From the repository root
pnpm install --frozen-lockfile
pnpm dev
```

## Development

Edit src/App.tsx to add examples; static assets live in public/. The dev command builds workspace dependencies before watching the app. Do not install the playground as a dependency.

## Validation

```sh
pnpm --filter @1adybug/playground test
pnpm --filter @1adybug/playground test:types
pnpm --filter @1adybug/playground build
```

Automated tests mount real components and check key DOM behavior and observer cleanup. Browser visuals, scrolling, media codecs and real-device interaction require manual verification. See the [repository guide](../../README.md) for requirements and full commands.
