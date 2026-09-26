const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function adminCharacters({ user, path, flash, items, categories, pendingCount }) {
  const catOptions = categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join('');
  const rows = items
    .map(
      (it) => `<tr>
      <td style="font-weight:600">${it.character.name}</td>
      <td>${it.category ? it.category.name : '&mdash;'}</td>
      <td>${it.character.affiliation || ''}</td>
      <td style="white-space:nowrap">
        <a href="/characters/${it.character.id}" class="btn btn-sm btn-ghost">${icon('eye', { size: 12 })}</a>
        <form action="/admin/characters/${it.character.id}/delete" method="POST" style="display:inline" onsubmit="return confirm('Delete this character?')"><button class="btn btn-sm btn-ghost" style="color:var(--danger)">${icon('trash', { size: 12 })}</button></form>
      </td>
    </tr>`
    )
    .join('');

  const inner = `
  <div class="form-card" style="margin-bottom:26px">
    <h3 style="font-size:1rem;margin-bottom:14px">${icon('plus', { size: 15 })} Add character</h3>
    <form method="POST" action="/admin/characters" class="grid" style="grid-template-columns:1fr 1fr;gap:14px">
      <div class="field"><label>Name</label><input type="text" name="name" required></div>
      <div class="field"><label>Fandom</label><select name="categoryId" required>${catOptions}</select></div>
      <div class="field" style="grid-column:1/-1"><label>Affiliation</label><input type="text" name="affiliation"></div>
      <div class="field" style="grid-column:1/-1"><label>Bio</label><textarea name="bio" rows="3" required></textarea></div>
      <div class="field" style="grid-column:1/-1"><label>Tags (comma separated)</label><input type="text" name="tags" placeholder="protagonist, mentor"></div>
      <div style="grid-column:1/-1"><button type="submit" class="btn btn-primary">${icon('plus', { size: 14 })} Add character</button></div>
    </form>
  </div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Fandom</th><th>Affiliation</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No characters yet.</td></tr>'}</tbody></table></div>`;

  return layout({ title: 'Admin - Characters', body: adminShell({ title: 'Manage character profiles.', path, inner, pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }, { href: '/admin/characters', label: 'Characters' }] });
};
