# 🐧 Linux Learning Simulator

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://bigbigrunslow.github.io/linux-learning-simulator/)
[![Version](https://img.shields.io/badge/Version-v1.4.0-orange)](CHANGELOG.md)
[![Commands](https://img.shields.io/badge/Commands-371-blueviolet)](index.html)

🚀 **一键开始 / One-Click Start** → **[在线打开模拟器 / Open the Simulator](https://bigbigrunslow.github.io/linux-learning-simulator/)** — 无需克隆、无需安装，浏览器点击即用。

**一个纯浏览器端的 Linux 终端模拟器 — 点击链接即可使用，无需安装任何操作系统，即可学习和练习 Linux 命令。**

> 🤖 **AI 辅助开发** — 项目最初由 Cline + Claude 从架构设计到代码实现再到 GitHub 部署全程对话式构建；**当前与后续更新由 Codex 完成**（底层模型：DeepSeek v4）。

> **AI-assisted development** — Originally built end-to-end with Cline + Claude (architecture → code → deployment, all via conversation). **Current and future updates are made with Codex** (backed by DeepSeek v4).

[中文](#中文) | [English](#english)

---

## 中文

### 🆕 最近更新（v1.4.0）

- 🎯 **三层练习体系** — 命令专项（`practice ls` 全用法练习）、学习项目（`practice path k8s/middleware/cicd` 等 8 条路线）、命令百科（`learn ls`）
- 📝 **考试与统计** — `exam <项目>` 随机抽题评分，`stats` 查看学习数据
- 📜 **脚本与状态机** — `bash script.sh` 可执行，`systemctl`/`docker`/`kill` 真实改变状态
- 🌐 **英文版** — 工具栏 🌐 一键切换中/英文，选择自动记忆
- 📚 **371 个命令全部配手写说明** — 每个命令都有用途讲解与练习
- ✨ 新命令：`printf` `read` `test` `sleep` `timeout` `tree` `basename` `dirname` `jq` `nmap`

完整历史见 [CHANGELOG.md](CHANGELOG.md)

### ✨ 特性

- 🖥️ **零依赖** — 纯单文件 HTML，双击即用，无需安装任何软件
- 🎯 **371 个命令** — 覆盖 VFS 操作、系统信息、硬件管理、网络诊断、Shell 工具、开发工具、DevOps 工具链
- 💾 **全局硬件模型** — 模拟一台真实服务器：i7-12700K + 40GB RAM + 4 块混合磁盘(含坏道)
- 📝 **Vi/Vim 真编辑器** — 弹窗编辑器，支持 `i` 插入、`dd` 删行、`:wq` 保存写入虚拟文件系统
- 🔗 **管道与重定向** — `|` 管道、`>`/`>>` 重定向真实生效，支持引号内特殊字符
- 🔐 **sudo 提权模拟** — `sudo bash` 真正切换到 `#` root 提示符
- 🧩 **真实状态机** — 服务启停、容器增删、进程杀灭都真实反映在输出里
- 🐳 **DevOps 全栈** — Docker/K8s/Terraform/Ansible/MySQL/Redis 等运维命令
- 🎯 **练习闭环** — 命令专项 + 学习项目 + 考试 + 统计 + 进度保存
- 📚 **学习指南** — `guide` 命令内嵌 11 阶段讲解 + 实战练习题 + 命令速查表（双语）
- 🌐 **中英双语** — 界面一键切换，选择自动记忆

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
echo '{"a":1}' | jq '.a'          → 1
tree /etc             → 树形目录
bash script.sh        → 执行脚本
systemctl stop nginx  → 服务状态真实变化
docker stop nginx-proxy → 容器从 docker ps 消失
sudo bash            → 切换 # root 提示符
```

### 🏗️ 项目结构

```
linux-sim/
├── index.html          # 主程序（单文件），双击即可使用
├── 学习指南.html        # 傻瓜式学习指南（点击即进模拟器）
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
9. **Shell 编程** → `alias env export source watch bash`
10. **编辑器** → `vi vim vimtutor`
11. **DevOps** → `docker kubectl helm terraform ansible git nginx mysql redis`

在模拟器里输入 `practice` 可跟随任务练习，`practice path <项目>` 切换学习路线，`guide` 查看学习指南。
完整指南页面：[https://bigbigrunslow.github.io/linux-learning-simulator/学习指南.html](https://bigbigrunslow.github.io/linux-learning-simulator/%E5%AD%A6%E4%B9%A0%E6%8C%87%E5%8D%97.html)

### ⚠️ 注意事项

- 这是纯粹的**浏览器端模拟**，不与真实系统交互
- 联网命令（ping/curl/apt）输出为模拟数据，不产生真实网络请求
- Vi 编辑器通过弹窗 textarea 实现，支持 `i/a/A/o/O` 插入、`h/j/k/l` 移动、`dd` 删行、`u` 撤销、`y/p` 复制粘贴、`/` 搜索、`:wq`/`:q!`
- 所有硬件数据从一份全局模型派生，保证数据一致性
- 练习进度与语言选择保存在浏览器本地；虚拟文件系统刷新后恢复初始状态

---

## English

### 🆕 Recent Updates (v1.4.0)

- 🎯 **Three-layer practice** — command drills (`practice ls`), learning projects (`practice path k8s/middleware/cicd` and 5 more), and the `learn` encyclopedia
- 📝 **Exams & stats** — `exam <project>` auto-graded quizzes, `stats` learning dashboard
- 📜 **Scripts & state machines** — `bash script.sh` works; `systemctl`/`docker`/`kill` really change state
- 🌐 **English UI** — one-click toggle with the 🌐 button, choice remembered
- 📚 **All 371 commands explained** — hand-written purpose notes and drills for every command
- ✨ New commands: `printf` `read` `test` `sleep` `timeout` `tree` `basename` `dirname` `jq` `nmap`

Full history in [CHANGELOG.md](CHANGELOG.md)

### ✨ Features

- 🖥️ **Zero Dependencies** — Single HTML file, just double-click to use
- 🎯 **371 Commands** — VFS operations, system info, hardware management, networking, Shell tools, DevOps
- 💾 **Global Hardware Model** — Simulates a real server: i7-12700K + 40GB RAM + 4 mixed disks (with failing HDD)
- 📝 **Real Vi/Vim Editor** — Modal popup editor with `i` insert, `dd` delete, `:wq` save
- 🔗 **Pipes & Redirects** — working `|`, `>`/`>>`, quote-aware
- 🔐 **sudo Escalation** — `sudo bash` switches to a `#` root prompt
- 🧩 **Real state machines** — services, containers and processes respond to commands
- 🐳 **Full DevOps Stack** — Docker, K8s, Terraform, Ansible, MySQL, Redis and more
- 🎯 **Learning loop** — drills, projects, exams, stats, saved progress
- 📚 **Learning Guide** — `guide` command with 11-stage explanations, exercises and a cheat sheet (bilingual)
- 🌐 **Bilingual** — one-click Chinese/English switch, remembered

### 🚀 Quick Start

**Option 1 (Recommended): Open Online, Click to Start**

👉 **[https://bigbigrunslow.github.io/linux-learning-simulator/](https://bigbigrunslow.github.io/linux-learning-simulator/)**

No clone, no install — just open the link in any browser.

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
echo '{"a":1}' | jq '.a'          → 1
tree /etc             → directory tree
bash script.sh        → run a script
systemctl stop nginx  → service state changes
docker stop nginx-proxy → container disappears from docker ps
sudo bash            → switch to a # root prompt
```

### 🏗️ Project Structure

```
linux-sim/
├── index.html          # Main program (single file), double-click to use
├── 学习指南.html        # Foolproof learning guide (one click into the simulator)
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
9. **Shell Scripting** → `alias env export source watch bash`
10. **Editors** → `vi vim vimtutor`
11. **DevOps** → `docker kubectl helm terraform ansible git nginx mysql redis`

Type `practice` to follow guided tasks, `practice path <project>` to switch learning paths, and `guide` for the learning guide.
Full guide page: [https://bigbigrunslow.github.io/linux-learning-simulator/学习指南.html](https://bigbigrunslow.github.io/linux-learning-simulator/%E5%AD%A6%E4%B9%A0%E6%8C%87%E5%8D%97.html)

### ⚠️ Notes

- This is a pure **browser-side simulation** — no real system interaction
- Network commands (ping/curl/apt) output simulated data, no real requests
- Vi editor: `i/a/A/o/O` insert, `h/j/k/l` move, `dd` delete, `u` undo, `y/p` yank/put, `/` search, `:wq`/`:q!`
- All hardware data derives from one global model for consistency
- Practice progress and language preference are saved locally; the virtual filesystem resets on refresh

---

## 📄 License

MIT © 2026

## 🙏 Contributing

Issues and PRs are welcome — it's open source, fork it and make it yours.
