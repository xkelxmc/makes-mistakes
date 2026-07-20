# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The version in `manifest.json` is the source of truth — a release tag must match it.

## [Unreleased]

## [1.2.0] - 2026-07-20

### Fixed

- The rewrite now only touches each host's own disclaimer element. It used to run over
  every text node on the page, so quoting "ChatGPT can make mistakes" in the composer
  had the word silently removed from what you were about to send, and the same sentence
  inside an answer was rewritten mid-paragraph.
- Colours follow the chat's own theme rather than the operating system's. With ChatGPT
  in light mode on a dark-mode machine the rewritten line was near-white on white.
- On Claude the button appeared in an empty chat and while an answer was still
  streaming; it now waits for the answer to finish.
- The button and its rail are dropped when a thread is cleared instead of lingering
  until an unrelated change happened to redraw them.
- The popup's flash setting applies to tabs that are already open.

### Changed

- The archive holds `manifest.json` at its root, as the Chrome Web Store expects.
- The manifest description mentions the button, not only the rewritten disclaimer.

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

[unreleased]: https://github.com/xkelxmc/makes-mistakes/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/xkelxmc/makes-mistakes/releases/tag/v1.2.0
[1.1.0]: https://github.com/xkelxmc/makes-mistakes/releases/tag/v1.1.0
[1.0.0]: https://github.com/xkelxmc/makes-mistakes/releases/tag/v1.0.0
