# Changelog / 更新日志

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
