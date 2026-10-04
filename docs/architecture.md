# Architecture

## Data flow
`form input → validation → application object → localStorage → state render → card actions`

## Files
- `index.html`: semantic application shell.
- `styles.css`: responsive visual system.
- `src/tracker.js`: pure validation, sorting, filtering, ICS generation, and storage helpers.
- `src/app.js`: DOM event handlers and rendering.
- `tests/tracker.test.js`: Node tests for behavior.

## Storage
Key: `job-application-tracker:applications:v1`

Application shape:
```js
{ id, company, role, url, deadline, status, notes, createdAt }
```

## Calendar export
Generate a local RFC 5545-style all-day `VEVENT`. The browser downloads it with a `.ics` extension. No network connection is made.