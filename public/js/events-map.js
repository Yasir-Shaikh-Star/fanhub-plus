(function () {
  'use strict';
  var mapEl = document.getElementById('event-map');
  if (!mapEl || typeof L === 'undefined') return;

  var events = JSON.parse(document.getElementById('eventsData').textContent);
  var map = L.map('event-map', { scrollWheelZoom: false }).setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  var markers = {};
  var bounds = [];

  events.forEach(function (ev) {
    var marker = L.marker([ev.lat, ev.lng]).addTo(map);
    marker.bindPopup(
      '<strong>' + escapeHtml(ev.title) + '</strong><br>' +
      escapeHtml(ev.venue) + ', ' + escapeHtml(ev.city) + '<br>' +
      '<span style="color:#6c5ce7;font-weight:600">' + new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + '</span><br>' +
      '<a href="' + ev.ticketUrl + '" target="_blank" rel="noopener">Ticket / info link</a>'
    );
    markers[ev.id] = marker;
    bounds.push([ev.lat, ev.lng]);
  });

  if (bounds.length) map.fitBounds(bounds, { padding: [40, 40] });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var cityFilter = document.getElementById('cityFilter');
  if (cityFilter) {
    cityFilter.addEventListener('change', function () {
      var city = cityFilter.value;
      document.querySelectorAll('.event-row').forEach(function (row) {
        var match = !city || row.dataset.city === city;
        row.style.display = match ? '' : 'none';
      });
      var b = [];
      events.forEach(function (ev) {
        var visible = !city || ev.city === city;
        markers[ev.id].setOpacity(visible ? 1 : 0.15);
        if (visible) b.push([ev.lat, ev.lng]);
      });
      if (b.length) map.fitBounds(b, { padding: [40, 40] });
    });
  }

  var nearMeBtn = document.getElementById('nearMeBtn');
  if (nearMeBtn && navigator.geolocation) {
    nearMeBtn.addEventListener('click', function () {
      nearMeBtn.textContent = 'Locating...';
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          map.setView([pos.coords.latitude, pos.coords.longitude], 6);
          L.circleMarker([pos.coords.latitude, pos.coords.longitude], {
            radius: 8, color: '#17b3c9', fillColor: '#17b3c9', fillOpacity: 0.5
          }).addTo(map).bindPopup('You are here').openPopup();
          nearMeBtn.textContent = 'Located';
        },
        function () { nearMeBtn.textContent = 'Location unavailable'; }
      );
    });
  }
})();
