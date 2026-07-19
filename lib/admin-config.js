const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Where the owner's admin password lives once they set it on first run.
// Gitignored + on the persistent workspace, same as posts.json.
const DATA_DIR = path.join(__dirname, 'data');
const FILE = path.join(DATA_DIR, 'admin.json');

function readStored() {
  try { return JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch { return null; }
}
function writeStored(obj) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8');
  fs.renameSync(tmp, FILE);
}
function scrypt(pw, salt) { return crypto.scryptSync(String(pw), salt, 32).toString('hex'); }

// An ADMIN_PASSWORD env var, if set, always wins — lets advanced users pin the
// password in config instead of the first-run flow.
function envPassword() { return process.env.ADMIN_PASSWORD || ''; }

// "Configured" = there's a password to check against, from either source. When
// false, /admin shows the first-run "create a password" screen instead of login.
function isConfigured() { return !!envPassword() || !!readStored(); }

function constantEq(aStr, bStr) {
  const a = crypto.createHash('sha256').update(String(aStr)).digest();
  const b = crypto.createHash('sha256').update(String(bStr)).digest();
  return crypto.timingSafeEqual(a, b);
}

function verify(password) {
  const env = envPassword();
  if (env) return constantEq(password, env);
  const stored = readStored();
  if (!stored) return false;
  const got = Buffer.from(scrypt(password, stored.salt), 'hex');
  const want = Buffer.from(stored.hash, 'hex');
  return got.length === want.length && crypto.timingSafeEqual(got, want);
}

// First-run: claim the admin by setting a password. Refuses once configured, so
// it can't be used to take over an already-set-up blog.
function setup(password) {
  if (isConfigured()) throw new Error('already_configured');
  if (String(password || '').length < 6) throw new Error('password_too_short');
  const salt = crypto.randomBytes(16).toString('hex');
  writeStored({ salt, hash: scrypt(password, salt), createdAt: new Date().toISOString() });
  return true;
}

// Change the password from inside the admin (requires the current one).
function change(current, next) {
  if (envPassword()) throw new Error('env_managed'); // password is pinned in ADMIN_PASSWORD
  if (!verify(current)) throw new Error('wrong_password');
  if (String(next || '').length < 6) throw new Error('password_too_short');
  const salt = crypto.randomBytes(16).toString('hex');
  writeStored({ salt, hash: scrypt(next, salt), createdAt: new Date().toISOString() });
  return true;
}

module.exports = { isConfigured, verify, setup, change, envManaged: () => !!envPassword() };
