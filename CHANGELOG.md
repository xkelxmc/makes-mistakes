# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The version in `manifest.json` is the source of truth — a release tag must match it.

## [Unreleased]

## [1.0.0] - 2026-07-19

### Added

- Rewrites the footer disclaimer on ChatGPT and Claude: `X can make mistakes.` becomes
  `X makes mistakes.`, followed by a clown emoji.
- Gilded styling for the rewritten line — bold, with a slow gold band gliding across it.
- An "Improve answer" button above the composer that appends a firm double-check nudge
  to the prompt.
- Popup setting to turn off the button's arrival flash.
- Extension icons at 16/32/48/128.
- Landing page (TanStack Start, SSR) with a live demo of the rewrite.

[unreleased]: https://github.com/xkelxmc/makes-mistakes/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/xkelxmc/makes-mistakes/releases/tag/v1.0.0
