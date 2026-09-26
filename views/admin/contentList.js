const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function adminContentList({ user, path, flash, items, categories, pendingCount }) {
  const catOptions = categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');

  const rows = items
    .map(
      (it) => `<tr>
      <td style="font-weight:600">${it.content.title}${it.content.status === 'pending' ? ' <span class="tag badge-pending">pending</span>' : ''}</td>
      <td><span class="tag">${it.content.type}</span></td>
      <td>${it.category ? it.category.name : '&mdash;'}</td>
      <td>${it.content.ratings.length ? (it.content.ratings.reduce((s, r) => s + r.stars, 0) / it.content.ratings.length).toFixed(1) : '&mdash;'}</td>
      <td style="white-space:nowrap">
        ${it.content.status === 'pending' ? `
        <form action="/admin/content/${it.content.id}/approve" method="POST" style="display:inline"><button class="btn btn-sm btn-accent">${icon('check', { size: 12 })} Approve</button></form>
        <form action="/admin/content/${it.content.id}/reject" method="POST" style="display:inline"><button class="btn btn-sm btn-outline">${icon('x', { size: 12 })} Reject</button></form>
        ` : `
        <a href="/content/${it.content.id}" class="btn btn-sm btn-ghost">${icon('eye', { size: 12 })}</a>
        <form action="/admin/content/${it.content.id}/delete" method="POST" style="display:inline" onsubmit="return confirm('Delete this item?')"><button class="btn btn-sm btn-ghost" style="color:var(--danger)">${icon('trash', { size: 12 })}</button></form>
        `}
      </td>
    </tr>`
    )
    .join('');

  const inner = `
  <div class="form-card" style="margin-bottom:26px">
    <h3 style="font-size:1rem;margin-bottom:14px">${icon('plus', { size: 15 })} Add content</h3>
    <form method="POST" action="/admin/content" class="grid" style="grid-template-columns:1fr 1fr;gap:14px">
      <div class="field" style="grid-column:1/-1"><label>Title</label><input type="text" name="title" required></div>
      <div class="field"><label>Fandom</label><select name="categoryId" required>${catOptions}</select></div>
      <div class="field"><label>Type</label><select name="type"><option value="article">Article</option><option value="video">Video</option><option value="audio">Audio</option><option value="image">Image</option></select></div>
      <div class="field" style="grid-column:1/-1"><label>Short description</label><input type="text" name="description" required></div>
      <div class="field" style="grid-column:1/-1"><label>Body (for articles)</label><textarea name="body" rows="3"></textarea></div>
      <div class="field" style="grid-column:1/-1"><label>Media URL (for video/audio)</label><input type="url" name="mediaUrl" placeholder="https://..."></div>
      <div style="grid-column:1/-1"><button type="submit" class="btn btn-primary">${icon('plus', { size: 14 })} Add content</button></div>
    </form>
  </div>

  <div class="table-wrap"><table class="data-table">
    <thead><tr><th>Title</th><th>Type</th><th>Fandom</th><th>Rating</th><th>Actions</th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5">No content yet.</td></tr>'}</tbody>
  </table></div>`;

  return layout({ title: 'Admin - Content', body: adminShell({ title: 'Manage articles, videos, audio and pending fan submissions.', path, inner, pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }, { href: '/admin/content', label: 'Content' }] });
};
