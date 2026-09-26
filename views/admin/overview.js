const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function overview({ user, path, flash, stats, recentFeedback }) {
  const tiles = [
    { label: 'Registered users', value: stats.userCount, icon: 'usercircle', color: 'var(--primary)' },
    { label: 'Content items', value: stats.contentCount, icon: 'book', color: 'var(--accent)' },
    { label: 'Pending submissions', value: stats.pendingCount, icon: 'clock', color: 'var(--warning)' },
    { label: 'Characters', value: stats.characterCount, icon: 'users', color: 'var(--success)' },
    { label: 'Merch items', value: stats.merchCount, icon: 'shirt', color: 'var(--accent-warm)' },
    { label: 'Upcoming events', value: stats.eventCount, icon: 'mappin', color: 'var(--danger)' },
    { label: 'Chatbot conversations', value: stats.chatbotLogCount, icon: 'robot', color: 'var(--primary)' },
    { label: 'Open feedback', value: stats.openFeedbackCount, icon: 'chat', color: 'var(--accent)' }
  ]
    .map(
      (t) => `<div class="stat-tile reveal">
      <span class="stat-icon" style="background:${t.color}">${icon(t.icon, { size: 17 })}</span>
      <span class="stat-num">${t.value}</span><span class="stat-label">${t.label}</span>
    </div>`
    )
    .join('');

  const catBars = stats.popularCategories
    .map((c) => `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:4px"><span>${c.name}</span><span>${c.count}</span></div>
      <div style="height:8px;border-radius:999px;background:var(--bg-soft);overflow:hidden"><div style="height:100%;width:${c.pct}%;background:linear-gradient(90deg,var(--primary),var(--accent));border-radius:999px"></div></div>
    </div>`)
    .join('');

  const feedbackRows = recentFeedback
    .map((f) => `<tr><td>${f.name}</td><td><span class="tag">${f.type}</span></td><td style="max-width:260px">${f.message.slice(0, 70)}${f.message.length > 70 ? '...' : ''}</td><td>${new Date(f.createdAt).toLocaleDateString()}</td></tr>`)
    .join('');

  const inner = `
  <div class="grid grid-4" style="margin-bottom:30px">${tiles}</div>
  <div class="grid" style="grid-template-columns:1.2fr 1fr;gap:24px">
    <div class="form-card">
      <h3 style="font-size:1rem;margin-bottom:14px">Recent feedback</h3>
      <div class="table-wrap"><table class="data-table"><thead><tr><th>From</th><th>Type</th><th>Message</th><th>Date</th></tr></thead><tbody>${feedbackRows || '<tr><td colspan="4">No feedback yet.</td></tr>'}</tbody></table></div>
      <a href="/admin/feedback" class="btn btn-ghost btn-sm" style="margin-top:12px">View all ${icon('arrowRight', { size: 13 })}</a>
    </div>
    <div class="form-card">
      <h3 style="font-size:1rem;margin-bottom:14px">Most active categories</h3>
      ${catBars}
    </div>
  </div>`;

  return layout({ title: 'Admin overview', body: adminShell({ title: 'Platform activity at a glance.', path, inner, pendingCount: stats.pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }] });
};
