import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boot } from './helpers/boot.mjs';

const app = boot();

test('boots without a runtime error', () => {
  assert.equal(app.bootError, null, String(app.bootError));
});

test('registers the documented command set', () => {
  const names = app.commandNames();
  assert.ok(names.length >= 371, `expected >= 371 commands, got ${names.length}`);
  for (const required of ['ls', 'cd', 'grep', 'awk', 'sed', 'sort', 'uniq', 'tr', 'docker', 'kubectl', 'systemctl']) {
    assert.ok(names.includes(required), `missing command: ${required}`);
  }
});

test('every command runs without throwing', () => {
  const failures = [];
  for (const name of app.commandNames()) {
    const out = app.run(name);
    if (out.startsWith('<<EXCEPTION>>')) failures.push(`${name}: ${out}`);
  }
  assert.deepEqual(failures, []);
});

test('no command leaks undefined / NaN / [object Object] into user output', () => {
  const leaks = [];
  for (const name of app.commandNames()) {
    const out = app.run(name);
    if (/undefined|NaN|\[object Object\]/.test(out)) leaks.push(`${name}: ${out.slice(0, 100)}`);
  }
  assert.deepEqual(leaks, []);
});

test('`<cmd> --help` prints usage and never mutates the filesystem', () => {
  const before = app.run('ls /tmp');
  assert.match(app.run('touch --help'), /Usage/i);
  assert.match(app.run('mkdir --help'), /Usage/i);
  const after = app.run('ls /tmp');
  assert.equal(after, before, '--help must not create files');
  assert.ok(!before.includes('--help'));
});

test('terminal output stays bounded over a long session', () => {
  for (let i = 0; i < 1100; i++) app.type('ls');
  assert.ok(
    app.output.children.length <= 2000,
    `output grew to ${app.output.children.length} nodes`,
  );
});
