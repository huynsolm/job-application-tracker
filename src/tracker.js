export const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Closed'];

export function validateApplication(application) {
  const errors = {};
  if (!application.company?.trim()) errors.company = '회사명을 입력해 주세요.';
  if (!application.role?.trim()) errors.role = '지원 직무를 입력해 주세요.';
  if (application.url?.trim()) {
    try {
      const parsed = new URL(application.url);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol');
    } catch {
      errors.url = '공고 URL은 http 또는 https 주소여야 합니다.';
    }
  }
  return errors;
}

export function sortApplicationsByDeadline(applications) {
  return [...applications].sort((left, right) => {
    if (!left.deadline && !right.deadline) return 0;
    if (!left.deadline) return 1;
    if (!right.deadline) return -1;
    return left.deadline.localeCompare(right.deadline);
  });
}

export function filterApplications(applications, { query = '', status = 'All' } = {}) {
  const needle = query.trim().toLocaleLowerCase();
  return applications.filter((application) => {
    const matchesStatus = status === 'All' || application.status === status;
    const haystack = `${application.company} ${application.role}`.toLocaleLowerCase();
    return matchesStatus && (!needle || haystack.includes(needle));
  });
}

function compactDate(date) {
  return date.replaceAll('-', '');
}

function nextDate(date) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

function escapeIcs(value) {
  return String(value).replaceAll('\\', '\\\\').replaceAll(',', '\\,').replaceAll(';', '\\;').replaceAll('\n', '\\n');
}

export function buildCalendarEvent(application) {
  if (!application.deadline) return '';
  const description = [application.notes, application.url].filter(Boolean).join('\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Job Application Tracker//KO',
    'BEGIN:VEVENT',
    `UID:${application.id ?? 'application'}@job-application-tracker`,
    `DTSTART;VALUE=DATE:${compactDate(application.deadline)}`,
    `DTEND;VALUE=DATE:${compactDate(nextDate(application.deadline))}`,
    `SUMMARY:${escapeIcs(`마감: ${application.company} — ${application.role}`)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function serializeApplications(applications) {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), applications }, null, 2);
}

export function deserializeApplications(json) {
  let backup;
  try { backup = JSON.parse(json); } catch { throw new Error('백업 파일을 읽을 수 없습니다. JSON 파일인지 확인해 주세요.'); }
  if (backup?.version !== 1 || !Array.isArray(backup.applications)) throw new Error('지원 기록 형식이 올바르지 않습니다.');
  const records = backup.applications.map((application) => ({
    id: application.id,
    company: application.company?.trim(),
    role: application.role?.trim(),
    url: application.url?.trim() ?? '',
    deadline: application.deadline ?? '',
    status: STATUSES.includes(application.status) ? application.status : 'Saved',
    notes: application.notes?.trim() ?? '',
    createdAt: application.createdAt ?? new Date().toISOString(),
  }));
  if (records.some((application) => !application.id || Object.keys(validateApplication(application)).length)) throw new Error('지원 기록 형식이 올바르지 않습니다.');
  return records;
}

export function createApplication(values) {
  return {
    id: crypto.randomUUID(),
    company: values.company.trim(),
    role: values.role.trim(),
    url: values.url.trim(),
    deadline: values.deadline,
    status: STATUSES.includes(values.status) ? values.status : 'Saved',
    notes: values.notes.trim(),
    createdAt: new Date().toISOString(),
  };
}
