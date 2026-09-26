const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function adminMerch({ user, path, flash, items, categories, pendingCount }) {
  const catOptions = categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  const rows = items
    .map(
      (it) => `<tr>
      <td style="font-weight:600">${it.merch.name}</td>
      <td>${it.category ? it.category.name : '&mdash;'}</td>
      <td><span class="tag tag-warm">${it.merch.tag}</span></td>
      <td>${it.merch.isUpcoming ? '<span class="tag">Upcoming</span>' : ''}</td>
      <td>${it.merch.viewCount}</td>
      <td style="white-space:nowrap">
        <a href="/merch/${it.merch.id}" class="btn btn-sm btn-ghost">${icon('eye', { size: 12 })}</a>
        <form action="/admin/merch/${it.merch.id}/delete" method="POST" style="display:inline" onsubmit="return confirm('Delete this item?')"><button class="btn btn-sm btn-ghost" style="color:var(--danger)">${icon('trash', { size: 12 })}</button></form>
      </td>
    </tr>`
    )
    .join('');

  const inner = `
  <div class="form-card" style="margin-bottom:26px">
    <h3 style="font-size:1rem;margin-bottom:14px">${icon('plus', { size: 15 })} Add merchandise</h3>
    <form method="POST" action="/admin/merch" class="grid" style="grid-template-columns:1fr 1fr;gap:14px">
      <div class="field"><label>Name</label><input type="text" name="name" required></div>
      <div class="field"><label>Fandom</label><select name="categoryId" required>${catOptions}</select></div>
      <div class="field"><label>Tag</label><select name="tag"><option>Limited Edition</option><option>Pre-Order</option><option>Collectible</option><option>Standard</option></select></div>
      <div class="field"><label>Release date</label><input type="date" name="releaseDate" required></div>
      <div class="field"><label class="checkbox-row" style="margin-top:30px"><input type="checkbox" name="isUpcoming"> Mark as upcoming</label></div>
      <div class="field" style="grid-column:1/-1"><label>Description</label><textarea name="description" rows="2" required></textarea></div>
      <div style="grid-column:1/-1"><button type="submit" class="btn btn-primary">${icon('plus', { size: 14 })} Add merch</button></div>
    </form>
  </div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Fandom</th><th>Tag</th><th>Status</th><th>Views</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No merchandise yet.</td></tr>'}</tbody></table></div>`;

  return layout({ title: 'Admin - Merch', body: adminShell({ title: 'Manage the merchandise showcase.', path, inner, pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }, { href: '/admin/merch', label: 'Merch' }] });
};
