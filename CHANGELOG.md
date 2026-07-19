# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The version in `manifest.json` is the source of truth — a release tag must match it.

## [Unreleased]

## [1.1.0] - 2026-07-20

### Added

- Gemini and Grok support. Gemini words its disclaimer with a comma rather than a full
  stop, so the pattern no longer requires trailing punctuation.
- Grok ships no disclaimer at all, so the extension writes one under its composer.

### Changed

- The button now waits for an actual answer before appearing, on every host.
- It is anchored to a rail matching the composer's own width instead of relying on each
  host's header slot — ChatGPT keeps its own disclaimer in that slot, and in an empty
  chat the slot sits somewhere else entirely.

## [1.0.0] - 2026-07-19

### Added

- Rewrites the footer disclaimer on ChatGPT and Claude: `X can make mistakes.` becomes
  `X makes mistakes.`, followed by a clown emoji.
- Gilded styling for the rewritten line — bold, with a slow gold band gliding across it.
- An "Improve answer" button above the composer that appends a firm double-check nudge
  to the prompt.
- Popup setting to turn off the button's arrival flash.
- Extension icons at 16/32/48/128.

[unreleased]: https://github.com/xkelxmc/makes-mistakes/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/xkelxmc/makes-mistakes/releases/tag/v1.1.0
[1.0.0]: https://github.com/xkelxmc/makes-mistakes/releases/tag/v1.0.0
