# Changelog / 更新日志

## v1.3.0 — 2026-08-04

### 中文

#### 新增

- 练习模式：内置 44 个与学习指南 11 阶段同步的练习任务（文件操作、文本处理、系统监控、硬件磁盘、网络、用户权限、软件包、服务、Shell、Vi、DevOps）
- `practice` 命令：`practice` 查看任务列表、`practice start`/`next` 开始或进入下一任务、`practice <编号>` 跳转、`practice reset` 重置
- 自动判题：执行命令后自动检查当前任务，完成即打勾并提示下一任务
- 进度持久化：任务进度存入 localStorage，刷新不丢
- 侧栏学习任务卡：实时显示当前任务与提示，点击一键开始
- 学习指南同步说明：指南顶部提示在模拟器中输入 `practice` 开始练习
- 命令总数更新为 356（新增 `practice` 命令）

### English

#### Added

- Practice mode: 44 tasks synced with the 11 stages of the learning guide (file ops, text processing, monitoring, hardware/disk, networking, permissions, packages, services, shell, vi, DevOps)
- `practice` command: list tasks, `practice start`/`next`, `practice <number>`, `practice reset`
- Auto-checking: after each command the current task is verified, marked ✅, and the next task is shown
- Progress persistence via localStorage
- Sidebar task card showing the current task and hint, one-click to start
- Learning guide updated with instructions to run `practice` in the simulator
- Command count updated to 356 (new `practice` command)

## v1.2.1 — 2026-08-04

### 中文

#### 改进

- 一键式入口：README 将 GitHub Pages 在线版列为首选使用方式（点击即用，无需克隆/安装），`git clone` 改为开发者选项
- 学习指南顶部新增“🚀 打开模拟器开始练习”按钮，文档与模拟器一键互跳
- README 去重重写，中英署名分行显示

### English

#### Improved

- One-click entry: README now recommends the GitHub Pages online version (click to use, no clone/install); `git clone` is the developer option
- The learning guide now has a “🚀 Open Simulator” button at the top for one-click navigation
- Rewrote README, removed duplicated sections, and separated the bilingual attribution lines

## v1.2.0 — 2026-08-04

### 中文

#### 新增

- `grep` 支持正则表达式（`^` `$` `[0-9]` `.` `*` 等），无效正则给出错误提示
- `sed` 支持 `s/old/new/`、`s/old/new/g` 替换与 `-i` 写回文件，支持管道输入
- `&&` 短路：前一条命令失败时后续命令不再执行；新增 `||` 逻辑或
- 退出码 `$?`：成功为 0、失败为 1，可用 `echo $?` 查看；`false`/`true` 命令
- 环境变量展开：`echo $HOME`、`echo $USER` 等
- 权限模型：`chmod`/`chown` 持久化，`ls -l`/`stat` 显示真实权限与属主；普通用户写 `/etc`、`/proc`、`/usr`、`/var/log`、`/var/www`、`/boot` 被拒绝，`sudo` 可写（含 vi 保存拦截）
- `ls -l` 与 `stat` 数据一致：文件大小来自内容长度、权限来自 `chmod`，不再随机
- `ls` 支持直接查看单个文件（如 `ls -l /tmp/x.txt`）

### English

#### Added

- `grep` now supports regular expressions (`^` `$` `[0-9]` `.` `*` etc.) with error reporting for invalid patterns
- `sed` supports `s/old/new/` and `s/old/new/g` substitution, `-i` write-back, and piped stdin
- `&&` short-circuits after a failed command; new `||` fallback support
- Exit code `$?` (0 success / 1 failure) and `true`/`false` commands
- Environment variable expansion (`echo $HOME`, `echo $USER`, ...)
- Permission model: `chmod`/`chown` persist, `ls -l`/`stat` show real mode/owner; regular users are denied writes to `/etc`, `/proc`, `/usr`, `/var/log`, `/var/www`, `/boot`; `sudo` bypasses (including vi save interception)
- `ls -l` and `stat` are consistent: sizes from content, modes from `chmod`, no random values
- `ls` can now inspect a single file directly (e.g., `ls -l /tmp/x.txt`)

