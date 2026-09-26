
const GREETINGS = ['hi', 'hello', 'hey', 'yo', 'sup', 'greetings'];
const THANKS = ['thanks', 'thank you', 'thx', 'appreciate'];

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scoreFaq(faq, tokens, rawMessage) {
  let score = 0;
  const lowerMsg = rawMessage.toLowerCase();
  (faq.keywords || []).forEach((kw) => {
    if (lowerMsg.includes(kw.toLowerCase())) score += 3;
    if (tokens.includes(kw.toLowerCase())) score += 1;
  });
  return score;
}

function reply(message, faqs, context = {}) {
  const trimmed = (message || '').trim();
  if (!trimmed) return "I didn't catch that — could you rephrase it?";

  const tokens = tokenize(trimmed);

  if (tokens.length <= 3 && tokens.some((t) => GREETINGS.includes(t))) {
    return context.userName
      ? `Hey ${context.userName}! What can I help you find today?`
      : 'Hey there! What can I help you find today?';
  }
  if (tokens.some((t) => THANKS.includes(t))) {
    return "You're welcome! Anything else I can help with?";
  }

  let best = null;
  let bestScore = 0;
  faqs.forEach((faq) => {
    const s = scoreFaq(faq, tokens, trimmed);
    if (s > bestScore) {
      bestScore = s;
      best = faq;
    }
  });

  if (best && bestScore > 0) return best.answer;

  return "I'm not totally sure about that one. Try asking about bookmarks, events, your dashboard, dark mode, or submitting fan content — or use the Feedback page and an admin will follow up.";
}

module.exports = { reply, tokenize };
