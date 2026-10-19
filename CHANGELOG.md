# Changelog / 更新日志

## v1.5.0 — 2026-10-19

### 中文

#### 修复（命令保真度）

本版本集中修复「模拟器行为与真实 Linux 不一致」的问题。每项都有回归测试，见 `tests/`。

- `mkdir -p`：此前把 `-p` 当成路径，会在当前目录创建名为 `-p` 的目录且不递归。现支持 `-p` 递归创建、已存在时静默成功、缺父目录时正确报错
- `awk`：此前任何写法都只打印用法提示，功能完全不可用。现支持 `-F` 分隔符、`$0`/`$N`、`NF`/`NR`、逗号分隔的 `print`、`/regex/ {…}` 模式，可读文件或 stdin
- `tr`：此前不翻译，只打印说明。现支持字符翻译、`a-z` 范围、`-d` 删除、`-s` 压缩，并可读 `< file` 或管道
- `ls` 管道输出：`ls | wc -l` 由 `1` 修正为真实行数；管道下游按每行一个文件名输出
- `sort`：支持 `-n` 数值排序、`-r` 逆序、`-u` 去重；选项不再被当成文件名
- `uniq`：支持 `-c` 计数、`-d` 仅重复
- `grep`：支持 `-c` 计数
- `head` / `tail`：支持 `-2` 短选项写法
- 输入重定向 `< file`：此前被忽略，现对 `tr`/`awk`/`sort`/`wc`/`grep`/`sed` 等读 stdin 的命令统一生效
- `2>/dev/null`：此前无效，现正确丢弃 stderr
- `${VAR}` 与 `${#VAR}`：参数展开与长度展开
- `dpkg` 无参数：不再输出 `unknown option: undefined`
- `<命令> --help`：所有命令统一返回用法说明（此前 111 个命令把 `--help` 当普通参数，`touch --help` 会真的建文件）

#### 改进

- 终端输出上限 2000 行，长时间学习不再无限增长 DOM
- 可访问性：终端输出区加 `role="log"`、`aria-live="polite"`，输入框与语言/面板按钮补 `aria-label`
- 移动端：命令参考面板从「小于 768px 直接隐藏」改为工具栏 📚 抽屉，手机端不再丢失功能
- 首屏徽章命令数由硬编码 `355` 修正为 371

#### 工程

- 新增零依赖测试套件 `tests/`：371 命令冒烟 + 15 组行为保真断言，基于 Node 内置 test runner 与 DOM 桩，无需浏览器
- 新增 GitHub Actions `test` workflow：PR/push 自动跑测试，并校验 `index.html` 仍是单文件、无外部脚本/样式、体积 < 1 MB
- 新增 `package.json`（无依赖，仅 `npm test` 脚本与元数据）
- 新增 [docs/AUDIT-v1.4.0.md](docs/AUDIT-v1.4.0.md)：v1.4.0 的完整审计报告、缺陷清单与遗留建议

#### 文档订正

- v1.4.0 的 changelog 称 `学习指南.html`「已合并删除」，实际该文件仍在且被 README 引用。本版本予以澄清：独立指南页保留
- GitHub 仓库描述中的 `355 commands` 需在仓库设置中手动改为 371（无法从代码内修改）

### English

#### Fixed (command fidelity)

This release targets places where the simulator disagreed with real Linux. Each fix has a regression test under `tests/`.

- `mkdir -p`: previously treated `-p` as a path, creating a directory literally named `-p` without recursion. Now recursive, silent when the target exists, correct error when the parent is missing
- `awk`: previously printed only its usage banner. Now supports `-F`, `$0`/`$N`, `NF`/`NR`, comma-separated `print` lists and `/regex/ {…}` patterns, reading from a file or stdin
- `tr`: previously a stub. Now translates characters, supports `a-z` ranges, `-d`, `-s`, and reads from `< file` or a pipe
- `ls` in pipelines: `ls | wc -l` returns the real count instead of `1`; downstream stages receive one name per line
- `sort`: `-n`, `-r`, `-u`; options are no longer treated as filenames
- `uniq`: `-c` and `-d`
- `grep`: `-c`
- `head`/`tail`: `-2` short form
- `< file` input redirection now works for every stdin-consuming command
- `2>/dev/null` now actually discards stderr
- `${VAR}` and `${#VAR}` expansion
- `dpkg` with no arguments no longer prints `unknown option: undefined`
- `--help` is now handled uniformly (previously 111 commands treated it as an operand; `touch --help` created a file)

#### Improved

- Terminal output capped at 2000 lines so long sessions cannot grow the DOM without bound
- Accessibility: `role="log"` + `aria-live="polite"` on the output, `aria-label` on inputs and toolbar buttons
- Mobile: the command reference is a drawer (📚 in the toolbar) instead of disappearing below 768px
- First-paint badge corrected from 355 to 371 commands

#### Engineering

- New zero-dependency suite `tests/`: full 371-command smoke run plus 15 behavioural assertions, using Node's built-in runner and a DOM stub — no browser required
- New GitHub Actions `test` workflow: runs the suite on push/PR and enforces the single-file, no-external-assets, sub-1 MB contract
- New `package.json` (no dependencies, just metadata and a `test` script)
- New [docs/AUDIT-v1.4.0.md](docs/AUDIT-v1.4.0.md): the full audit, defect table and backlog

#### Docs

- Clarified that `学习指南.html` still exists as a standalone page (the v1.4.0 entry claimed it had been deleted)
- The GitHub repository description still says `355 commands`; update it to 371 in the repo settings

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
