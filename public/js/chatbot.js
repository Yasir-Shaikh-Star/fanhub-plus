(function () {
  'use strict';
  var fab = document.getElementById('chatbotFab');
  var panel = document.getElementById('chatbotPanel');
  var body = document.getElementById('chatbotBody');
  var form = document.getElementById('chatbotForm');
  var input = document.getElementById('chatbotInput');
  var suggests = document.getElementById('chatbotSuggests');
  var teaser = document.getElementById('chatbotTeaser');
  var teaserClose = document.getElementById('chatbotTeaserClose');
  if (!fab || !panel) return;

  var greeted = false;

  function dismissTeaser() {
    if (!teaser || !teaser.classList.contains('show')) return;
    teaser.classList.remove('show');
    teaser.classList.add('hide');
    setTimeout(function () { teaser.style.display = 'none'; }, 260);
  }
  if (teaser) {
    var teaserSeen = false;
    try { teaserSeen = sessionStorage.getItem('fh-chatbot-teaser-seen') === '1'; } catch (e) {}
    if (!teaserSeen) {
      setTimeout(function () {
        if (panel.classList.contains('open')) return;
        teaser.classList.add('show');
        try { sessionStorage.setItem('fh-chatbot-teaser-seen', '1'); } catch (e) {}
        setTimeout(dismissTeaser, 8000);
      }, 3200);
    }
    if (teaserClose) teaserClose.addEventListener('click', dismissTeaser);
  }

  fab.addEventListener('click', function () {
    dismissTeaser();
    panel.classList.toggle('open');
    fab.classList.toggle('is-open', panel.classList.contains('open'));
    if (panel.classList.contains('open') && !greeted) {
      greeted = true;
      addMessage('bot', "Hi! I'm the Fan Hub Plus assistant. Ask me anything about bookmarks, events, accounts, or content — or tap a suggestion below.");
      loadSuggestions();
    }
    if (panel.classList.contains('open')) input.focus();
  });
  document.getElementById('chatbotClose').addEventListener('click', function () {
    panel.classList.remove('open');
    fab.classList.remove('is-open');
  });

  function addMessage(who, text) {
    var el = document.createElement('div');
    el.className = 'chat-msg ' + who;
    el.textContent = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'chat-msg bot typing-msg';
    el.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function loadSuggestions() {
    fetch('/api/chatbot/suggestions')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        suggests.innerHTML = '';
        data.slice(0, 4).forEach(function (q) {
          var b = document.createElement('button');
          b.type = 'button';
          b.textContent = q;
          b.addEventListener('click', function () { sendMessage(q); });
          suggests.appendChild(b);
        });
      })
      .catch(function () {});
  }

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage('user', text);
    input.value = '';
    var typingEl = showTyping();
    fetch('/api/chatbot/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        setTimeout(function () {
          typingEl.remove();
          addMessage('bot', data.reply);
        }, 420);
      })
      .catch(function () {
        typingEl.remove();
        addMessage('bot', "Sorry, I couldn't reach the server just now. Try again in a moment.");
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendMessage(input.value);
  });
})();
