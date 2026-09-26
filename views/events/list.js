const { layout, icon, ASSET_VERSION } = require('../../core/layout');
const { eventRow, emptyState } = require('../../core/components');

module.exports = function eventsList({ user, path, flash, events, cities }) {
  const cityOptions = cities.map((c) => `<option value="${c}">${c}</option>`).join('');
  const rows = events.length ? events.map(eventRow).join('') : emptyState('No upcoming events listed right now.', 'calendar');

  const extraHead = `<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>`;

  const body = `
  <section class="section">
    <div class="container">
      <div class="section-head">
        <div><h1 style="font-size:1.7rem">${icon('mappin', { size: 22 })} Event Discovery &amp; Calendar</h1><p>Conventions, meetups and screenings, filterable by city.</p></div>
      </div>

      <div class="toolbar form-card" style="padding:16px 18px">
        <select id="cityFilter"><option value="">All cities</option>${cityOptions}</select>
        <button id="nearMeBtn" type="button" class="btn btn-outline btn-sm">${icon('mappin', { size: 14 })} Use my location</button>
      </div>

      <div style="margin:20px 0"><div id="event-map"></div></div>
      <script type="application/json" id="eventsData">${JSON.stringify(events.map((e) => ({ id: e.id, title: e.title, city: e.city, venue: e.venue, lat: e.lat, lng: e.lng, date: e.date, ticketUrl: e.ticketUrl })))}</script>

      <div style="margin-top:10px">${rows}</div>
    </div>
  </section>
  <script src="/js/events-map.js?v=${ASSET_VERSION}"></script>`;

  return layout({ title: 'Events', body, user, path, flash, extraHead, trail: [{ href: '/', label: 'Home' }, { href: '/events', label: 'Events' }] });
};
