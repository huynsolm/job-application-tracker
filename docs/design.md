# Design

## Information hierarchy
1. Header: product name and privacy statement.
2. Summary: active application and interview counts.
3. Application form: short, explicit labels and validation feedback.
4. Filters: search and status filter.
5. List: company, role, status, deadline, links, notes, actions.

## Responsive behavior
- Desktop: form fields use a two-column grid; application cards use a compact metadata row.
- Mobile: one column; full-width form controls and action buttons.
- No horizontal scrolling at 390px viewport width.

## Accessibility
- Semantic `header`, `main`, `section`, `form`, `label`, `button`, and `article` structure.
- Form messages announced with `aria-live`.
- Visible keyboard focus for links and controls.
- Status uses text, not color alone.
- Buttons meet 44px minimum touch target.