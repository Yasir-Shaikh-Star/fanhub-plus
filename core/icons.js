
const PATHS = {
  home: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V20h5v-5h2v5h5v-9.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2.5 6L9 15l2.5-6z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.3"/><path d="M15.5 14c2.5.3 4.5 2.5 4.5 6"/>',
  film: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M8 4.5v15M16 4.5v15M3.5 9h4.5M16 9h4.5M3.5 15h4.5M16 15h4.5"/>',
  gamepad: '<rect x="3" y="8" width="18" height="9" rx="4"/><path d="M7 10.5v4M5 12.5h4"/><circle cx="15.5" cy="11.5" r="1"/><circle cx="18" cy="14" r="1"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21M9 21h6"/>',
  book: '<path d="M4 5.5c2.5-1.3 5.5-1.3 8 0v13c-2.5-1.3-5.5-1.3-8 0z"/><path d="M20 5.5c-2.5-1.3-5.5-1.3-8 0v13c2.5-1.3 5.5-1.3 8 0z"/>',
  shirt: '<path d="M8 4 4 7l2 3 2-1.3V20h8V8.7L18 10l2-3-4-3-2 2h-4z"/>',
  sparkles: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m6 6 2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/><circle cx="12" cy="12" r="2.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
  sun: '<circle cx="12" cy="12" r="4.3"/><path d="M12 2.5v2.3M12 19.2v2.3M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.3-4.3"/>',
  bookmark: '<path d="M6 3.5h12v17l-6-4-6 4z"/>',
  star: '<path d="m12 3.5 2.6 5.5 6 .7-4.4 4.1 1.1 6-5.3-3-5.3 3 1.1-6-4.4-4.1 6-.7z"/>',
  mappin: '<path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  chat: '<path d="M4 5.5h16v11H9l-4 3.5v-3.5H4z"/><path d="M8 10h8M8 13h5"/>',
  shield: '<path d="M12 3.5 19 6v6c0 5-3 8-7 9-4-1-7-4-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  usercircle: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6 19c1.2-2.6 3.4-4 6-4s4.8 1.4 6 4"/>',
  upload: '<path d="M12 15.5V4M8 8l4-4 4 4"/><path d="M4.5 15.5v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3"/>',
  bell: '<path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 14 6 10z"/><path d="M10 19a2 2 0 0 0 4 0"/>',
  send: '<path d="m4 12 16-8-6 16-3-6-6-3z"/><path d="M14 10 9.5 14.5"/>',
  chevronRight: '<path d="m9.5 5 7 7-7 7"/>',
  chevronDown: '<path d="m5 9 7 7 7-7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  trash: '<path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2"/><path d="M6.5 7 7.3 19a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8L17.5 7"/><path d="M10.3 11v6M13.7 11v6"/>',
  edit: '<path d="M16.5 3.5 20 7l-11 11-4.3.9.9-4.3z"/><path d="m14.5 5.5 3.5 3.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  heart: '<path d="M12 20s-7.5-4.6-9.7-9.4C.7 6.9 3 3.5 6.6 3.5c2 0 3.6 1 4.4 2.4 1-1.4 2.4-2.4 4.4-2.4 3.6 0 5.9 3.4 4.3 7.1C19.5 15.4 12 20 12 20z"/>',
  eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  arrowRight: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  logout: '<path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9"/><path d="M20 12H10M20 12l-3.5-3.5M20 12l-3.5 3.5"/>',
  robot: '<rect x="5" y="8.5" width="14" height="10" rx="3"/><circle cx="9.3" cy="13.3" r="1.2"/><circle cx="14.7" cy="13.3" r="1.2"/><path d="M12 8.5V5M9.5 5h5"/><path d="M2.5 12v3M21.5 12v3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.2v.1"/>',
  ticket: '<path d="M3.5 9.5a2 2 0 0 0 0-4V4.5h17v1a2 2 0 0 0 0 4v5a2 2 0 0 0 0 4v1h-17v-1a2 2 0 0 0 0-4z"/><path d="M10 4.5v14" stroke-dasharray="2 2"/>',
  fire: '<path d="M12 21c4 0 6.5-2.6 6.5-6 0-2.4-1.4-3.7-2.2-5-.4 1.4-1.2 2.2-2 2.2.6-2.7-.5-5-3-7-1 2.4-2.8 3.7-4 5.2-1 1.3-1.8 2.7-1.8 4.6 0 3.4 2.5 6 6.5 6z"/>',
  filter: '<path d="M4 5.5h16M7 12h10M10.5 18.5h3"/>',
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.4"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.4"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.4"/>',
  play: '<path d="M6.5 4.5v15l13-7.5z"/>',
  pause: '<path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"/>',
  skipNext: '<path d="M6 5v14l10-7z"/><path d="M17 5v14"/>',
  skipBack: '<path d="M18 5v14L8 12z"/><path d="M7 5v14"/>'
};

function icon(name, opts = {}) {
  const size = opts.size || 20;
  const cls = opts.class ? ` ${opts.class}` : '';
  const path = PATHS[name] || PATHS.sparkles;
  return `<svg class="icon${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

module.exports = { icon, names: Object.keys(PATHS) };
