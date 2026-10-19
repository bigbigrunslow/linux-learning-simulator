// Behavioural fidelity tests: these encode the Linux semantics the project
// claims to teach. Each test boots a clean instance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boot } from './helpers/boot.mjs';

test('mkdir -p creates nested directories and never treats -p as a path', () => {
  const t = boot();
  assert.match(t.run('mkdir -p /tmp/a/b/c'), /Created directory/);
  assert.match(t.run('ls /tmp/a'), /^b$/m);
  assert.match(t.run('ls /tmp/a/b'), /^c$/m);
  assert.doesNotMatch(t.run('ls /root'), /(^|\s)-p(\s|$)/);
  // idempotent, like the real thing
  assert.equal(t.run('mkdir -p /tmp/a/b/c').trim(), '');
});

test('mkdir without -p still needs an existing parent', () => {
  const t = boot();
  assert.match(t.run('mkdir /definitely/not/here'), /No such file or directory/);
});

test('awk reads fields from a file and from stdin', () => {
  const t = boot();
  const users = t.run(`awk -F: '{print $1}' /etc/passwd`);
  assert.match(users, /^root$/m);
  assert.doesNotMatch(users, /Usage/);

  const pairs = t.run(`cat /etc/passwd | awk -F: '{print $1, $3}'`);
  assert.match(pairs, /^root 0$/m);

  const filtered = t.run(`awk '/root/ {print $1}' /etc/passwd`);
  assert.match(filtered, /root/);
});

test('sort understands -n and -r', () => {
  const t = boot();
  t.run('echo 10 > /tmp/n.txt');
  t.run('echo 9 >> /tmp/n.txt');
  t.run('echo 2 >> /tmp/n.txt');
  assert.deepEqual(t.run('sort -n /tmp/n.txt').split('\n'), ['2', '9', '10']);
  assert.deepEqual(t.run('sort /tmp/n.txt').split('\n'), ['10', '2', '9']);
  assert.deepEqual(t.run('sort -r /tmp/n.txt').split('\n'), ['9', '2', '10']);
});

test('uniq -c counts adjacent duplicates', () => {
  const t = boot();
  t.run('echo b > /tmp/u.txt');
  t.run('echo b >> /tmp/u.txt');
  t.run('echo a >> /tmp/u.txt');
  const out = t.run('uniq -c /tmp/u.txt');
  assert.match(out, /2 b/);
  assert.match(out, /1 a/);
});

test('tr translates, deletes and accepts input redirection', () => {
  const t = boot();
  assert.equal(t.run('tr a-z A-Z < /etc/hostname'), 'HOME-SERVER');
  assert.equal(t.run('echo hello | tr -d l'), 'heo');
});

test('ls emits one name per line when piped', () => {
  const t = boot();
  assert.equal(t.run('ls | wc -l').trim(), '3');
  assert.equal(t.run('ls | head -2').split('\n').length, 2);
});

test('history flows through a pipe', () => {
  const t = boot();
  t.type('pwd');
  t.type('ls');
  t.type('whoami');
  assert.match(t.run('history | tail -2'), /whoami/);
});

test('2>/dev/null suppresses stderr', () => {
  const t = boot();
  assert.equal(t.run('ls /nope 2>/dev/null').trim(), '');
  assert.match(t.run('ls /nope'), /No such file or directory/);
});

test('shell parameter expansion: $VAR and ${#VAR}', () => {
  const t = boot();
  assert.equal(t.run('echo ${HOME}').trim(), '/root');
  assert.equal(t.run('echo ${#HOME}').trim(), '5');
  assert.equal(t.run('echo $USER').trim(), 'user');
});

test('grep -c prints a count', () => {
  const t = boot();
  assert.equal(t.run('cat /etc/passwd | grep -c root').trim(), '1');
});

test('dpkg without arguments prints usage, not "undefined"', () => {
  const t = boot();
  const out = t.run('dpkg');
  assert.doesNotMatch(out, /undefined/);
  assert.match(out, /Usage/);
});

test('quoting and pipes are preserved', () => {
  const t = boot();
  assert.equal(t.run('echo "a|b" | wc -c').trim(), '3');
  assert.match(t.run('cat /etc/passwd | grep root'), /^root:/m);
  assert.equal(t.run(`echo 'x  y'`).trim(), 'x  y');
});

test('privilege escalation is reversible', () => {
  const t = boot();
  assert.equal(t.run('whoami').trim(), 'user');
  t.run('sudo bash');
  assert.equal(t.run('whoami').trim(), 'root');
  t.run('exit');
  assert.equal(t.run('whoami').trim(), 'user');
});
