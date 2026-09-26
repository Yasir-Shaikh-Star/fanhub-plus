(function () {
  'use strict';

  var root = document.documentElement;
  function applyTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
  }
  var savedTheme = localStorage.getItem('fh-theme');
  if (savedTheme) applyTheme(savedTheme);

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-toggle-theme]');
    if (!btn) return;
    var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('fh-theme', next);
    if (document.body.dataset.loggedIn === '1') {
      fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: next })
      }).catch(function () {});
    }
  });

  (function () {
    var glow = document.getElementById('cursorGlow');
    var toggle = document.querySelector('[data-toggle-cursorfx]');
    if (!glow || !toggle) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raf = null;
    function setOn(on) {
      document.body.classList.toggle('cursorfx-on', on);
      toggle.classList.toggle('is-active', on);
      toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
      try { localStorage.setItem('fh-cursorfx', on ? '1' : '0'); } catch (e) {}
    }
    if (!reduced) {
      var saved = null;
      try { saved = localStorage.getItem('fh-cursorfx'); } catch (e) {}
      setOn(saved === '1');
    }
    toggle.addEventListener('click', function () {
      setOn(!document.body.classList.contains('cursorfx-on'));
    });
    document.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        raf = null;
      });
    });
  })();

  var savedSize = localStorage.getItem('fh-fontsize');
  if (savedSize) root.setAttribute('data-fontsize', savedSize);
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-fontsize]');
    if (!btn) return;
    var size = btn.getAttribute('data-fontsize');
    root.setAttribute('data-fontsize', size);
    localStorage.setItem('fh-fontsize', size);
    if (document.body.dataset.loggedIn === '1') {
      fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fontSize: size })
      }).catch(function () {});
    }
  });

  document.addEventListener('click', function (e) {
    var toggleBtn = e.target.closest('[data-nav-toggle]');
    if (toggleBtn) {
      document.querySelector('.nav-links').classList.toggle('open');
      toggleBtn.classList.toggle('is-open');
    }
  });

  var topnavWrap = document.getElementById('topnavWrap');
  if (topnavWrap) {
    var scrollTick = false;
    var syncNavScroll = function () {
      topnavWrap.classList.toggle('scrolled', window.scrollY > 12);
      scrollTick = false;
    };
    syncNavScroll();
    window.addEventListener('scroll', function () {
      if (scrollTick) return;
      scrollTick = true;
      window.requestAnimationFrame(syncNavScroll);
    }, { passive: true });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn');
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    var size = Math.max(rect.width, rect.height) * 1.4;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', function () { ripple.remove(); });
  });

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-dropdown-trigger]');
    document.querySelectorAll('.dropdown.open').forEach(function (d) {
      if (!trigger || d !== trigger.closest('.dropdown')) d.classList.remove('open');
    });
    if (trigger) trigger.closest('.dropdown').classList.toggle('open');
  });

  document.querySelectorAll('.flash').forEach(function (f) {
    setTimeout(function () {
      f.style.transition = 'opacity .3s ease, transform .3s ease';
      f.style.opacity = '0';
      f.style.transform = 'translateX(20px)';
      setTimeout(function () { f.remove(); }, 300);
    }, 5000);
  });

  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-open-modal]');
    if (opener) {
      var modal = document.getElementById(opener.getAttribute('data-open-modal'));
      if (modal) modal.classList.add('open');
    }
    if (e.target.closest('[data-close-modal]') || e.target.classList.contains('modal-backdrop')) {
      var open = document.querySelector('.modal-backdrop.open');
      if (open) open.classList.remove('open');
    }
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-bookmark-toggle]');
    if (!btn) return;
    e.preventDefault();
    var targetType = btn.getAttribute('data-target-type');
    var targetId = btn.getAttribute('data-target-id');
    fetch('/api/bookmarks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetType: targetType, targetId: targetId })
    })
      .then(function (r) {
        if (r.status === 401) { window.location.href = '/login'; return null; }
        return r.json();
      })
      .then(function (data) {
        if (!data) return;
        btn.classList.toggle('is-active', data.bookmarked);
        btn.setAttribute('aria-pressed', data.bookmarked ? 'true' : 'false');
        btn.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }],
          { duration: 320, easing: 'ease-out' }
        );
      })
      .catch(function () {});
  });

  document.addEventListener('click', function (e) {
    var star = e.target.closest('.star-rate button');
    if (!star) return;
    var wrap = star.closest('.star-rate');
    var contentId = wrap.getAttribute('data-content-id');
    var value = Number(star.getAttribute('data-value'));
    fetch('/api/content/' + contentId + '/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars: value })
    })
      .then(function (r) { return r.status === 401 ? null : r.json(); })
      .then(function (data) {
        if (!data) { window.location.href = '/login'; return; }
        wrap.querySelectorAll('button').forEach(function (b, i) {
          b.classList.toggle('active', i < value);
        });
        var avgEl = document.querySelector('[data-avg-rating="' + contentId + '"]');
        if (avgEl) avgEl.textContent = data.average.toFixed(1) + ' (' + data.count + ')';
      });
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });
  }

  if ('IntersectionObserver' in window) {
    var textTargets = document.querySelectorAll(
      'main h1:not(.reveal), main h2:not(.reveal), main h3:not(.reveal), ' +
      'main p:not(.reveal):not(.lead), .section-head, .form-card h2, .stat-tile'
    );
    var textIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          textIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    textTargets.forEach(function (el, i) {
      el.classList.add('reveal-text');
      el.style.transitionDelay = (Math.min(i % 4, 3) * 0.06) + 's';
      textIo.observe(el);
    });
  }

  if ('IntersectionObserver' in window) {
    var wipeSections = document.querySelectorAll('main > .section');
    // threshold is a fraction of the SECTION's own height, not the viewport.
    // Listing pages (characters/merch/articles/etc.) wrap the whole page —
    // heading, filters and every card — in a single tall section, which on
    // a narrow one-column mobile layout can run several thousand pixels
    // tall. A 0.1 (10%) threshold then never gets satisfied because only a
    // sliver of that huge section is ever on-screen at once, so the
    // section stays at opacity:0 forever. threshold: 0 fires as soon as any
    // part of the section enters the viewport, which is what "reveal on
    // scroll" is meant to mean regardless of how tall the section is.
    var wipeIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          wipeIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0 });
    wipeSections.forEach(function (el) {
      el.classList.add('section-wipe');
      wipeIo.observe(el);
    });
  }

  var pwField = document.getElementById('password');
  var pwMeter = document.getElementById('pwMeter');
  var pwHint = document.getElementById('pwHint');
  if (pwField && pwMeter && pwHint) {
    var SPECIAL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;
    var scorePassword = function (pw) {
      var hasLen = pw.length >= 6;
      var hasNum = /\d/.test(pw);
      var hasSpecial = SPECIAL_RE.test(pw);
      var hasMixCase = /[a-z]/.test(pw) && /[A-Z]/.test(pw);
      var meetsPolicy = hasLen && hasNum && hasSpecial;
      var score = 0;
      if (pw.length > 0) score = 1;
      if (hasLen && (hasNum || hasSpecial)) score = 2;
      if (meetsPolicy) score = 3;
      if (meetsPolicy && (hasMixCase || pw.length >= 10)) score = 4;
      return { score: score, hasLen: hasLen, hasNum: hasNum, hasSpecial: hasSpecial, meetsPolicy: meetsPolicy };
    };
    var LABELS = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };
    var updateMeter = function () {
      var pw = pwField.value;
      var r = scorePassword(pw);
      pwMeter.setAttribute('data-strength', String(r.score));
      pwMeter.classList.toggle('is-active', pw.length > 0);
      if (!pw.length) {
        pwHint.textContent = 'At least 6 characters, with 1 number and 1 special character (e.g. ! @ # $).';
        pwHint.classList.remove('pw-hint-ok', 'pw-hint-bad');
        return;
      }
      if (r.meetsPolicy) {
        pwHint.textContent = LABELS[r.score] + ' password \u2014 meets all requirements.';
        pwHint.classList.add('pw-hint-ok');
        pwHint.classList.remove('pw-hint-bad');
      } else {
        var missing = [];
        if (!r.hasLen) missing.push('6+ characters');
        if (!r.hasNum) missing.push('1 number');
        if (!r.hasSpecial) missing.push('1 special character');
        pwHint.textContent = LABELS[r.score] + ' \u2014 still needs ' + missing.join(' and ') + '.';
        pwHint.classList.add('pw-hint-bad');
        pwHint.classList.remove('pw-hint-ok');
      }
    };
    pwField.addEventListener('input', updateMeter);
    updateMeter();
    var pwForm = pwField.closest('form');
    if (pwForm) {
      pwForm.addEventListener('submit', function (e) {
        var r = scorePassword(pwField.value);
        if (!r.meetsPolicy) {
          e.preventDefault();
          updateMeter();
          pwField.focus();
        }
      });
    }
  }

  var avatarInput = document.getElementById('avatarInput');
  if (avatarInput) {
    avatarInput.addEventListener('change', function () {
      var file = avatarInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        document.getElementById('avatarPreview').innerHTML = '<img src="' + reader.result + '" alt="Avatar preview">';
        document.getElementById('avatarData').value = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  document.querySelectorAll('[data-autosubmit]').forEach(function (el) {
    el.addEventListener('change', function () { el.closest('form').submit(); });
  });

  var WEATHER_ICONS = {
    0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
    45: '🌫️', 48: '🌫️',
    51: '🌦️', 53: '🌦️', 55: '🌧️',
    61: '🌧️', 63: '🌧️', 65: '🌧️',
    71: '🌨️', 73: '🌨️', 75: '🌨️',
    80: '🌦️', 81: '🌧️', 82: '⛈️',
    95: '⛈️', 96: '⛈️', 99: '⛈️'
  };
  var weatherBadges = document.querySelectorAll('[data-weather]');
  if (weatherBadges.length && 'IntersectionObserver' in window) {
    var loadWeather = function (badge) {
      var lat = badge.getAttribute('data-lat');
      var lng = badge.getAttribute('data-lng');
      if (!lat || !lng) return;
      fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + '&current=temperature_2m,weather_code&temperature_unit=fahrenheit')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) {
          if (!data || !data.current) { badge.style.display = 'none'; return; }
          var temp = Math.round(data.current.temperature_2m);
          var glyph = WEATHER_ICONS[data.current.weather_code] || '🌤️';
          badge.innerHTML = '<span class="live-dot"></span>' + glyph + ' ' + temp + '°F at venue';
          badge.classList.add('is-loaded');
        })
        .catch(function () { badge.style.display = 'none'; });
    };
    var weatherObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          loadWeather(entry.target);
          weatherObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    weatherBadges.forEach(function (b) { weatherObserver.observe(b); });
  }

  var audioPlayer = document.getElementById('homeAudioPlayer');
  var audioToggle = document.getElementById('audioPlayToggle');
  var audioTrack = document.getElementById('homeAudioTrack');
  if (audioPlayer && audioToggle) {
    var PLAY_ICON = '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 4.5v15l13-7.5z"/></svg>';
    var PAUSE_ICON = '<svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z"/></svg>';

    function setPlayingUI(isPlaying) {
      audioPlayer.setAttribute('data-playing', isPlaying ? 'true' : 'false');
      audioToggle.innerHTML = isPlaying ? PAUSE_ICON : PLAY_ICON;
      audioToggle.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
      var wave = document.getElementById('audioWave');
      if (wave) wave.classList.toggle('is-playing', isPlaying);
    }

    audioToggle.addEventListener('click', function () {
      var playing = audioPlayer.getAttribute('data-playing') === 'true';

      if (!audioTrack) {
        setPlayingUI(!playing);
        return;
      }

      if (playing) {
        audioTrack.pause();
        setPlayingUI(false);
      } else {
        var playPromise = audioTrack.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            setPlayingUI(false);
          });
        }
        setPlayingUI(true);
      }
    });

    if (audioTrack) {
      audioTrack.addEventListener('ended', function () { setPlayingUI(false); });
      audioTrack.addEventListener('pause', function () {
        if (audioPlayer.getAttribute('data-playing') === 'true') setPlayingUI(false);
      });
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-event-info-toggle]');
    if (!btn) return;
    var wrap = btn.closest('.event-row-wrap');
    var details = wrap && wrap.querySelector('.event-row-details');
    if (!details) return;
    var isOpen = !details.hidden;
    details.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
})();
