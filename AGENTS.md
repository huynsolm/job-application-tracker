# AGENTS.md

## Source of truth
- Product scope: `docs/product-spec.md`
- UI and accessibility rules: `docs/design.md`
- Structure: `docs/architecture.md`
- Execution order: `docs/plans/mvp.md`
- Live status: `TODO.md`

## Stack
- Static HTML, CSS, and browser JavaScript.
- Node built-in test runner; no runtime dependencies.

## Rules
- Keep application data only in the browser `localStorage`; do not send job or personal data to a server.
- Implement behavior test-first in `tests/` and run tests before marking a task complete.
- Use semantic landmarks, visible focus styles, keyboard-operable controls, and 44px minimum primary targets on mobile.
- Do not add accounts, remote storage, scraping, or calendar API access to the MVP.

## Verification gates
Run before completion:
```bash
npm test
npm run lint
```
Then open `index.html` in a browser and verify add, filter, status update, and calendar export.

## Definition of done
The tracker can save an application, filter it, change its status, export a selected deadline as an `.ics` file, and preserve data across reloads.