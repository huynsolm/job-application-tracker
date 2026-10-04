import { STATUSES, buildCalendarEvent, createApplication, deserializeApplications, filterApplications, serializeApplications, sortApplicationsByDeadline, validateApplication } from './tracker.js';

const STORAGE_KEY = 'job-application-tracker:applications:v1';
const form = document.querySelector('[data-application-form]');
const list = document.querySelector('[data-application-list]');
const message = document.querySelector('[data-form-message]');
const search = document.querySelector('[data-search]');
const statusFilter = document.querySelector('[data-status-filter]');
const exportButton = document.querySelector('[data-export]');
const importInput = document.querySelector('[data-import]');
const backupMessage = document.querySelector('[data-backup-message]');
let applications = loadApplications();

function loadApplications() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; } catch { return []; } }
function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(applications)); }
function escapeHtml(value = '') { return String(value).replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' })[char]); }
function render() {
  const visible = sortApplicationsByDeadline(filterApplications(applications, { query: search.value, status: statusFilter.value }));
  document.querySelector('[data-active-count]').textContent = applications.filter(({ status }) => !['Offer', 'Closed'].includes(status)).length;
  document.querySelector('[data-interview-count]').textContent = applications.filter(({ status }) => status === 'Interview').length;
  if (!visible.length) { list.innerHTML = '<p class="empty">아직 표시할 지원 기록이 없습니다. 위 양식에서 첫 기록을 추가해 주세요.</p>'; return; }
  list.innerHTML = visible.map((application) => `<article class="application-card" data-id="${application.id}"><div><h3>${escapeHtml(application.company)}</h3><p>${escapeHtml(application.role)}</p><div class="meta"><span>상태: ${escapeHtml(application.status)}</span>${application.deadline ? `<span>마감: ${application.deadline}</span>` : '<span>마감일 미정</span>'}${application.url ? `<a href="${escapeHtml(application.url)}" target="_blank" rel="noopener noreferrer">공고 보기 ↗</a>` : ''}</div>${application.notes ? `<p class="notes">${escapeHtml(application.notes)}</p>` : ''}</div><div class="card-actions"><label class="sr-only" for="status-${application.id}">상태 변경</label><select id="status-${application.id}" data-status="${application.id}">${STATUSES.map((status) => `<option ${status === application.status ? 'selected' : ''}>${status}</option>`).join('')}</select>${application.deadline ? `<button type="button" data-calendar="${application.id}">일정 저장</button>` : ''}<button type="button" data-delete="${application.id}">삭제</button></div></article>`).join('');
}
function downloadCalendar(application) { const blob = new Blob([buildCalendarEvent(application)], { type: 'text/calendar' }); const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'), { href: url, download: `${application.company}-deadline.ics` }); link.click(); URL.revokeObjectURL(url); }
form.addEventListener('submit', (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(form)); const errors = validateApplication(values); if (Object.keys(errors).length) { message.textContent = Object.values(errors).join(' '); return; } applications.unshift(createApplication(values)); persist(); form.reset(); message.textContent = '지원 기록을 저장했습니다.'; render(); });
search.addEventListener('input', render); statusFilter.addEventListener('change', render);
list.addEventListener('change', (event) => { const id = event.target.dataset.status; if (!id) return; applications = applications.map((application) => application.id === id ? { ...application, status: event.target.value } : application); persist(); render(); });
list.addEventListener('click', (event) => { const id = event.target.dataset.calendar ?? event.target.dataset.delete; if (!id) return; const application = applications.find((item) => item.id === id); if (event.target.dataset.calendar) downloadCalendar(application); if (event.target.dataset.delete) { applications = applications.filter((item) => item.id !== id); persist(); render(); } });
function downloadBackup() { const blob = new Blob([serializeApplications(applications)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const link = Object.assign(document.createElement('a'), { href: url, download: 'job-application-tracker-backup.json' }); link.click(); URL.revokeObjectURL(url); backupMessage.textContent = `${applications.length}개 지원 기록을 백업 파일로 저장했습니다.`; }
exportButton.addEventListener('click', downloadBackup);
importInput.addEventListener('change', async () => { const [file] = importInput.files; if (!file) return; try { applications = deserializeApplications(await file.text()); persist(); render(); backupMessage.textContent = `${applications.length}개 지원 기록을 복원했습니다.`; } catch (error) { backupMessage.textContent = error.message; } finally { importInput.value = ''; } });
render();
