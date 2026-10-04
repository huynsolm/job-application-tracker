# Job Application Tracker — Product Spec

## Problem
Job applications, deadlines, and follow-ups are commonly tracked across notes and browser tabs. This makes deadlines easy to miss and prevents a clear view of active applications.

## MVP
A private, browser-only tracker for job applications.

### Inputs
- Company name (required)
- Role (required)
- Posting URL (optional, valid `http(s)` URL)
- Deadline (optional date)
- Status: `Saved`, `Applied`, `Interview`, `Offer`, `Closed`
- Notes (optional)

### Outputs
- A sorted application list, nearest deadline first.
- Summary counts for active statuses.
- Search by company or role and filtering by status.
- Status update and deletion controls.
- One-click `.ics` export for an application with a deadline.

## Acceptance criteria
- Invalid required fields are not saved and have an accessible error message.
- Records persist through browser reloads with `localStorage`.
- Search and status filters combine correctly.
- Calendar export contains the company, role, and deadline.
- Empty, loading-free local state is explained to the user.

## Out of scope
- Accounts, login, cloud sync, reminders, scraping job pages, multi-user sharing, resume uploads, and automatic email sending.