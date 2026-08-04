# Linux Simulator · xterm.js 终端重写计划（B 方案）

> 本文件夹是独立实验区，与原项目 Desktop\linux-sim 完全隔离，不修改原项目任何文件。

## 目标

把模拟器的“终端显示层”从 HTML div 重写为 xterm.js 真终端渲染，让观感与手感接近真实服务器：

- 真实光标、颜色、滚动、复制粘贴、窗口缩放
- vi 使用终端“备用屏幕”（alternate screen）全屏接管，退出后恢复，不再有网页弹窗
- 侧栏（命令速查 / 学习任务卡）、工具栏、中英切换保留为 HTML 组件，与终端区并存

## 架构

index.html：页面骨架（工具栏 / 侧栏 / 学习面板）
xterm.js / xterm.css：终端渲染核心（本地 vendor，不依赖 CDN，离线可用）
app.js：现有模拟引擎原样复用（EXEC / VFS / 练习 / 考试 / 统计 / 双语）
terminal.js：新增，把引擎输出接入 xterm（替代 appendOutput）
vi.js：新增，vi 备用屏幕实现（替代 vi-overlay 弹窗）

引擎原样复用，只换“显示层”，风险集中在输入/输出通道。

## 阶段拆分与成本预估

P1 侦察与骨架：复制引擎、引入并验证 xterm、输出 hello 终端 —— 10~15k token，0.5~1 小时
P2 输出通道替换：appendOutput → xterm.write；命令/错误/信息配色；提示符与输入行 —— 40~60k token，2~3 小时
P3 键盘与交互：Enter / Tab 补全 / 上下翻历史 / Ctrl 组合 / 粘贴 / 选中复制 / 缩放 —— 30~40k token，1.5~2 小时
P4 vi 备用屏幕：i / Esc / :wq、光标移动、dd / yy / p、搜索、状态栏、退出恢复 —— 30~40k token，1.5~2 小时
P5 兼容打磨：长表格（df / docker / lsblk）换行、侧栏任务卡联动、中英切换 —— 20~30k token，1~1.5 小时
P6 测试与回归：把 Playwright 适配到 xterm（读缓冲区 / 模拟按键），关键功能回归 —— 20~30k token，1~1.5 小时
P7 交付：打包说明、启动方式（浏览器 / Edge 应用模式），可选单文件内联构建 —— 10k token，0.5~1 小时

合计：约 160k~225k Token，墙钟 8~12 小时（连续工作），拆 2~3 天更稳。

说明：Token 预估含调试与试错。P1~P3 顺利可压到 120k 左右；vi 备用屏幕和测试是最容易超支的两块。

## 风险

1. xterm 依赖：原项目“零依赖单文件”卖点会被打破——新文件夹采用多文件（本地 vendor xterm），单文件版本留作后续构建步骤。
2. 输入通道重构：原 keydown 逻辑（补全 / 历史 / vi / 语言切换）全部要迁到 xterm 的 onData；迁移期交互会短暂“变丑”。
3. Playwright 测试：xterm 用 canvas/DOM 混合渲染，测试需改为读终端缓冲区 + 键盘事件；现有 8 套用例要适配，行为断言大部分保留。
4. vi 与侧栏并存：vi 备用屏幕只占终端区，侧栏仍可见——符合“终端里的 vi”，和真机“全屏黑掉”略有差异；可后续加“终端最大化模式”。

## 测试策略

- 每阶段一个可运行里程碑（本地双击即可看到）
- P2 起：管道 / sudo / 脚本 / 练习 / 考试 / 双语各抽 3~5 条冒烟
- P6：在 xterm 新壳上重跑关键回归（核心 5 类行为全绿）

## 交付形态

- Desktop\linux-sim-xterm 内：index.html + xterm 本地包 + 分模块 JS + 启动说明
- 原 Desktop\linux-sim 保持不变，继续作为“网页/单文件版”主干
- 之后若做 Tauri exe，直接以本文件夹的多文件版为前端壳

## 当前进度

- [x] M1 骨架：引擎拆出为 `app.js`，xterm 本地 vendor，新壳 + 显示层搭好
- [x] M2 输出通道：引擎消息经终端输出，任务完成/考试/统计提示分色显示
- [x] M3 键盘交互：Tab 补全、↑↓ 历史、左右移动、Ctrl+C/L、粘贴分行走
- [x] M4 vi 备用屏幕：i/Esc/:wq、移动、dd/yy/p、u、/ 搜索、退出恢复
- [x] M5 兼容打磨：侧栏点击填入命令行、窗口缩放、长文本自动换行
- [x] M6 测试回归：`browser-test-xterm.js` 17/17 全绿
- [x] M7 交付：README、`启动.bat`（Edge 应用模式）

> 备注：M1 引擎原样复用；唯一必要的新增是 shell 执行时同步写入引擎 `history`（任务判题依赖）与 vi Escape 模式切换修复，均在 `terminal.js` 显示层。
