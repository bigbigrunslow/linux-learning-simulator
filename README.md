# 🐧 Linux Learning Simulator

**一个纯浏览器端的 Linux 终端模拟器，帮助你在无需安装任何操作系统的情况下学习和练习 Linux 命令。**

> 🤖 **本项目完全由 AI 辅助生成**（Cline + Claude），从架构设计到代码实现再到 GitHub 部署，全程对话式开发。  
> **Built entirely with AI** — Cline + Claude. Architecture → code → deployment, all via conversation.

---

## ✨ 特性

- 🖥️ **零依赖** — 纯单文件 HTML，双击即用，无需安装任何软件
- 🎯 **355 个命令** — 覆盖 VFS 操作、系统信息、硬件管理、网络诊断、Shell 工具、开发工具、DevOps 工具链
- 💾 **全局硬件模型** — 模拟一台真实服务器：i7-12700K + 40GB RAM + 4块混合磁盘(含坏道)
- 📝 **Vi/Vim 真编辑器** — 弹窗编辑器，支持 `i` 插入、`dd` 删行、`:wq` 保存写入虚拟文件系统
- 🔐 **sudo 提权模拟** — `sudo bash` 真正切换到 `#` root 提示符
- 📊 **详细命令输出** — 每个命令都有真实行为模拟，绝不仅仅是"命令说明"
- 🐳 **DevOps 全栈** — Docker/K8s/Terraform/Ansible/MySQL/Redis 等 130+ 运维命令
- 📚 **学习指南** — 11 阶段学习路径 + 实战练习题 + 命令速查表
- 🌐 **GitHub Pages** — 可直接部署为静态网站

## 🚀 快速开始

### 方式一：直接打开
```bash
git clone https://github.com/bigbigrunslow/linux-learning-simulator.git
cd linux-learning-simulator
# 用浏览器打开 index.html
```

### 方式二：GitHub Pages
直接访问：**https://bigbigrunslow.github.io/linux-learning-simulator/**

### 方式三：直接编辑
直接修改 `index.html`，所有 JS 代码内联在 `<script>` 标签中。

## 🖥️ 模拟的服务器规格

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

## 📋 部分命令展示

```
ls                  → README.txt, notes.txt, projects/
cat /etc/hostname   → home-server
grep root /etc/passwd → root:x:0:0:root...
df -h               → 7个挂载点的完整磁盘表格
free -h             → Mem 40Gi + Swap 8Gi
fdisk -l            → 4块磁盘详细分区信息
lscpu               → i7-12700K 完整规格
lspci               → 18条 PCI 设备（含 RTX 3060）
lsblk               → ├─└─ 树形画线，padEnd 对齐
smartctl -a /dev/sdb → ST4000DM004 FAILING (12坏道，预判性失败)
dmidecode -t memory → 4 DIMM 槽位详情（1空）
htop                → CPU/内存/Swap 进度条 + 进程表
lsusb               → 8个USB设备（含APC UPS）
docker ps           → 5个容器（nginx/mysql/redis/prometheus/grafana）
kubectl get pods    → 8个 Pod（nginx/redis/mysql/prometheus/grafana）
vi web.conf         → 弹出编辑器弹窗，可读写虚拟文件
sudo bash           → 切换 # root 提示符，真正提权
```

## 🏗️ 项目结构

```
linux-sim/
├── index.html          # 主程序 (~230KB)，双击即可使用
├── 学习指南.html        # 学习指南（可独立打开）
├── README.md           # 本文件
└── LICENSE             # MIT
```

## 🎓 学习路径

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

## ⚠️ 注意事项

- 这是纯粹的**浏览器端模拟**，不与真实系统交互
- 联网命令（ping/curl/apt）输出为模拟数据，不产生真实网络请求
- Vi 编辑器通过弹窗 textarea 实现，支持 ~15 个 Vim 操作
- 所有硬件数据从一份全局模型派生，保证数据一致性

## 📄 License

MIT © 2025

## 🙏 贡献

欢迎提交 Issue 和 PR！如果你有新增命令或改进建议，请直接编辑 `index.html` 中的 JavaScript 代码（所有命令处理器都在 `<script>` 标签内）。
