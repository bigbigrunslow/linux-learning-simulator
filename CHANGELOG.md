# Changelog / 更新日志

## v1.4.0 — 2026-08-04

### 中文

#### 新增

- 练习体系三层化：命令专项（`practice <命令>` 全用法练习）、学习项目（`practice path <项目>`：Linux 基础 / Shell / 网络 / Docker / K8s / 中间件 / CI/CD / 监控）、命令百科（`learn <命令>`）
- 考试模式 `exam <项目>`：随机抽 10 题自动判分，70% 通过，成绩记录
- 学习统计 `stats`：完成度、用过的命令、连续学习天数、常输错命令、考试记录
- `bash <脚本>` 脚本执行：变量赋值、注释、`;`、`$( )`/反引号命令替换，引号感知展开（单引号字面量、双引号展开）
- 状态机：`systemctl` 启停服务、`docker stop/start/rm/run` 改变容器列表、`kill/pkill` 后进程从 `ps` 消失
- 新命令：`printf`、`read`、`test`、`sleep`、`timeout`、`tree`、`basename`、`dirname`、`jq`、`nmap`、`lang`、`guide`，命令总数 371
- 全部 371 个命令配齐手写 📖 用途说明，练习与百科双语展示
- 英文版：工具栏 🌐 或 `lang [zh|en]` 切换，界面/练习/考试/统计/百科/帮助全英文，选择自动记忆
- 命令速查分类：中间件、K8s、CI/CD 独立成类
- 学习指南内嵌：新增 `guide` 命令（11 阶段讲解 / 实战练习题 / 命令速查表，双语），原独立 `学习指南.html` 已合并删除

#### 修复

- 管道真正传数据、引号内 `|`/`&&` 不再误切；`sudo bash` 后 `exit` 正常退回
- vi 编辑器焦点、`dd` 删行、普通模式漏字问题
- 服务/容器/进程输出与真实状态一致；侧栏分类折叠渲染修复

### English

#### Added

- Three-layer practice system: command drills (`practice <command>`), learning projects (`practice path <project>`: Linux Basics / Shell / Networking / Docker / K8s / Middleware / CI/CD / Monitoring), and the `learn <command>` encyclopedia
- Exam mode `exam <project>`: 10 random auto-graded questions, 70% to pass, results recorded
- Learning stats `stats`: completion, commands used, study streak, frequently mistyped commands, exam history
- `bash <script>` execution: variables, comments, `;`, `$( )`/backtick substitution, quote-aware expansion
- State machines: `systemctl` start/stop, `docker stop/start/rm/run`, `kill/pkill` reflected in `ps`
- New commands: `printf`, `read`, `test`, `sleep`, `timeout`, `tree`, `basename`, `dirname`, `jq`, `nmap`, `lang`, `guide` (371 total)
- Hand-written 📖 explanations for all 371 commands, shown bilingually
- English UI: toggle with the 🌐 button or `lang [zh|en]`, remembered automatically
- Quick-reference categories: Middleware, K8s, CI/CD
- Learning guide embedded: new `guide` command (11-stage explanations / exercises / cheat sheet, bilingual); the standalone `学习指南.html` was merged and removed

#### Fixed

- Pipes now pass real data; `|`/`&&` inside quotes no longer split; `exit` after `sudo bash` works
- vi editor focus, `dd` line delete, and NORMAL-mode key leaks
- Service/container/process output now matches real state; sidebar category rendering fixed

## v1.3.0 — 2026-08-04

### 中文

- 练习模式上线：44 个与学习指南同步的任务，自动判题、自动推进、进度保存；侧栏任务卡

### English

- Practice mode: 44 tasks synced with the learning guide, auto-checked with saved progress and a sidebar task card

## v1.0.0 — 2026-07-25

### 中文

- 首个版本：355 个命令、Vi 编辑器、全局硬件模拟、11 阶段学习指南、GitHub Pages 部署

### English

- Initial release: 355 commands, Vi editor, global hardware simulation, 11-stage learning guide, GitHub Pages deployment