## v1.1.1 — 2026-08-04

### 中文

#### 修复

- Vi 普通模式会漏入未处理的字母键：直接输入 `hello` 时 `h` 被当作光标左移、`e` 漏进文本，造成“h 打不出来”的混乱。现在普通模式会吞掉所有可打印字符，并提示“按 i 进入插入模式”
- Vi 弹窗打开时立即聚焦输入区，避免首个按键丢失

### English

#### Fixed

- Vi NORMAL mode leaked unhandled letter keys into the text: typing `hello` directly consumed `h` as move-left and leaked `e`. Now all printable keys are consumed in NORMAL mode, with a hint to press `i` to insert
- Vi modal now focuses the textarea immediately on open, preventing a lost first keystroke

## v1.1.0 — 2026-08-04

### 中文

#### 新增

- 管道真正生效：`cat /etc/passwd | grep root`、`ps | head -3`、`wc -l`、`sort | uniq` 等可真实传递数据
- 管道/`&&` 拆分支持引号：`echo "a|b"`、`echo "a && b"` 不再被误切
- `grep` 支持 `-i`/`-n`/`-v`，`wc` 支持 `-l`/`-w`/`-c`
- 服务器配置：新增 `/var/www/html/index.html`、`/etc/nginx/nginx.conf`、`/etc/sudoers`
- 方向键 `↑`/`↓` 浏览命令历史
- 工具栏命令数徽章动态显示（355）
- Issue 模板（中英双语）

#### 修复

- Vi 编辑器弹窗聚焦失效，导致键盘输入丢失；`:wq` 保存、`dd` 删行（含删最后一行不留空行）等恢复正常
- `sudo bash` 后 `exit` 无法退回普通用户（`sudoMode` 未清除）
- `alertmanager`/`grafana`/`kafka`/`nfs` 等 30+ 服务命令无参时输出 `undefined`
- `cd /var/www` 不存在；`docker ps`/`kubectl get pods` 表格列粘连
- `echo` 重定向保留引号、不支持 `>>` 追加、引号内 `>` 误判为重定向
- `wc` 字数统计正则错误（`\\s+`）
- GitHub Pages favicon 404 控制台报错

### English

#### Added

- Working pipes: `cat /etc/passwd | grep root`, `ps | head -3`, `wc -l`, `sort | uniq` now pass data between commands
- Quote-aware pipe/`&&` splitting: `echo "a|b"` and `echo "a && b"` no longer break
- `grep` supports `-i`/`-n`/`-v`; `wc` supports `-l`/`-w`/`-c`
- Server configuration: added `/var/www/html/index.html`, `/etc/nginx/nginx.conf`, `/etc/sudoers`
- Command history navigation with `↑`/`↓`
- Dynamic command-count badge in the toolbar (355)
- Bilingual issue template

#### Fixed

- Vi editor modal focus bug that caused keyboard input to be lost; `:wq` save and `dd` line delete (including the last line without leaving an empty line) work again
- `exit` after `sudo bash` not returning to the normal user (leftover `sudoMode`)
- 30+ service commands (e.g., `alertmanager`, `grafana`, `kafka`, `nfs`) printing `undefined` without arguments
- `cd /var/www` failing; `docker ps` / `kubectl get pods` table columns sticking together
- `echo` redirect keeping quotes, missing `>>` append, and misreading `>` inside quotes
- `wc` word-count regex bug (`\\s+`)
- GitHub Pages favicon 404 console error

## v1.0.0 — 2026-07-25

### 中文

- 首个版本：355 个命令、Vi 编辑器、全局硬件模拟、11 阶段学习指南、GitHub Pages 部署

### English

- Initial release: 355 commands, Vi editor, global hardware simulation, 11-stage learning guide, GitHub Pages deployment
