# Job Application Tracker Implementation Plan

> **For Hermes:** Execute task-by-task with strict TDD.

**Goal:** Build a private local tracker for job applications, deadlines, and follow-ups.

**Architecture:** Pure data helpers are tested in Node. A small browser layer renders and persists state through `localStorage`.

**Tech Stack:** HTML, CSS, browser JavaScript, Node test runner.

---

### Task 1: Establish project shell
Create manifest, ignore rules, semantic HTML, CSS tokens, and empty-state UI. Verify the page opens without console errors.

### Task 2: Implement data helpers with TDD
Write failing tests for application validation, deadline sorting, combined filtering, and ICS generation. Implement minimal pure helpers in `src/tracker.js` and run `npm test`.

### Task 3: Implement form and persistence with TDD
Add DOM logic for saving validated applications to `localStorage`, rendering cards, and maintaining an accessible message. Verify manually in a browser.

### Task 4: Add lifecycle actions
Implement status updates, deletion, and deadline calendar download. Verify with tests and browser interactions.

### Task 5: Final QA
Run tests and lint; check desktop and mobile browser behavior; update `TODO.md` with verified evidence.