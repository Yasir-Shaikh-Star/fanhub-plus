const { collection } = require('../core/store');

module.exports = {
  Users: collection('users'),
  Categories: collection('categories'),
  Content: collection('content'),
  Characters: collection('characters'),
  Merch: collection('merch'),
  Events: collection('events'),
  Bookmarks: collection('bookmarks'),
  Feedback: collection('feedback'),
  ChatbotFaq: collection('chatbotFaq'),
  ChatbotLogs: collection('chatbotLogs')
};
