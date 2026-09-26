const { layout, icon } = require('../../core/layout');
const { adminShell } = require('./shell');

module.exports = function adminEvents({ user, path, flash, events, pendingCount }) {
  const rows = events
    .map(
      (ev) => `<tr>
      <td style="font-weight:600">${ev.title}</td>
      <td>${ev.city}</td>
      <td>${new Date(ev.date).toLocaleDateString()}</td>
      <td><span class="tag">${ev.type}</span></td>
      <td style="white-space:nowrap"><form action="/admin/events/${ev.id}/delete" method="POST" style="display:inline" onsubmit="return confirm('Delete this event?')"><button class="btn btn-sm btn-ghost" style="color:var(--danger)">${icon('trash', { size: 12 })}</button></form></td>
    </tr>`
    )
    .join('');

  const inner = `
  <div class="form-card" style="margin-bottom:26px">
    <h3 style="font-size:1rem;margin-bottom:14px">${icon('plus', { size: 15 })} Add event</h3>
    <form method="POST" action="/admin/events" class="grid" style="grid-template-columns:1fr 1fr;gap:14px">
      <div class="field" style="grid-column:1/-1"><label>Title</label><input type="text" name="title" required></div>
      <div class="field"><label>City</label><input type="text" name="city" required></div>
      <div class="field"><label>Venue</label><input type="text" name="venue" required></div>
      <div class="field"><label>Latitude</label><input type="text" name="lat" placeholder="e.g. 40.7128" required></div>
      <div class="field"><label>Longitude</label><input type="text" name="lng" placeholder="e.g. -74.0060" required></div>
      <div class="field"><label>Date</label><input type="date" name="date" required></div>
      <div class="field"><label>Type</label><select name="type"><option>Convention</option><option>Screening</option><option>Concert</option><option>Meetup</option><option>Release Event</option></select></div>
      <div class="field"><label>Ticket / info URL</label><input type="url" name="ticketUrl" placeholder="https://..."></div>
      <div class="field" style="grid-column:1/-1"><label>Description</label><textarea name="description" rows="2" required></textarea></div>
      <div style="grid-column:1/-1"><button type="submit" class="btn btn-primary">${icon('plus', { size: 14 })} Add event</button></div>
    </form>
  </div>
  <div class="table-wrap"><table class="data-table"><thead><tr><th>Title</th><th>City</th><th>Date</th><th>Type</th><th>Actions</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No events yet.</td></tr>'}</tbody></table></div>`;

  return layout({ title: 'Admin - Events', body: adminShell({ title: 'Manage the event calendar.', path, inner, pendingCount }), user, path, flash, trail: [{ href: '/', label: 'Home' }, { href: '/admin', label: 'Admin' }, { href: '/admin/events', label: 'Events' }] });
};
