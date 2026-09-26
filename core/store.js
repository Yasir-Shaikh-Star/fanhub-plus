
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function load() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

let cache = load();
let dirty = false;

function persist() {
  fs.writeFileSync(DB_PATH, JSON.stringify(cache, null, 2), 'utf8');
  dirty = false;
}

function scheduleSave() {
  if (dirty) return;
  dirty = true;
  setImmediate(persist);
}

function id() {
  return crypto.randomBytes(6).toString('hex');
}

function collection(name) {
  if (!cache[name]) cache[name] = [];

  return {
    all() {
      return cache[name];
    },
    find(predicate) {
      return cache[name].filter(predicate);
    },
    findOne(predicate) {
      return cache[name].find(predicate) || null;
    },
    findById(recordId) {
      return cache[name].find((r) => r.id === recordId) || null;
    },
    insert(record) {
      const withId = { id: record.id || id(), ...record };
      cache[name].push(withId);
      scheduleSave();
      return withId;
    },
    update(recordId, patch) {
      const idx = cache[name].findIndex((r) => r.id === recordId);
      if (idx === -1) return null;
      cache[name][idx] = { ...cache[name][idx], ...patch };
      scheduleSave();
      return cache[name][idx];
    },
    remove(recordId) {
      const before = cache[name].length;
      cache[name] = cache[name].filter((r) => r.id !== recordId);
      scheduleSave();
      return cache[name].length < before;
    },
    count(predicate) {
      return predicate ? cache[name].filter(predicate).length : cache[name].length;
    }
  };
}

module.exports = { collection, id, persist, reload: () => { cache = load(); } };
