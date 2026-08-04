# Linux Learning Simulator · xterm 终端版

模拟器引擎的 **xterm.js 真终端** 实验版：真实光标、配色、滚动、复制粘贴，vi 用备用屏幕全屏接管（没有网页弹窗）。

> 本文件夹是独立实验版，与 `Desktop\linux-sim`（网页单文件版）共存；引擎逻辑两版共用，原项目未改动。
> GitHub：本版本位于仓库的 **xterm 分支**（`main` 分支保持单文件网页版）。

## 运行方式

**方式一：直接双击 `index.html`**（推荐，零依赖）

**方式二：桌面窗口模式**：双击 `启动.bat`，会用 Edge 应用模式打开一个独立窗口，看起来像桌面软件。

## 文件结构

```
index.html            # 新壳：工具栏 / 侧栏 / xterm 终端区
index.original.html   # 原单文件版备份（引擎来源）
app.js                # 引擎（EXEC / VFS / 练习 / 考试 / 统计 / 双语）
terminal.js           # xterm 显示层（终端输入 / vi 备用屏幕 / 补全 / 历史）
assets/style.css      # 样式
vendor/xterm/         # xterm.js（本地离线）
启动.bat               # Edge 应用模式启动器
PLAN.md               # 开发计划与进度
```

## 与网页版的差异

- 终端渲染换成 xterm.js，观感接近真实服务器
- vi 不再弹窗：`vi` 全屏接管终端区，`:wq` 退出恢复
- 多文件结构（便于维护），网页单文件版继续保留

## 快捷键

终端：`Tab` 补全 · `↑`/`↓` 历史 · `Ctrl+W` 删词 · `Ctrl+U` 清行 · `Ctrl+C` 取消 · `Ctrl+L` 清屏 · `Ctrl+Shift+C/V` 复制粘贴

vi：`i` 插入 · `Esc` 普通 · `h j k l` 移动 · `0 $ w b e` 跳转 · `x` 删字符 · `r` 替换 · `dd` 删行 · `yy` 复制 · `p/P` 粘贴 · `u` 撤销 · `/` 搜索（`n/N` 下一个）· `gg/G` 首尾行 · 鼠标点击定位 · `:wq` 保存退出

## 测试

浏览器自动化回归见 `work/browser-test-xterm.js`（17 项：管道 / sudo / 脚本 / 练习 / vi / 双语 / 补全 / 历史），当前全绿。
