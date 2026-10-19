// Boots the single-file simulator inside a minimal DOM stub so the command
// engine can be exercised from Node without a browser and without dependencies.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
export const APP_PATH = join(here, '..', '..', 'index.html');

class El {
  constructor(tag = 'div', id = '') {
    this.tagName = String(tag).toUpperCase();
    this.id = id;
    this.className = '';
    this.textContent = '';
    this.value = '';
    this.style = {};
    this.dataset = {};
    this.children = [];
    this._html = '';
    this._listeners = new Map();
    this._attrs = new Map();
    const classes = new Set();
    this.classList = {
      add: (...c) => c.forEach((x) => classes.add(x)),
      remove: (...c) => c.forEach((x) => classes.delete(x)),
      contains: (c) => classes.has(c),
      toggle: (c) => (classes.has(c) ? (classes.delete(c), false) : (classes.add(c), true)),
    };
  }
  addEventListener(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, []);
    this._listeners.get(type).push(fn);
  }
  dispatch(type, ev = {}) {
    for (const fn of this._listeners.get(type) ?? []) fn(ev);
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
  removeChild(child) {
    this.children = this.children.filter((c) => c !== child);
    return child;
  }
  setAttribute(k, v) {
    this._attrs.set(k, String(v));
  }
  getAttribute(k) {
    return this._attrs.has(k) ? this._attrs.get(k) : null;
  }
  focus() {}
  querySelector() {
    return new El('span');
  }
  querySelectorAll() {
    return [];
  }
  set innerHTML(v) {
    this._html = String(v);
    if (v === '') this.children = [];
  }
  get innerHTML() {
    return this._html;
  }
  get childNodes() {
    return this.children;
  }
  get firstChild() {
    return this.children[0] ?? null;
  }
}

/**
 * @param {string} [htmlPath] defaults to the repository's index.html
 * @returns {{ctx: object, el: (id: string) => El, document: object, input: El, output: El, type: (cmd: string) => void, run: (cmd: string) => string, bootError: string|null, commandNames: () => string[]}}
 */
export function boot(htmlPath = APP_PATH) {
  const html = readFileSync(htmlPath, 'utf8');
  const open = html.indexOf('<script>');
  const close = html.lastIndexOf('</script>');
  if (open < 0 || close < 0) throw new Error('index.html has no <script> block');

  // `const`/`let` at the top level of a vm script stay lexical, so export the
  // engine entry points explicitly instead of reaching into the global object.
  const source =
    html.slice(open + '<script>'.length, close) +
    '\n;globalThis.__EXEC = EXEC; globalThis.__CMD = CMD;';

  const elements = new Map();
  const el = (id) => {
    if (!elements.has(id)) elements.set(id, new El('div', id));
    return elements.get(id);
  };

  const input = el('cmd-input');
  const output = el('output');

  const docListeners = new Map();
  const document = {
    getElementById: el,
    createElement: (t) => new El(t),
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, []);
      docListeners.get(type).push(fn);
    },
    body: new El('body'),
    documentElement: new El('html'),
    activeElement: input,
  };

  const store = new Map();
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    key: (i) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  };

  const ctx = vm.createContext({
    document,
    localStorage,
    console,
    setTimeout,
    clearTimeout,
    navigator: { language: 'zh-CN', userAgent: 'test-harness' },
    location: { href: 'file:///index.html' },
  });
  ctx.window = ctx;
  ctx.globalThis = ctx;
  ctx.self = ctx;

  let bootError = null;
  try {
    vm.runInContext(source, ctx, { filename: 'index.html', timeout: 20000 });
    for (const fn of docListeners.get('DOMContentLoaded') ?? []) fn({});
  } catch (err) {
    bootError = err.stack ?? String(err);
  }

  const run = (cmd) => {
    try {
      return String(ctx.__EXEC?.(cmd) ?? '');
    } catch (err) {
      return '<<EXCEPTION>> ' + String(err).slice(0, 160);
    }
  };

  // Drives the same keydown path a user does, so history/practice side effects apply.
  const type = (cmd) => {
    input.value = cmd;
    for (const fn of docListeners.get('keydown') ?? []) fn({ key: 'Enter', preventDefault() {} });
  };

  return {
    ctx,
    el,
    document,
    input,
    output,
    run,
    type,
    bootError,
    commandNames: () => Object.keys(ctx.__CMD ?? {}),
  };
}
