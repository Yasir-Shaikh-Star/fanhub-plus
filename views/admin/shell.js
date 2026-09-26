const { icon } = require('../../core/icons');

const TABS = [
  { href: '/admin', label: 'Overview', match: '/admin' },
  { href: '/admin/content', label: 'Content', icon: 'book' },
  { href: '/admin/characters', label: 'Characters', icon: 'users' },
  { href: '/admin/merch', label: 'Merch', icon: 'shirt' },
  { href: '/admin/events', label: 'Events', icon: 'mappin' },
  { href: '/admin/chatbot', label: 'Chatbot FAQ', icon: 'robot' },
  { href: '/admin/feedback', label: 'Feedback', icon: 'chat' },
  { href: '/admin/users', label: 'Users', icon: 'usercircle' }
];

function adminShell({ title, path, inner, pendingCount = 0 }) {
  const tabs = TABS.map((t) => {
    const active = t.href === '/admin' ? path === '/admin' : path.startsWith(t.href);
    return `<a href="${t.href}" class="${active ? 'active' : ''}">${t.label}${t.href === '/admin/content' && pendingCount ? ` <span class="tag badge-pending" style="margin-left:4px">${pendingCount}</span>` : ''}</a>`;
  }).join('');

  return `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h1 style="font-size:1.5rem">${icon('shield', { size: 20 })} Admin Control Panel</h1><p>${title}</p></div>
      </div>
      <div class="admin-tabs">${tabs}</div>
      ${inner}
    </div>
  </section>`;
}

module.exports = { adminShell };
