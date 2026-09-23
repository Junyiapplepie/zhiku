# 智库 AI 问答助手

面向汽车知识问答、竞品分析与后台配置的 Vue 3 前端项目。项目围绕“问题输入 → 工作流执行 → 流式回答 → 数据可视化 → 历史恢复”构建完整交互链路，并提供用户、组织、角色和车型配置后台。

![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-646cff?logo=vite&logoColor=white)
![ECharts](https://img.shields.io/badge/ECharts-6.1-aa344d)
![Vditor](https://img.shields.io/badge/Vditor-3.11-4285f4)

## 功能概览

### 智能问答

- 使用 `fetch + ReadableStream + TextDecoder` 消费 SSE 响应。
- 缓存未完成事件，解决 TCP 分块导致的半包与粘包问题。
- 将工作流开始、节点变化、思考内容、文本片段、图表数据和结束事件分类渲染。
- 使用 `AbortController` 中断当前请求，支持停止生成与重新提问。
- 恢复历史会话中的问题、Markdown 回答、工作流状态和图表数据。
- 使用 Vditor 渲染 Markdown、代码块、表格和公式。

### 竞品数据可视化

- 将后端 `result_header / result_data` 转换为 ECharts 类目轴和数值序列。
- 兼容二维数组、对象数组、序列对象和简单数值数组。
- 支持表格、折线、柱状、组合和堆叠五类视图切换。
- 按需注册 ECharts 图表与组件，并监听容器尺寸变化。

### 管理后台

- 验证码登录与 Vue Router 页面访问控制。
- 用户搜索、角色与权限展示。
- 组织树和部门权限配置。
- 角色管理和车型竞品配置。
- 管理后台通过路由懒加载，与问答页面分包。

## 技术栈

- Vue 3 + Composition API
- JavaScript
- Vite
- Vue Router
- SSE / Fetch Streams API
- ECharts
- Vditor

## 项目结构

```text
zhiku/
├─ public/
│  ├─ logo.png                 # 品牌资源
│  └─ favicon.ico              # 站点图标
├─ src/
│  ├─ components/
│  │  ├─ chat/                 # 输入框、工作流、Markdown、图表组件
│  │  ├─ common/               # 全局提示组件
│  │  └─ layout/               # 侧边栏与顶部导航
│  ├─ mock/                    # 无后端时的演示数据与 Mock SSE
│  ├─ router/                  # 路由与登录守卫
│  ├─ services/                # SSE 请求和事件解析
│  ├─ stores/                  # 对话与 UI 状态层
│  ├─ styles/                  # 全局样式与响应式布局
│  ├─ utils/                   # 图表数据适配器
│  ├─ views/                   # 问答、登录和管理后台页面
│  ├─ App.vue
│  └─ main.js
├─ .env.example
├─ index.html
├─ package.json
└─ vite.config.js
```

## 快速开始

要求：Node.js 20+，npm 10+。

```bash
git clone https://github.com/Junyiapplepie/zhiku.git
cd zhiku
npm install
npm run dev
```

浏览器访问终端输出的本地地址，默认通常为 `http://127.0.0.1:5173`。

演示环境默认启用 Mock SSE，不依赖后端即可体验完整问答流程。管理后台使用已预填的演示账号和验证码登录。

## 环境变量

复制示例文件：

```bash
cp .env.example .env
```

```dotenv
VITE_USE_MOCK=true
VITE_API_BASE=/api
```

- `VITE_USE_MOCK=true`：使用前端生成的 SSE 流。
- `VITE_USE_MOCK=false`：请求真实后端接口。
- `VITE_API_BASE`：后端 API 前缀，开发环境可通过 Vite proxy 转发。

## SSE 事件约定

前端按标准 SSE 数据格式解析事件：

```text
event: text_delta
data: "回答文本片段"
```

| 事件 | 作用 |
| --- | --- |
| `workflow_start` | 初始化任务和工作流 |
| `node_change` | 更新当前工作流节点 |
| `thinking` | 更新思考或检索说明 |
| `text_delta` | 追加 Markdown 回答片段 |
| `chart` | 接收竞品图表数据 |
| `workflow_end` | 完成回答并保存会话 |

真实接口入口位于 `src/services/sse.js`，可根据后端字段约定调整请求体和事件映射。

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 生产构建
npm run preview   # 预览生产产物
npm run check     # 检查核心 JavaScript 模块语法
```

## 构建策略

- 问答、登录与管理后台页面使用路由懒加载。
- Vue、ECharts、Vditor 分别生成独立 vendor chunk。
- ECharts 使用模块化注册，避免引入未使用图表。
- Vditor 主包由 npm 管理，代码高亮、公式等增强资源按需从指定 CDN 加载。

## 后端接入位置

- SSE 问答：`src/services/sse.js`
- 对话与历史状态：`src/stores/chat.js`
- 图表数据适配：`src/utils/chartAdapter.js`
- 路由鉴权：`src/router/index.js`

项目中的 Mock 数据只用于本地演示。接入实际系统时，建议将会话列表、历史详情、登录鉴权、用户权限和后台配置分别替换为真实 API 服务。
