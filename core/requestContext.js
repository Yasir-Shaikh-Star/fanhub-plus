const { AsyncLocalStorage } = require('async_hooks');

const storage = new AsyncLocalStorage();

function run(store, fn) {
  return storage.run(store, fn);
}

function current() {
  return storage.getStore() || null;
}

module.exports = { run, current };
