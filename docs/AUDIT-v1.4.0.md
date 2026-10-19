# 代码审计报告 — v1.4.0

> 审计时间：2026-10-19 · 审计对象：`ace4564`（v1.4.0）· 方式：静态分析 + 无头运行时测试

## 一、结论

v1.4.0 的工程质量高于同规模 AI 生成项目：真零依赖、无 `eval`、终端输出一律走 `textContent`（无 XSS 面）、硬件数据集中建模、文档双语。

但存在一类系统性问题：**核心命令的仿真保真度不足**。对教学工具而言，教错比缺失更有害。本次审计发现 9 处会直接误导学习者的行为差异，其中 2 处为阻断级。

## 二、方法

没有依赖肉眼阅读。把 `index.html` 的 `<script>` 抽取出来，注入一个最小 DOM 桩，在 Node 中真实启动应用，然后：

- 对全部 371 个命令做无参调用，捕获异常与 `undefined`/`NaN` 泄漏
- 对全部 371 个命令做 `--help` 调用
- 对常用教学语法做 30+ 条对照断言
- 通过真实 `keydown` 路径灌入 1100 条命令，测量终端 DOM 增长

该 harness 已固化为仓库内的 `tests/`（零依赖，Node 内置 test runner）。

## 三、缺陷清单

| 级别 | 缺陷 | v1.4.0 实际行为 | 真实 Linux | 状态 |
|---|---|---|---|---|
| P0 | `mkdir -p /tmp/d/e/f` | `Created directory: /root/-p`，把 `-p` 当路径 | 递归创建 | 已修复 |
| P0 | `awk` | 任何写法都只打印用法提示 | 正常工作 | 已修复 |
| P0 | `tr` | 不翻译，只打印一行说明 | 正常翻译 | 已修复 |
| P1 | `ls \| wc -l` | `1`（所有文件名挤在一行） | `3` | 已修复 |
| P1 | `uniq -c` / `sort -n` | 选项被当作文件名 | 正常 | 已修复 |
| P1 | `cmd < file` | 输入重定向被忽略 | 从文件读 stdin | 已修复 |
| P1 | `2>/dev/null` | stderr 照常显示 | 被丢弃 | 已修复 |
| P1 | `${#VAR}` | 原样输出 | 展开为长度 | 已修复 |
| P1 | `dpkg`（无参） | `unknown option: undefined` | 打印用法 | 已修复 |
| P2 | 终端输出无上限 | 300 条命令后 606 个 DOM 节点，只增不减 | — | 已修复（上限 2000） |
| P2 | `--help` 不统一 | 111 个命令把它当普通参数，`touch --help` 会建文件 | 打印用法 | 已修复 |
| P2 | 移动端功能缺失 | `<768px` 直接隐藏命令参考面板且无替代 | — | 已修复（抽屉） |
| P2 | 可访问性 | 0 个 `aria-*` | — | 已修复（`role="log"`、`aria-live`） |
| P2 | `grep -c` | 未支持 | 输出计数 | 已修复 |
| P3 | 退出码靠正则推断 | `isErrorOutput()` 匹配输出文本猜 exit code | 由进程返回 | **未修复**，建议 v2.0.0 |

## 四、文档漂移

| 位置 | 问题 | 状态 |
|---|---|---|
| CHANGELOG v1.4.0 | 声称 `学习指南.html` 已合并删除，文件实际仍在 | 已在 v1.5.0 说明中订正 |
| GitHub 仓库描述 | 写 `355 commands`，实际 371 | 需在网页端修改（本地无法改） |
| `index.html` 首屏徽章 | 硬编码 `355 命令` | 已改为 371 |
| 提交身份 | `linux-learner <learner@example.com>`，不关联 GitHub 账号 | 需在推送前设置 |

## 五、修复与测试映射

每个修复都有对应断言，回归时不会静默退化：

| 修复 | 测试 |
|---|---|
| `mkdir -p` 递归 | `fidelity.test.mjs` → *mkdir -p creates nested directories* |
| `awk` 字段/模式 | *awk reads fields from a file and from stdin* |
| `tr` 翻译与删除 | *tr translates, deletes and accepts input redirection* |
| `ls` 管道换行 | *ls emits one name per line when piped* |
| `sort -n/-r` | *sort understands -n and -r* |
| `uniq -c` | *uniq -c counts adjacent duplicates* |
| `< file` 重定向 | 同上（`tr ... < /etc/hostname`） |
| `2>/dev/null` | *2>/dev/null suppresses stderr* |
| `${#VAR}` | *shell parameter expansion* |
| `--help` 统一 | `smoke.test.mjs` → *`<cmd> --help` prints usage…* |
| 输出上限 | *terminal output stays bounded over a long session* |
| 全量命令冒烟 | *every command runs without throwing* |

## 六、遗留建议（v2.0.0）

1. **退出码语义**：`isErrorOutput()` 用正则匹配输出文本，正常结果若含 `not found`/`invalid` 会被误判为失败。应在 handler 返回结构化 `{ stdout, code }`，正则只作兜底。
2. **源码拆分 + 构建内联**：当前 7300+ 行单文件。可拆到 `src/`，用零依赖脚本内联回 `index.html`，保留「双击即用」的产物形态。
3. **i18n 抽取**：几百处 `lang === 'en' ? ... : ...` 散在逻辑里，第三种语言等于重写。建议抽出词典表。
4. **重定向回显**：`Wrote to: /tmp/x` 这类提示在真实 shell 中不存在，会让「练习命令拿到真机上跑」的结果对不上。可改为侧栏提示或可关闭。

## 七、验证方式

```bash
node --test tests/          # Node 18+
```

无依赖、无浏览器、无网络。
