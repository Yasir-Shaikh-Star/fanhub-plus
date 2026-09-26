
const crypto = require('crypto');

function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(plain, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const derived = crypto.scryptSync(plain, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(derived, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function makeToken() {
  return crypto.randomBytes(24).toString('hex');
}

function generateCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

const SPECIAL_CHARS = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;

function checkPasswordPolicy(password) {
  const pw = password || '';
  const problems = [];
  if (pw.length < 6) problems.push('at least 6 characters');
  if (!/\d/.test(pw)) problems.push('1 number');
  if (!SPECIAL_CHARS.test(pw)) problems.push('1 special character (e.g. ! @ # $ %)');
  return { valid: problems.length === 0, problems };
}

module.exports = { hashPassword, verifyPassword, makeToken, generateCode, checkPasswordPolicy };
