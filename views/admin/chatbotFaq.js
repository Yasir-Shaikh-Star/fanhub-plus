const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function adminChatbot({ user, path, flash, faqs, pendingCount, logCount }) {
  const rows = faqs
    .map(
      (f) => `<tr>
      <td style="font-weight:600;max-width:220px">${f.question}</td>
      <td style="max-width:260px">${f.answer.slice(0, 80)}${f.answer.length > 80 ? '...' : ''}</td>
      <td>${(f.keywords || []).join(', ')}</td>
      <td style="white-space:nowrap"><form action="/admin/chatbot/${f.id}/delete" method="POST" style="display:inline" onsubmit="return confirm('Delete this FAQ entry?')"><button class="btn btn-sm btn-ghost" style="color:var(--danger)">${icon('trash', { size: 12 })}</button></form></td>
    </tr>`
    )
    .join('');

  const inner = `
  <div class="stat-tile" style="max-width:260px;margin-bottom:22px">
    <span class="stat-icon" style="background:var(--primary)">${icon('robot', { size: 17 })}</span>
    <span class="stat-num">${logCount}</span><span class="stat-label">Chatbot conversations logged</span>
  </div>
  <div class="form-card" style="margin-bottom:26px">
    <h3 style="font-size:1rem;margin-bottom:14px">${icon('plus', { size: 15 })} Add FAQ entry</h3>
    <form method="POST" action="/admin/chatbot" class="grid" style="grid-template-columns:1fr;gap:14px">
      <div class="field"><label>Question (as shown as a suggestion)</label><input type="text" name="question" required></div>
      <div class="field"><label>Keywords (comma separated, matched in visitor messages)</label><input type="text" name="keywords" placeholder="bookmark, save, favorite" required></div>
      <div class="field"><label>Answer</label><textarea name="answer" rows="3" required></textarea></div>
      <div><button type="submit" class="btn btn-primary">${icon('plus', { size: 14 })} Add FAQ entry</button></div>
    </form>
  </div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Question</th><th>Answer</th><th>Keywords</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No FAQ entries yet.</td></tr>'}</tbody></table></div>`;

  return layout({ title: 'Admin - Chatbot', body: adminShell({ title: 'Manage the assistant’s knowledge base.', path, inner, pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }, { href: '/admin/chatbot', label: 'Chatbot FAQ' }] });
};
