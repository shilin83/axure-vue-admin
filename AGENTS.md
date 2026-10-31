# Agents 工作指南与规范

本项目旨在为用户快速开发**高保真、可交互的 MPA Axure 原型后台**。

## 🎯 核心目标与角色职责

- **产品经理**：快速理解业务意图，主动补全缺失的逻辑分支，确保原型能够闭环演示核心业务流程。
- **UI/UX 设计师**：遵循主流 B 端管理后台设计规范，利用现有组件库快速构建合理的页面布局与交互反馈。重在信息传达与操作效率，避免过度设计。
- **前端开发**：编写高质量、可读性强、易于后续接手与重构的现代前端代码，确保原型在浏览器中流畅运行。

## 🛠 技术栈与开发约束

- **核心框架**：Vue 3 (Composition API，必须统一使用 `<script setup lang="ts">`)
- **开发语言**：TypeScript (保持基础的类型安全，原型阶段可适当简化复杂类型推导)
- **UI 组件库**：Element Plus (优先使用标准组件完成需求，尽量减少自定义样式覆盖)
- **样式方案**：UnoCSS (利用原子化 CSS 进行快速排版与布局，保持代码整洁)
- **数据持久化**：Dexie.js (利用 IndexedDB 模拟真实后端的增删改查，确保刷新页面数据不丢失)
- **工具函数**：使用 `es-toolkit` 结合 `@vueuse/core` 处理 Vue 相关逻辑。
- **异步操作**：利用 `rxjs`，结合 `@vueuse/rxjs` 处理异步操作，如网络请求、事件处理等。
- **知识检索**：必须使用 context7 检索权威文档与最新示例。
- **技能复用**：优先检查并使用 `.agents/skills` 目录下的已有技能。

## 🧩 可用技能清单与使用规范

本项目在 `.agents/skills/` 目录下安装了以下技能。AI 在每次开始任务前必须检查并确保正确使用。

### 1. brainstorming（头脑风暴与设计）

**路径**：`.agents/skills/brainstorming/`  
**触发时机**：在任何**创造性工作**（创建功能、构建组件、添加功能、修改行为）之前，**必须先执行此技能**。  
**流程**：

1. 探索项目上下文（检查文件、文档、最近提交）
2. 如有视觉问题，提供可视化辅助
3. 一次问一个澄清问题，理解目的/约束/成功标准
4. 提出 2-3 个方案（含优劣势分析 + 推荐方案）
5. 逐步展示设计，每部分需用户确认
6. 写入设计文档到 `src/views/<entryName>/spec.md`
7. 规格自检（检查占位符、矛盾、模糊、范围）
8. 用户审查规格
9. 过渡到实现 `writing-plans` 技能

**HARD-GATE**：在用户批准设计之前，**不得**调用任何实现技能、编写代码或启动项目。

**使用方式**：

```
Skill tool → name: "brainstorming"
```

### 2. frontend-code-review（前端代码审查）

**路径**：`.agents/skills/frontend-code-review/`  
**触发时机**：当用户请求审查 `.tsx`、`.ts`、`.js` 等前端文件时。  
**两种审查模式**：

1. **待变更审查** — 审查暂存/工作区文件，提交前标记违反清单规则项
2. **文件定向审查** — 审查用户指定的具体文件

**输出模板**：

- 发现问题时：`# Code review` → 紧急问题（含文件路径、行号、代码片段、修复建议）→ 改进建议
- 无问题时：`## Code review\nNo issues found.`

**使用方式**：

```
Skill tool → name: "frontend-code-review"
```

### 3. recommend（es-toolkit 函数推荐）

**路径**：`.agents/skills/recommend/`  
**触发时机**：当用户询问使用哪个 es-toolkit 函数、需要寻找工具函数、或希望替换手动实现时。  
**核心原则**：es-toolkit 更新频繁，不依赖记忆，必须从当前源代码验证函数是否存在且签名正确。  
**可用类别**：`array`、`error`、`function`、`map`、`math`、`object`、`predicate`、`promise`、`set`、`string`、`util`、`compat`

**使用方式**：

```
Skill tool → name: "recommend"
```

### 4. vue-best-practices（Vue 最佳实践）

**描述**：所有 Vue 相关任务（Vue 3、Composition API、`<script setup lang="ts">`）必须使用此技能。  
**使用方式**：

```
Skill tool → name: "vue-best-practices"
```

### 5. unocss（UnoCSS 原子化 CSS）

**描述**：配置 UnoCSS、编写工具类规则、快捷方式、或使用 Wind / Icons / Attributify 预设时使用。  
**使用方式**：

```
Skill tool → name: "unocss"
```

### 6. vueuse-functions（VueUse 组合式函数）

**描述**：在适用场景优先使用 `@vueuse/core` 的组合式函数来构建简洁、可维护的 Vue 功能。  
**使用方式**：

```
Skill tool → name: "vueuse-functions"
```

## 📋 技能选择决策流程

每次开始新任务时，按以下流程选择技能：

```
步骤 1：识别任务类型
├── 创造性/新功能/修改行为 → brainstorming（必须先做）
├── 前端代码审查请求 → frontend-code-review
├── 关于函数工具的选择 → recommend
├── Vue 相关开发 → vue-best-practices（强制）
├── UnoCSS 配置/样式 → unocss
├── 需要 @vueuse 组合式函数 → vueuse-functions
└── 其他 → 按需选择

步骤 2：技能执行
在每个会话开始或任务切换时：
- 检查 MEMORY.md 和 SESSION-STATE.md（如有）
- 使用 Skill tool 调用对应技能
```

## 💡 编码与设计原则

- **敏捷交付优先**：避免过度封装和复杂的架构抽象。代码应直观、扁平，以最快速度呈现可演示的最终结果。
- **响应式状态管理**：优先使用 Vue 的 `ref`/`reactive` 结合组合式函数 (Composables) 管理状态；结合 Dexie 提供的能力让视图与本地数据库无缝同步。
- **一致性体验**：色彩、间距、弹窗交互等需与 Element Plus 默认主题保持一致，提供专业、标准的后台操作体验。
