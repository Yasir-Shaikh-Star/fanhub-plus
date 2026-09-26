const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function adminFeedback({ user, path, flash, items, pendingCount }) {
  const rows = items
    .map(
      (f) => `<tr>
      <td>${f.name}<br><span style="font-size:.75rem;color:var(--text-faint)">${f.email}</span></td>
      <td><span class="tag ${f.type === 'bug' ? 'tag-warm' : f.type === 'suggestion' ? 'tag-primary' : 'tag'}">${f.type}</span></td>
      <td style="max-width:320px">${f.message}</td>
      <td>${new Date(f.createdAt).toLocaleDateString()}</td>
      <td>
        <form action="/admin/feedback/${f.id}/status" method="POST" style="display:flex;gap:6px">
          <select name="status" onchange="this.form.submit()">
            <option value="new" ${f.status === 'new' ? 'selected' : ''}>New</option>
            <option value="reviewed" ${f.status === 'reviewed' ? 'selected' : ''}>Reviewed</option>
          </select>
        </form>
      </td>
    </tr>`
    )
    .join('');

  const inner = `<div class="table-wrap"><table class="data-table">
    <thead><tr><th>From</th><th>Type</th><th>Message</th><th>Date</th><th>Status</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5">No feedback submitted yet.</td></tr>'}</tbody>
  </table></div>`;

  return layout({ title: 'Admin - Feedback', body: adminShell({ title: 'Read and triage feedback from visitors and members.', path, inner, pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }, { href: '/admin/feedback', label: 'Feedback' }] });
};
