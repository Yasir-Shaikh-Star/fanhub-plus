const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function adminUsers({ user, path, flash, users, pendingCount }) {
  const rows = users
    .map(
      (u) => `<tr>
      <td style="font-weight:600">${u.name}</td>
      <td>${u.email}</td>
      <td><span class="tag ${u.role === 'admin' ? 'tag-primary' : ''}">${u.role}</span></td>
      <td>${new Date(u.createdAt).toLocaleDateString()}</td>
      <td style="white-space:nowrap">
        ${u.id !== user.id ? `
        <form action="/admin/users/${u.id}/role" method="POST" style="display:inline">
          <input type="hidden" name="role" value="${u.role === 'admin' ? 'registered' : 'admin'}">
          <button class="btn btn-sm btn-outline">${u.role === 'admin' ? 'Revoke admin' : 'Make admin'}</button>
        </form>` : '<span class="hint">you</span>'}
      </td>
    </tr>`
    )
    .join('');

  const inner = `<div class="table-wrap"><table class="data-table">
    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>`;

  return layout({ title: 'Admin - Users', body: adminShell({ title: 'View and manage member accounts.', path, inner, pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }, { href: '/admin/users', label: 'Users' }] });
};
