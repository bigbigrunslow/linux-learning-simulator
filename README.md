# 🐧 Linux Learning Simulator

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://bigbigrunslow.github.io/linux-learning-simulator/)
[![Version](https://img.shields.io/badge/Version-v1.5.0-orange)](CHANGELOG.md)
[![Commands](https://img.shields.io/badge/Commands-369-blueviolet)](index.html)

🚀 **一键开始 / One-Click Start** → **[在线打开模拟器 / Open the Simulator](https://bigbigrunslow.github.io/linux-learning-simulator/)** — 无需克隆、无需安装，浏览器点击即用。

**一个纯浏览器端的 Linux 终端模拟器 — 点击链接即可使用，无需安装任何操作系统，即可学习和练习 Linux 命令。**

[中文](#中文) | [English](#english)

> 🤖 **AI 辅助开发** — 项目最初由 Cline + Claude 从架构设计到代码实现再到 GitHub 部署全程对话式构建；**当前与后续更新由 Codex 完成**（底层模型：DeepSeek v4）。

> **AI-assisted development** — Originally built end-to-end with Cline + Claude (architecture → code → deployment, all via conversation). **Current and future updates are made with Codex** (backed by DeepSeek v4).

---

## 中文

### 🆕 最近更新（v1.5.0）

- 📜 **bash 脚本执行** — `bash script.sh` 逐行执行，支持变量赋值、注释、`;` 分隔、`$( )` 与反引号命令替换
- 🧩 **真实状态机** — `systemctl start/stop` 真的改变服务状态；`docker stop/start/rm/run` 真的改变容器列表；`kill` 后 `ps` 里进程消失
- 📝 **项目考试** — `exam <项目>` 随机抽 10 题、自动判分，70% 通过并记录成绩
- 📊 **学习统计** — `stats` 查看完成度、用过的命令、连续学习天数、常输错的命令

### 🆕 最近更新（v1.4.0）

- 🎯 **练习体系三层化** — ① 命令专项：`practice ls` 查看并练习单个命令的全部用法；② 学习项目：`practice path shell/network/docker/k8s/middleware/cicd/monitor` 按目标成体系学习；③ 命令百科：`learn ls` 查看命令完整用法
- 📚 **全部命令可练** — 每个命令至少一道基础练习；核心命令（ls/grep/sed/docker/kubectl 等 70+）配 3~8 条用法小题，任务总数 500+
- 🧭 **路线进度** — 每条技术路线独立进度，侧栏实时显示当前任务，进度自动保存

### 🆕 最近更新（v1.3.0）

- 🎯 **练习模式上线** — 内置 44 个与学习指南 11 阶段同步的练习任务：输入 `practice` 查看任务、`practice start` 开始；每完成一项自动判题、自动打勾并提示下一项
- 💾 **进度保存** — 练习进度存入浏览器 localStorage，刷新页面不丢失；`practice reset` 可重置
- 🧭 **侧栏任务卡** — 右侧边栏实时显示当前任务与提示，点击即可开始

### 🆕 最近更新（v1.2.1）

- 🚀 **一键式入口** — GitHub Pages 在线版列为首选使用方式，点击链接即用；`git clone` 降级为开发者选项
- 🔗 **指南联动** — 学习指南顶部新增“打开模拟器”按钮，文档与模拟器互跳更顺畅

### 🆕 最近更新（v1.2.0）

- 🔍 **grep 真正则** — 支持 `^` `$` `[0-9]` `.` `*` 等正则，无效正则给出错误提示
- ✂️ **sed 可用** — 支持 `s/old/new/`、`s/old/new/g` 替换和 `-i` 写回文件，支持管道输入
- ⛓️ **`&&`/`||` 短路** — 前一条命令失败时 `&&` 后续不再执行，`||` 执行兜底命令
- 💵 **退出码 `$?`** — 命令成功返回 0、失败返回 1，可用 `echo $?` 查看
- 🌱 **环境变量展开** — `$HOME`、`$USER` 等（如 `echo $HOME`）
- 🔒 **权限体系** — `chmod`/`chown` 真正持久化，`ls -l`/`stat` 显示真实权限与属主；普通用户写 `/etc`、`/proc`、`/var/log`、`/var/www` 会被拒绝，`sudo` 可写
- 📏 **数据一致** — `ls -l` 文件大小来自内容长度、权限来自 `chmod`，不再随机

### 🆕 最近更新（v1.1.0）

- 🔗 **管道真正可用** — `cat /etc/passwd | grep root`、`ps | head -3` 等现在会真实传递数据；引号内的 `|`、`&&` 不再被误切
- 📝 **Vi 编辑器修复** — 修复了弹窗聚焦问题；`i/a/A/o/O` 插入、`dd` 删行、`u` 撤销、`y/p` 复制粘贴、`/` 搜索、`:wq` 保存、`:q!` 放弃全部可用
- 🔐 **sudo/exit 状态修复** — `sudo bash` 后输入 `exit` 能真正退回普通用户提示符
- 🐳 **服务命令输出修复** — `alertmanager`、`grafana`、`kafka`、`nfs` 等 30+ 命令不再输出 `undefined`
- 🏷️ **命令数徽章动态化** — 工具栏实时显示当前命令总数（369）
- 📂 **服务器配置更完整** — 新增 `/var/www/html` 示例站点、`/etc/nginx/nginx.conf`、`/etc/sudoers`
- ⌨️ **方向键翻历史** — `↑`/`↓` 浏览命令历史，回车后自动复位
- 🧹 **其他修复** — `docker ps`/`kubectl` 表格对齐、`echo` 重定向支持引号剥离与 `>>` 追加、favicon 404 消除

完整列表见 [CHANGELOG.md](CHANGELOG.md)

### ✨ 特性

- 🖥️ **零依赖** — 纯单文件 HTML，双击即用，无需安装任何软件
- 🎯 **369 个命令** — 覆盖 VFS 操作、系统信息、硬件管理、网络诊断、Shell 工具、开发工具、DevOps 工具链
- 💾 **全局硬件模型** — 模拟一台真实服务器：i7-12700K + 40GB RAM + 4 块混合磁盘(含坏道)
- 📝 **Vi/Vim 真编辑器** — 弹窗编辑器，支持 `i` 插入、`dd` 删行、`:wq` 保存写入虚拟文件系统
- 🔗 **管道与重定向** — `|` 管道、`>`/`>>` 重定向真实生效，支持引号内特殊字符
- 🔐 **sudo 提权模拟** — `sudo bash` 真正切换到 `#` root 提示符
- 📊 **详细命令输出** — 每个命令都有真实行为模拟，绝不仅仅是"命令说明"
- 🐳 **DevOps 全栈** — Docker/K8s/Terraform/Ansible/MySQL/Redis 等 130+ 运维命令
- 📚 **学习指南** — 11 阶段学习路径 + 实战练习题 + 命令速查表
- 🌐 **GitHub Pages** — 可直接部署为静态网站

### 🚀 快速开始

**方式一（推荐）：在线直接打开，点击即用**

👉 **[https://bigbigrunslow.github.io/linux-learning-simulator/](https://bigbigrunslow.github.io/linux-learning-simulator/)**

无需克隆、无需安装任何软件，电脑或手机浏览器打开链接即可开始学习。

**方式二（开发者）：本地打开**

```bash
git clone https://github.com/bigbigrunslow/linux-learning-simulator.git
cd linux-learning-simulator
# 双击 index.html，用浏览器打开
```

### 🖥️ 模拟的服务器规格

| 组件 | 配置 |
|------|------|
| **OS** | Ubuntu 22.04.3 LTS |
| **内核** | 5.15.0-91-generic |
| **CPU** | Intel Core i7-12700K (12C/20T, 3.6-5.0GHz) |
| **内存** | 40GB DDR4 (Samsung 16GB×2 + Kingston 8GB×1) |
| **主板** | MSI MAG Z690-A PRO WIFI DDR4 |
| **BIOS** | AMI v1.2.0 |
| **GPU** | NVIDIA GeForce RTX 3060 12GB |
| **磁盘** | Samsung 980 PRO 500GB NVMe + WDC WD10EZEX 1TB SATA + ST4000DM004 4TB SATA(⚠坏道) + KingSpec 256GB SATA SSD |
| **网卡** | Intel I225-V 2.5GbE + Intel Wi-Fi 6 AX200 |

### 📋 部分命令展示

```
ls                   → README.txt, notes.txt, projects/
cat /etc/hostname    → home-server
cat /etc/passwd | grep -E "^root:" → root:x:0:0:root...
echo "hello" | sed "s/hello/hi/"  → hi
df -h                → 多挂载点完整磁盘表格
free -h              → Mem 40Gi + Swap 8Gi
fdisk -l             → 4 块磁盘详细分区信息（含坏道警告）
lscpu                → i7-12700K 完整规格
lspci                → 18 条 PCI 设备（含 RTX 3060）
lsblk                → ├─└─ 树形画线，padEnd 对齐
smartctl -a /dev/sdb → ST4000DM004 FAILING (12 坏道，预判性失败)
dmidecode -t memory  → 4 DIMM 槽位详情（1 空）
htop                 → CPU/内存/Swap 进度条 + 进程表
lsusb                → 8 个 USB 设备（含 APC UPS）
neofetch             → 系统信息 ASCII 艺术
docker ps            → 5 个容器运行中
kubectl get pods     → 8 个 Pod
vi web.conf          → 弹窗编辑器，可读写虚拟文件
sudo bash            → 切换 # root 提示符
```

### 🏗️ 项目结构

```
linux-sim/
├── index.html          # 主程序 (~230KB)，双击即可使用
├── 学习指南.html        # 学习指南（可独立打开）
├── CHANGELOG.md        # 更新日志
├── README.md           # 本文件
├── LICENSE             # MIT
└── .github/            # Issue 模板等
```

### 🎓 学习路径

1. **文件操作** → `ls cd pwd mkdir touch cat rm cp mv`
2. **文本处理** → `grep head tail wc sort uniq sed awk`
3. **系统监控** → `uname uptime free ps top htop kill`
4. **硬件管理** → `lscpu lspci lsusb lsblk smartctl dmidecode`
5. **网络诊断** → `ping curl ifconfig netstat ss dig tcpdump`
6. **用户权限** → `chmod chown sudo su useradd passwd`
7. **包管理** → `apt yum dpkg`
8. **服务管理** → `systemctl journalctl crontab`
9. **Shell 编程** → `alias env export source watch`
10. **编辑器** → `vi vim vimtutor`
11. **DevOps** → `docker kubectl helm terraform ansible git nginx mysql redis`

详见 [学习指南.html](学习指南.html)

### ⚠️ 注意事项

- 这是纯粹的**浏览器端模拟**，不与真实系统交互
- 联网命令（ping/curl/apt）输出为模拟数据，不产生真实网络请求
- Vi 编辑器通过弹窗 textarea 实现，支持 `i/a/A/o/O` 插入、`h/j/k/l` 移动、`0/$/w/b` 跳转、`dd` 删行、`u` 撤销、`y/p` 复制粘贴、`/` 搜索、`:wq`/`:q!`
- 所有硬件数据从一份全局模型派生，保证数据一致性
- 所有状态保存在浏览器内存中，刷新页面即恢复初始状态

---

## English

### 🆕 Recent Updates (v1.5.0)

- 📜 **bash script execution** — `bash script.sh` runs lines with variable assignment, comments, `;`, `$( )` and backtick command substitution
- 🧩 **Real state machines** — `systemctl start/stop` actually changes service state; `docker stop/start/rm/run` changes the container list; `kill` removes processes from `ps`
- 📝 **Project exams** — `exam <project>` draws 10 random questions, auto-grades, 70% to pass, records results
- 📊 **Learning stats** — `stats` shows completion, commands used, study streak, and frequently mistyped commands

### 🆕 Recent Updates (v1.4.0)

- 🎯 **Three-layer practice system** — ① Command drills: `practice ls` to see and practice all usages of one command; ② Learning projects: `practice path shell/network/docker/k8s/middleware/cicd/monitor` to learn by goal; ③ Command encyclopedia: `learn ls` for the full usage reference
- 📚 **Every command is trainable** — each command has at least one basic task; 70+ core commands have 3–8 usage drills, 500+ tasks in total
- 🧭 **Per-path progress** — each path tracks its own progress; the sidebar shows the current task; progress is saved automatically

### 🆕 Recent Updates (v1.3.0)

- 🎯 **Practice Mode** — 44 tasks synced with the 11 stages of the learning guide: run `practice` to list, `practice start` to begin; each completed task is auto-checked, marked ✅, and the next one is shown
- 💾 **Progress Persistence** — progress is saved to localStorage and survives refreshes; `practice reset` clears it
- 🧭 **Sidebar Task Card** — the right sidebar shows the current task and hint; click it to start

### 🆕 Recent Updates (v1.2.1)

- 🚀 **One-click entry** — the GitHub Pages online version is now the recommended way to use it; just click the link. `git clone` is for developers
- 🔗 **Guide integration** — the learning guide now has an “Open Simulator” button at the top

### 🆕 Recent Updates (v1.2.0)

- 🔍 **Real regex in grep** — supports `^` `$` `[0-9]` `.` `*`; invalid regex shows an error
- ✂️ **Working sed** — `s/old/new/` and `s/old/new/g` substitution, `-i` write-back, stdin via pipes
- ⛓️ **`&&`/`||` short-circuit** — `&&` stops after a failed command, `||` runs a fallback
- 💵 **Exit code `$?`** — 0 on success, 1 on failure; check with `echo $?`
- 🌱 **Environment variable expansion** — `$HOME`, `$USER` etc.
- 🔒 **Permission model** — `chmod`/`chown` persist; `ls -l`/`stat` show real mode and owner; regular users are denied writes to `/etc`, `/proc`, `/var/log`, `/var/www`; `sudo` can write
- 📏 **Consistent data** — `ls -l` sizes come from file content, modes from `chmod`, no more random values

### 🆕 Recent Updates (v1.1.0)

- 🔗 **Working Pipes** — `cat /etc/passwd | grep root` and `ps | head -3` now actually pass data; `|` and `&&` inside quotes are no longer split
- 📝 **Vi Editor Fixed** — fixed the modal focus bug; `i/a/A/o/O` insert, `dd` delete line, `u` undo, `y/p` yank/put, `/` search, `:wq` save, `:q!` quit all work
- 🔐 **sudo/exit State Fixed** — `exit` after `sudo bash` now truly returns to the normal user prompt
- 🐳 **Service Command Output Fixed** — `alertmanager`, `grafana`, `kafka`, `nfs` and 30+ commands no longer print `undefined`
- 🏷️ **Dynamic Command Badge** — the toolbar shows the live command count (369)
- 📂 **Richer Server Configuration** — added `/var/www/html` sample site, `/etc/nginx/nginx.conf`, `/etc/sudoers`
- ⌨️ **History Navigation** — browse command history with `↑`/`↓`, auto-reset after Enter
- 🧹 **Other Fixes** — `docker ps`/`kubectl` table alignment, `echo` redirect quote stripping and `>>` append, favicon 404 removed

Full list in [CHANGELOG.md](CHANGELOG.md)

### ✨ Features

- 🖥️ **Zero Dependencies** — Single HTML file, just double-click to use
- 🎯 **369 Commands** — VFS operations, system info, hardware management, networking, Shell tools, DevOps
- 💾 **Global Hardware Model** — Simulates a real server: i7-12700K + 40GB RAM + 4 mixed disks (with failing HDD)
- 📝 **Real Vi/Vim Editor** — Modal popup editor, supporting `i` insert, `dd` delete, `:wq` save to virtual filesystem
- 🔗 **Pipes & Redirects** — `|` pipes and `>`/`>>` redirects really work, quote-aware
- 🔐 **sudo Privilege Escalation** — `sudo bash` actually switches to `#` root prompt
- 📊 **Detailed Output** — Every command produces realistic simulation output, not just descriptions
- 🐳 **Full DevOps Stack** — Docker, K8s, Terraform, Ansible, MySQL, Redis, and 130+ more
- 📚 **Learning Guide** — 11-stage learning path, practice exercises, command reference
- 🌐 **GitHub Pages Ready** — Deploy as a static website

### 🚀 Quick Start

**Option 1 (Recommended): Open Online, Click to Start**

👉 **[https://bigbigrunslow.github.io/linux-learning-simulator/](https://bigbigrunslow.github.io/linux-learning-simulator/)**

No clone, no install — just open the link in any browser on your computer or phone.

**Option 2 (For Developers): Local**

```bash
git clone https://github.com/bigbigrunslow/linux-learning-simulator.git
cd linux-learning-simulator
# Double-click index.html to open it in your browser
```

### 🖥️ Simulated Server Specs

| Component | Configuration |
|-----------|---------------|
| **OS** | Ubuntu 22.04.3 LTS |
| **Kernel** | 5.15.0-91-generic |
| **CPU** | Intel Core i7-12700K (12C/20T, 3.6-5.0GHz) |
| **RAM** | 40GB DDR4 (Samsung 16GB×2 + Kingston 8GB×1) |
| **Motherboard** | MSI MAG Z690-A PRO WIFI DDR4 |
| **BIOS** | AMI v1.2.0 |
| **GPU** | NVIDIA GeForce RTX 3060 12GB |
| **Disks** | Samsung 980 PRO 500GB NVMe + WDC 1TB SATA + ST4000 4TB SATA(⚠failing) + KingSpec 256GB SATA SSD |
| **NIC** | Intel I225-V 2.5GbE + Intel Wi-Fi 6 AX200 |

### 📋 Example Commands

```
ls                   → README.txt, notes.txt, projects/
cat /etc/hostname    → home-server
cat /etc/passwd | grep -E "^root:" → root:x:0:0:root...
echo "hello" | sed "s/hello/hi/"  → hi
df -h                → 7 mount points with full disk table
free -h              → Mem 40Gi + Swap 8Gi
fdisk -l             → 4 disks with partition details (including failing warning)
lscpu                → i7-12700K full specs
lspci                → 18 PCI devices (including RTX 3060)
lsblk                → Tree-style layout with padEnd alignment
smartctl -a /dev/sdb → ST4000DM004 FAILING (12 bad sectors, pre-fail)
dmidecode -t memory  → 4 DIMM slots (1 empty)
htop                 → CPU/Mem/Swap bars + process list
lsusb                → 8 USB devices (including APC UPS)
neofetch             → System info ASCII art
docker ps            → 5 running containers
kubectl get pods     → 8 Pods
vi web.conf          → Popup editor, reads/writes virtual filesystem
sudo bash            → Switches to # root prompt
```

### 🏗️ Project Structure

```
linux-sim/
├── index.html          # Main program (~230KB), double-click to use
├── 学习指南.html        # Learning guide (standalone)
├── CHANGELOG.md        # Changelog
├── README.md           # This file
├── LICENSE             # MIT
└── .github/            # Issue templates etc.
```

### 🎓 Learning Path

1. **File Ops** → `ls cd pwd mkdir touch cat rm cp mv`
2. **Text Processing** → `grep head tail wc sort uniq sed awk`
3. **Monitoring** → `uname uptime free ps top htop kill`
4. **Hardware** → `lscpu lspci lsusb lsblk smartctl dmidecode`
5. **Networking** → `ping curl ifconfig netstat ss dig tcpdump`
6. **Permissions** → `chmod chown sudo su useradd passwd`
7. **Package Mgmt** → `apt yum dpkg`
8. **Services** → `systemctl journalctl crontab`
9. **Shell Scripting** → `alias env export source watch`
10. **Editors** → `vi vim vimtutor`
11. **DevOps** → `docker kubectl helm terraform ansible git nginx mysql redis`

See [学习指南.html](学习指南.html) for details.

### ⚠️ Notes

- This is a pure **browser-side simulation** — no real system interaction
- Network commands (ping/curl/apt) output simulated data, not real requests
- Vi editor is implemented via modal textarea: `i/a/A/o/O` insert, `h/j/k/l` move, `0/$/w/b` jump, `dd` delete line, `u` undo, `y/p` yank/put, `/` search, `:wq`/`:q!`
- All hardware data derives from a single global model, ensuring consistency
- All state lives in browser memory; refreshing resets to the initial state

---

## 📄 License

MIT © 2026

## 🙏 Contributing

Issues and PRs are welcome!
