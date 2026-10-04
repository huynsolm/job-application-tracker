import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCalendarEvent,
  filterApplications,
  sortApplicationsByDeadline,
  validateApplication,
} from '../src/tracker.js';

const base = {
  company: 'Nous Research',
  role: 'Web Publisher',
  url: 'https://example.com/jobs/web-publisher',
  deadline: '2026-10-10',
  status: 'Saved',
  notes: 'Portfolio link included',
};

test('validateApplication accepts required fields and a valid URL', () => {
  assert.deepEqual(validateApplication(base), {});
});

test('validateApplication reports missing company, role, and malformed URL', () => {
  assert.deepEqual(validateApplication({ ...base, company: ' ', role: '', url: 'not-a-url' }), {
    company: '회사명을 입력해 주세요.',
    role: '지원 직무를 입력해 주세요.',
    url: '공고 URL은 http 또는 https 주소여야 합니다.',
  });
});

test('sortApplicationsByDeadline puts upcoming dates before undated records', () => {
  const sorted = sortApplicationsByDeadline([
    { id: 'none', deadline: '' },
    { id: 'late', deadline: '2026-11-01' },
    { id: 'soon', deadline: '2026-10-05' },
  ]);
  assert.deepEqual(sorted.map(({ id }) => id), ['soon', 'late', 'none']);
});

test('filterApplications combines status and case-insensitive search', () => {
  const filtered = filterApplications([
    { company: 'Nous Research', role: 'Web Publisher', status: 'Applied' },
    { company: 'OpenAI', role: 'Frontend Engineer', status: 'Saved' },
    { company: 'Another Nous', role: 'Designer', status: 'Saved' },
  ], { query: 'nous', status: 'Saved' });
  assert.deepEqual(filtered.map(({ company }) => company), ['Another Nous']);
});

test('buildCalendarEvent creates an all-day deadline event', () => {
  const calendar = buildCalendarEvent(base);
  assert.match(calendar, /BEGIN:VCALENDAR/);
  assert.match(calendar, /SUMMARY:마감: Nous Research — Web Publisher/);
  assert.match(calendar, /DTSTART;VALUE=DATE:20261010/);
  assert.match(calendar, /DTEND;VALUE=DATE:20261011/);
});
