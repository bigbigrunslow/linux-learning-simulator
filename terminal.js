/* xterm display layer for the Linux Learning Simulator engine */
(function () {
  let term = null;
  let fitAddon = null;
  let termLine = '';
  let termCursor = 0;
  let termHistory = [];
  let histIdx = -1;
  let vi = null; // active vi session (alternate screen)
  let viPending = ''; // dd / yy pending key
  const THEMES = {
    tokyo: { background: '#1a1b26', foreground: '#c0caf5', cursor: '#7aa2f7', cursorAccent: '#1a1b26', selectionBackground: '#3b4261', black: '#1d202f', red: '#f7768e', green: '#9ece6a', yellow: '#e0af68', blue: '#7aa2f7', magenta: '#bb9af7', cyan: '#7dcfff', white: '#a9b1d6' },
    green: { background: '#000000', foreground: '#00ff66', cursor: '#00ff66', cursorAccent: '#000000', selectionBackground: '#005f33', black: '#000000', red: '#ff4444', green: '#00ff66', yellow: '#ffff44', blue: '#44aaff', magenta: '#ff44ff', cyan: '#44ffff', white: '#bbbbbb' },
    light: { background: '#ffffff', foreground: '#24292e', cursor: '#0969da', cursorAccent: '#ffffff', selectionBackground: '#b6d7ff', black: '#24292e', red: '#cf222e', green: '#116329', yellow: '#4d2d00', blue: '#0969da', magenta: '#8250df', cyan: '#1b7c83', white: '#6e7781' },
  };
  let currentTheme = 'tokyo';

  function prompt() { return getPrompt(); }

  function colorFor(cls) {
    if (cls === 'cmd-info') return '\x1b[38;5;222m';
    if (cls === 'cmd-err') return '\x1b[38;5;203m';
    if (cls === 'cmd-line') return '\x1b[38;5;111m';
    return '';
  }

  window.appendOutput = function (text, className) {
    const s = String(text == null ? '' : text).replace(/\n/g, '\r\n');
    const c = colorFor(className);
    if (term) {
      if (c) term.write(c + s + '\x1b[0m');
      else term.write(s);
      term.write('\r\n');
    }
    const out = document.getElementById('output');
    if (out) {
      const div = document.createElement('div');
      div.className = className || 'cmd-out';
      div.textContent = text;
      out.appendChild(div);
    }
  };

  function renderLine() {
    const p = prompt();
    const line = termLine;
    term.write('\r\x1b[K');
    term.write('\x1b[38;5;114m' + p + '\x1b[0m' + line);
    term.write('\x1b[' + (p.length + termCursor + 1) + 'G');
  }

  function printPrompt() {
    term.write('\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m');
    termLine = '';
    termCursor = 0;
  }

  function printColoredPromptInline() {
    term.write('\x1b[38;5;114m' + prompt() + '\x1b[0m');
  }

  function runTaskCheck() {
    const checkList = examState ? [TASK_MAP[examState.questions[examState.index]]].filter(Boolean) : focusTasks();
    const completedNow = checkList.filter((t) => !taskProgress.done.includes(t.id) && t.check());
    if (completedNow.length === 0) return;
    completedNow.forEach((t) => taskProgress.done.push(t.id));
    saveTaskProgress();
    if (examState) {
      examState.score++;
      examState.index++;
      if (examState.index >= examState.questions.length) {
        const total = examState.questions.length;
        const pass = examState.score >= Math.ceil(total * 0.7);
        stats.exams.push({ path: examState.path, score: examState.score, total, pass, date: new Date().toISOString().slice(0, 10) });
        saveStats();
        appendOutput((lang === 'en' ? '🎉 Exam finished: ' : '🎉 考试结束：') + examState.score + '/' + total + (pass ? (lang === 'en' ? ' ✅ Passed!' : ' ✅ 通过！') : (lang === 'en' ? ' ❌ Not passed. Keep practicing!' : ' ❌ 未通过，再练练吧！')), 'cmd-info');
        appendOutput(lang === 'en' ? 'Run exam <project> to retake; stats shows your results.' : '输入 exam <项目> 可重新考试，stats 查看成绩。', 'cmd-info');
        examState = null;
      } else {
        appendOutput((lang === 'en' ? '✅ Question ' : '✅ 第 ') + examState.index + (lang === 'en' ? ' done! Score ' : ' 题完成！得分 ') + examState.score, 'cmd-info');
        appendOutput((lang === 'en' ? '▶ Question ' : '▶ 第 ') + (examState.index + 1) + (lang === 'en' ? ': ' : ' 题：') + examQuestionText(), 'cmd-info');
      }
      buildSidePanel();
    } else {
      const focusList = focusTasks();
      const focusDoneCount = focusList.filter((t) => taskProgress.done.includes(t.id)).length;
      appendOutput((lang === 'en' ? '✅ Task complete: ' : '✅ 任务完成：') + completedNow.map((t) => taskTitle(t)).join(', ') + ' (' + focusName() + ' ' + focusDoneCount + '/' + focusList.length + ')', 'cmd-info');
      appendOutput('📖 ' + taskExp(completedNow[0]), 'cmd-info');
      const nextTask = currentTask();
      if (nextTask) appendOutput((lang === 'en' ? '▶ Next task [' : '▶ 下一任务 [') + nextTask.id + ']: ' + taskTitle(nextTask) + '\n📖 ' + taskExp(nextTask) + '\n🔧 ' + (lang === 'en' ? 'Run: ' : '请执行：') + nextTask.hint, 'cmd-info');
      else {
        const nextPath = PATH_ORDER.find((key) => {
          const tasks = Object.values(TASK_MAP).filter((t) => t.path === key);
          return tasks.length > 0 && tasks.some((t) => !taskProgress.done.includes(t.id));
        });
        appendOutput('🎉 ' + focusName() + (lang === 'en' ? ' complete!' : ' 全部完成！') + (nextPath ? (lang === 'en' ? ' Next: practice path ' : ' 建议下一路线：practice path ') + nextPath : (lang === 'en' ? ' All projects done!' : ' 所有路线都完成啦！')), 'cmd-info');
      }
      buildSidePanel();
    }
  }

  function runLine() {
    const line = termLine;
    termLine = '';
    termCursor = 0;
    if (!line.trim()) { term.write('\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m'); return; }
    const trimmed = line.trim();
    if (trimmed === 'clear') { term.clear(); term.write('\x1b[38;5;114m' + prompt() + '\x1b[0m'); return; }
    if (/^theme(\s|$)/.test(trimmed)) {
      const name = trimmed.split(/\s+/)[1];
      if (name && THEMES[name]) {
        currentTheme = name;
        term.options.theme = THEMES[name];
        try { localStorage.setItem('xterm-theme', name); } catch (e) {}
        term.write('\r\n' + (lang === 'en' ? 'Theme: ' : '主题：') + name);
        term.write('\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m');
        return;
      }
      term.write('\r\n' + (lang === 'en' ? 'Themes: tokyo / green / light (current: ' : '主题：tokyo / green / light（当前：') + currentTheme + (lang === 'en' ? ')' : '）'));
      term.write('\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m');
      return;
    }
    if (/^(vi|vim)(\s|$)/.test(trimmed)) { openVi(trimmed.split(/\s+/)[1] || 'untitled.txt'); return; }
    if (termHistory[termHistory.length - 1] !== trimmed) {
      termHistory.push(trimmed);
      if (termHistory.length > 1000) termHistory.shift();
    }
    history.push(trimmed);
    if (history.length > 1000) history.shift();
    histIdx = -1;
    let result;
    try { result = EXEC(trimmed); } catch (e) { result = 'Error: ' + e.message; }
    if (result && String(result).trim()) {
      term.write('\r\n');
      const s = String(result).replace(/\n/g, '\r\n');
      term.write(s);
    }
    updatePromptDisplay();
    runTaskCheck();
    term.write('\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m');
  }

  /* ---- Tab completion (mirrors engine behavior) ---- */
  function doTabComplete() {
    const words = termLine.split(' ');
    const last = words[words.length - 1] || '';
    if (words.length === 1) {
      const matches = Object.keys(CMD).filter((c) => c.startsWith(last));
      if (matches.length === 1) {
        termLine = matches[0] + ' ';
        termCursor = termLine.length;
        renderLine();
      } else if (matches.length > 1) {
        term.write('\r\n' + matches.join('  ') + '\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m' + termLine);
      }
      return;
    }
    const currentPath = resolvePath(last || '.');
    const [parent, partial] = VFS.splitPath(currentPath);
    const entries = VFS.listDir(parent);
    if (!entries) return;
    const matchKeys = Object.keys(entries).filter((e) => e.startsWith(partial || ''));
    if (matchKeys.length === 1) {
      const parentPath = parent === '/' ? '' : parent;
      words[words.length - 1] = parentPath + '/' + matchKeys[0];
      termLine = words.join(' ');
      termCursor = termLine.length;
      renderLine();
    } else if (matchKeys.length > 1) {
      term.write('\r\n' + matchKeys.join('  ') + '\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m' + termLine);
    }
  }

  /* ---- vi editor (alternate screen) ---- */
  function openVi(file) {
    const content = VFS.getFile(file);
    vi = {
      mode: 'NORMAL', file, original: content === null ? '' : content,
      lines: (content === null ? '' : content).split('\n'),
      row: 0, col: 0, yank: '', cmd: '', search: '', hint: '', openAt: Date.now(), vmode: null,
    };
    term.write('\x1b[?1049h');
    viRender();
  }

  function viClose(save) {
    if (save) {
      if (!canWrite(vi.file)) {
        vi.mode = 'NORMAL';
        vi.cmd = '';
        vi.hint = lang === 'en' ? 'Permission denied (use sudo)' : 'Permission denied（使用 sudo）';
        viRender();
        return;
      }
      VFS.writeFile(vi.file, vi.lines.join('\n'));
    }
    term.write('\x1b[?1049l');
    vi = null;
    viPending = '';
    term.write('\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m');
  }

  function viRender() {
    const rows = Math.max(4, term.rows - 4);
    const start = Math.max(0, vi.row - rows + 1);
    const sel = vi.mode === 'VISUAL' && vi.vmode
      ? { r1: Math.min(vi.vmode.row, vi.row), r2: Math.max(vi.vmode.row, vi.row), c1: Math.min(vi.vmode.col, vi.col), c2: Math.max(vi.vmode.col, vi.col) }
      : null;
    term.write('\x1b[2J\x1b[H');
    for (let r = 0; r < rows; r++) {
      const i = start + r;
      const line = i < vi.lines.length ? vi.lines[i] : '~';
      if (sel && i >= sel.r1 && i <= sel.r2) {
        const a = i === sel.r1 ? sel.c1 : 0;
        const b = i === sel.r2 ? sel.c2 : line.length;
        term.write(line.slice(0, a) + '\x1b[7m' + line.slice(a, b) + '\x1b[0m' + line.slice(b));
      } else {
        term.write(line.slice(0, term.cols));
      }
      term.write('\r\n');
    }
    let modeTxt = vi.mode === 'INSERT' ? '-- INSERT --' : vi.mode === 'COMMAND' ? '-- COMMAND --' : vi.mode === 'VISUAL' ? '-- VISUAL --' : '-- NORMAL --';
    if (vi.mode === 'NORMAL') {
      if (vi.hint) { modeTxt += ' | ' + vi.hint; }
      else if (Date.now() - vi.openAt < 2500) { modeTxt += ' | ' + (lang === 'en' ? 'press i to insert' : '按 i 进入插入模式'); }
    }
    term.write('\x1b[K' + modeTxt + '  ' + vi.file + '  行' + (vi.row + 1) + '/' + vi.lines.length + '  列' + (vi.col + 1) + '\r\n');
    term.write('\x1b[K\x1b[2m' + (lang === 'en'
      ? 'i insert · Esc normal · h j k l move · dd delete · yy yank · p put · / search · :wq save & quit'
      : 'i 插入 · Esc 普通 · h j k l 移动 · dd 删行 · yy 复制 · p 粘贴 · / 搜索 · :wq 保存退出') + '\x1b[0m\r\n');
    if (vi.mode === 'COMMAND') term.write(':' + vi.cmd);
    else term.write(' ');
    const relRow = vi.row - start + 1;
    term.write('\x1b[' + (rows + 3 - relRow) + 'A\x1b[' + (vi.col + 1) + 'G');
  }

  function viLine(row) { return vi.lines[row] || ''; }

  function viInsertAt(row, col, text) {
    const line = viLine(row);
    vi.lines[row] = line.slice(0, col) + text + line.slice(col);
    vi.col = col + text.length;
  }

  function viDeleteAt(row, col) {
    const line = viLine(row);
    if (col < line.length) {
      vi.lines[row] = line.slice(0, col) + line.slice(col + 1);
    } else if (row < vi.lines.length - 1) {
      vi.lines[row] = line + viLine(row + 1);
      vi.lines.splice(row + 1, 1);
    }
  }

  function viSearch() {
    const q = vi.search;
    if (!q) return;
    for (let i = vi.row + 1; i < vi.lines.length; i++) {
      if (viLine(i).includes(q)) { vi.row = i; vi.col = 0; return; }
    }
    for (let i = 0; i <= vi.row; i++) {
      if (viLine(i).includes(q)) { vi.row = i; vi.col = 0; return; }
    }
  }

  function viKey(data) {
    if (data === '\x1b') {
      if (vi.mode === 'COMMAND') { vi.mode = 'NORMAL'; vi.cmd = ''; }
      else if (vi.mode === 'INSERT') { vi.mode = 'NORMAL'; }
      else if (vi.mode === 'VISUAL') { vi.mode = 'NORMAL'; vi.vmode = null; }
      viRender();
      return;
    }
    if (data === '\x1b[A') { vi.row = Math.max(0, vi.row - 1); viRender(); return; }
    if (data === '\x1b[B') { vi.row = Math.min(vi.lines.length - 1, vi.row + 1); vi.col = Math.min(vi.col, viLine(vi.row).length); viRender(); return; }
    if (data === '\x1b[C') { vi.col = Math.min(viLine(vi.row).length, vi.col + 1); viRender(); return; }
    if (data === '\x1b[D') { vi.col = Math.max(0, vi.col - 1); viRender(); return; }

    if (vi.mode === 'COMMAND') {
      if (data === '\r') {
        const cmd = vi.cmd.trim();
        if (cmd === 'w') { viClose(true); }
        else if (cmd === 'q') { viClose(false); }
        else if (cmd === 'wq' || cmd === 'x' || cmd === 'wq!') { viClose(true); }
        else if (cmd === 'q!') { viClose(false); }
        else if (cmd.startsWith('/')) {
          vi.search = cmd.slice(1);
          vi.mode = 'NORMAL';
          viSearch();
          viRender();
        } else { vi.mode = 'NORMAL'; vi.cmd = ''; viRender(); }
        return;
      }
      if (data === '\x7f') { vi.cmd = vi.cmd.slice(0, -1); viRender(); return; }
      vi.cmd += data;
      viRender();
      return;
    }

    if (vi.mode === 'INSERT') {
      if (data === '\x1b') { vi.mode = 'NORMAL'; viRender(); return; }
      if (data === '\r') {
        const rest = viLine(vi.row).slice(vi.col);
        vi.lines[vi.row] = viLine(vi.row).slice(0, vi.col);
        vi.lines.splice(vi.row + 1, 0, rest);
        vi.row++; vi.col = 0;
        viRender(); return;
      }
      if (data === '\x7f') {
        if (vi.col > 0) { vi.col--; viDeleteAt(vi.row, vi.col); }
        else if (vi.row > 0) {
          const prevLen = viLine(vi.row - 1).length;
          vi.lines[vi.row - 1] = viLine(vi.row - 1) + viLine(vi.row);
          vi.lines.splice(vi.row, 1);
          vi.row--; vi.col = prevLen;
        }
        viRender(); return;
      }
      viInsertAt(vi.row, vi.col, data);
      viRender(); return;
    }

    // NORMAL mode
    if (vi.mode === 'VISUAL' && (data === 'd' || data === 'y')) {
      const a = vi.vmode || { row: vi.row, col: vi.col };
      const r1 = Math.min(a.row, vi.row);
      const r2 = Math.max(a.row, vi.row);
      if (r1 === r2) {
        const c1 = Math.min(a.col, vi.col);
        const c2 = Math.max(a.col, vi.col);
        const line = viLine(r1);
        if (data === 'd') { vi.lines[r1] = line.slice(0, c1) + line.slice(c2); vi.row = r1; vi.col = c1; }
        else vi.yank = line.slice(c1, c2);
      } else {
        const rowsSel = vi.lines.slice(r1, r2 + 1);
        if (data === 'y') vi.yank = rowsSel.join('\n');
        else { vi.lines.splice(r1, r2 - r1 + 1); if (!vi.lines.length) vi.lines = ['']; vi.row = Math.min(r1, vi.lines.length - 1); vi.col = 0; }
      }
      vi.mode = 'NORMAL';
      vi.vmode = null;
      viRender();
      return;
    }
    if (viPending) {
      if (viPending === 'g' && data === 'g') {
        vi.row = 0; vi.col = 0;
      } else if (viPending === 'r') {
        if (vi.col < viLine(vi.row).length) {
          const line = viLine(vi.row);
          vi.lines[vi.row] = line.slice(0, vi.col) + data + line.slice(vi.col + 1);
          vi.col++;
        }
      } else if (viPending === 'd' && data === 'd') {
        vi.lines.splice(vi.row, 1);
        if (vi.lines.length === 0) vi.lines = [''];
        vi.row = Math.min(vi.row, vi.lines.length - 1);
        vi.col = 0;
      } else if (viPending === 'y' && data === 'y') {
        vi.yank = viLine(vi.row);
      }
      viPending = '';
      viRender(); return;
    }
    switch (data) {
      case 'i': vi.mode = 'INSERT'; break;
      case 'a': vi.mode = 'INSERT'; vi.col = Math.min(viLine(vi.row).length, vi.col + 1); break;
      case 'I': vi.mode = 'INSERT'; vi.col = 0; break;
      case 'A': vi.mode = 'INSERT'; vi.col = viLine(vi.row).length; break;
      case 'o': vi.lines.splice(vi.row + 1, 0, ''); vi.row++; vi.col = 0; vi.mode = 'INSERT'; break;
      case 'O': vi.lines.splice(vi.row, 0, ''); vi.col = 0; vi.mode = 'INSERT'; break;
      case 'v': vi.mode = 'VISUAL'; vi.vmode = { row: vi.row, col: vi.col }; break;
      case 'h': vi.col = Math.max(0, vi.col - 1); break;
      case 'l': vi.col = Math.min(viLine(vi.row).length, vi.col + 1); break;
      case 'j': vi.row = Math.min(vi.lines.length - 1, vi.row + 1); break;
      case 'k': vi.row = Math.max(0, vi.row - 1); break;
      case '0': vi.col = 0; break;
      case '$': vi.col = viLine(vi.row).length; break;
      case 'w': { const t = viLine(vi.row); let p = vi.col; while (p < t.length && t[p] === ' ') p++; while (p < t.length && t[p] !== ' ') p++; vi.col = p; break; }
      case 'b': { const t = viLine(vi.row); let p = vi.col; while (p > 0 && t[p - 1] === ' ') p--; while (p > 0 && t[p - 1] !== ' ') p--; vi.col = p; break; }
      case 'e': { const t = viLine(vi.row); let p = vi.col; while (p < t.length && t[p] !== ' ' && t[p + 1] !== ' ' && p < t.length - 1) p++; if (p < t.length) p++; vi.col = p; break; }
      case 'G': vi.row = vi.lines.length - 1; vi.col = 0; break;
      case 'g': viPending = 'g'; break;
      case 'd': viPending = 'd'; break;
      case 'y': viPending = 'y'; break;
      case 'r': viPending = 'r'; break;
      case 'x': viDeleteAt(vi.row, vi.col); break;
      case 'p': if (vi.yank !== '') { vi.lines.splice(vi.row + 1, 0, vi.yank); vi.row++; vi.col = 0; } break;
      case 'P': if (vi.yank !== '') { vi.lines.splice(vi.row, 0, vi.yank); vi.col = 0; } break;
      case 'n': if (vi.search) { const q = vi.search; for (let i = vi.row + 1; i < vi.lines.length; i++) { if (viLine(i).includes(q)) { vi.row = i; vi.col = 0; break; } } } break;
      case 'N': if (vi.search) { const q = vi.search; for (let i = vi.row - 1; i >= 0; i--) { if (viLine(i).includes(q)) { vi.row = i; vi.col = 0; break; } } } break;
      case 'u': vi.lines = vi.original.split('\n'); vi.row = 0; vi.col = 0; break;
      case ':': vi.mode = 'COMMAND'; vi.cmd = ''; break;
      case '/': vi.mode = 'COMMAND'; vi.cmd = '/'; break;
      case 'Z': viClose(true); return;
      case '\r': vi.row = Math.min(vi.lines.length - 1, vi.row + 1); break;
      case '\x1b': break;
      default:
        vi.hint = lang === 'en' ? 'press i to insert' : '按 i 进入插入模式';
        break;
    }
    if (vi.mode === 'INSERT' || vi.mode === 'COMMAND') vi.hint = '';
    viRender();
  }

  /* ---- shell input ---- */
  function onData(data) {
    if (vi) { viKey(data); return; }
    if (data === '\r') { runLine(); return; }
    if (data === '\x7f') {
      if (termCursor > 0) {
        termLine = termLine.slice(0, termCursor - 1) + termLine.slice(termCursor);
        termCursor--;
        renderLine();
      }
      return;
    }
    if (data === '\x0c') { term.clear(); renderLine(); return; }
    if (data === '\x03') { termLine = ''; termCursor = 0; term.write('^C\r\n\x1b[38;5;114m' + prompt() + '\x1b[0m'); return; }
    if (data === '\x17') { // Ctrl+W delete word
      let end = termCursor;
      while (end > 0 && termLine[end - 1] === ' ') end--;
      while (end > 0 && termLine[end - 1] !== ' ') end--;
      termLine = termLine.slice(0, end) + termLine.slice(termCursor);
      termCursor = end;
      renderLine(); return;
    }
    if (data === '\x15') { // Ctrl+U clear to line start
      termLine = termLine.slice(termCursor);
      termCursor = 0;
      renderLine(); return;
    }
    if (data === '\x1b[H') { termCursor = 0; renderLine(); return; }
    if (data === '\x1b[F') { termCursor = termLine.length; renderLine(); return; }
    if (data === '\x1b[3~') {
      if (termCursor < termLine.length) {
        termLine = termLine.slice(0, termCursor) + termLine.slice(termCursor + 1);
        renderLine();
      }
      return;
    }
    if (data === '\t') { doTabComplete(); return; }
    if (data === '\x1b[A') {
      if (termHistory.length === 0) return;
      if (histIdx === -1) histIdx = termHistory.length - 1;
      else if (histIdx > 0) histIdx--;
      termLine = termHistory[histIdx]; termCursor = termLine.length; renderLine(); return;
    }
    if (data === '\x1b[B') {
      if (histIdx === -1) return;
      if (histIdx < termHistory.length - 1) { histIdx++; termLine = termHistory[histIdx]; }
      else { histIdx = -1; termLine = ''; }
      termCursor = termLine.length; renderLine(); return;
    }
    if (data === '\x1b[C') { termCursor = Math.min(termLine.length, termCursor + 1); renderLine(); return; }
    if (data === '\x1b[D') { termCursor = Math.max(0, termCursor - 1); renderLine(); return; }
    if (data.startsWith('\x1b')) return;
    // paste may contain newlines: execute line-by-line
    if (data.indexOf('\n') !== -1 || data.indexOf('\r') !== -1) {
      const parts = data.replace(/\r/g, '').split('\n');
      parts.forEach((p, idx) => {
        if (idx === 0) { termLine = termLine.slice(0, termCursor) + p + termLine.slice(termCursor); termCursor += p.length; runLine(); }
        else if (p.length > 0) { termLine = p; termCursor = p.length; runLine(); }
      });
      return;
    }
    for (const ch of data) {
      if (ch.charCodeAt(0) < 32) continue;
      termLine = termLine.slice(0, termCursor) + ch + termLine.slice(termCursor);
      termCursor++;
    }
    renderLine();
  }

  function initTerminal() {
    const el = document.getElementById('xterm');
    if (!el || typeof Terminal === 'undefined') return;
    term = new Terminal({
      fontFamily: "'Cascadia Code','Fira Code','JetBrains Mono',Consolas,monospace",
      fontSize: 14, lineHeight: 1.25, cursorBlink: true, scrollback: 2000,
      theme: THEMES.tokyo,
    });
    try {
      const saved = localStorage.getItem('xterm-theme');
      if (saved && THEMES[saved]) { currentTheme = saved; term.options.theme = THEMES[saved]; }
    } catch (e) {}
    fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(el);
    window.__term = term;
    fitAddon.fit();

    const out = document.getElementById('output');
    if (out) {
      Array.prototype.forEach.call(out.children, (div) => {
        term.write((div.textContent || '').replace(/\n/g, '\r\n'));
        term.write('\r\n');
      });
    }
    term.onData(onData);
    window.addEventListener('resize', () => { if (fitAddon) fitAddon.fit(); });
    if (window.ResizeObserver) {
      const box = document.getElementById('terminal');
      if (box) new ResizeObserver(() => { if (fitAddon) fitAddon.fit(); }).observe(box);
    }
    // click: focus the shell, or position the vi cursor
    term.element.addEventListener('mousedown', (e) => {
      if (!vi) { term.focus(); return; }
      const rect = term.element.getBoundingClientRect();
      const dims = term._core && term._core._renderService && term._core._renderService.dimensions;
      if (!dims || !dims.css || !dims.css.cell.width || !dims.css.cell.height) return;
      const col = Math.max(0, Math.floor((e.clientX - rect.left) / dims.css.cell.width));
      const relRow = Math.max(0, Math.floor((e.clientY - rect.top) / dims.css.cell.height));
      const rows = Math.max(4, term.rows - 4);
      const start = Math.max(0, vi.row - rows + 1);
      const absRow = start + relRow;
      if (absRow < vi.lines.length) {
        vi.row = absRow;
        vi.col = Math.min(viLine(absRow).length, col);
        viRender();
      }
    });
    // Ctrl+Shift+C / Ctrl+Shift+V copy-paste
    term.attachCustomKeyEventHandler((e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '=')) { term.options.fontSize = Math.min(28, (term.options.fontSize || 14) + 1); fitAddon.fit(); return false; }
      if (e.ctrlKey && e.key === '-') { term.options.fontSize = Math.max(8, (term.options.fontSize || 14) - 1); fitAddon.fit(); return false; }
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        const sel = term.getSelection();
        if (sel) {
          try { navigator.clipboard.writeText(sel); } catch (err) { /* clipboard unavailable on file:// */ }
        }
        return false;
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'V' || e.key === 'v')) {
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard.readText().then((t) => { if (t) term.paste(t); }).catch(() => {});
        }
        return false;
      }
      return true;
    });

    // Side panel interactions should drive the xterm line
    const panel = document.getElementById('side-panel');
    if (panel) {
      panel.addEventListener('click', (e) => {
        if (e.target.classList.contains('cmd-item')) {
          termLine = e.target.textContent + ' ';
          termCursor = termLine.length;
          renderLine();
        } else if (e.target.id === 'task-card') {
          termLine = 'practice start';
          termCursor = termLine.length;
          renderLine();
        }
      });
    }

    term.focus();
    setTimeout(() => { term.write('\r\n' + prompt()); }, 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initTerminal);
  else initTerminal();
})();
