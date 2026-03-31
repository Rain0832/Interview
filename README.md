# 🎯 InterviewOJ — 互联网求职中心

> 笔试 OJ + 面经题库 + 个人成长路线图，一站式备战大厂秋招春招

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)](https://sqlite.org/)

---

## 功能概览

| 板块 | 功能 |
|------|------|
| **📝 笔试题库** | 选择题实时判分 · 编程题在线编辑 · 混合判题（编译器+LLM） · 5 家公司 56 道题 |
| **🎤 面试题库** | 按公司/部门浏览 · 按分类刷题（18 类） · 参考答案 · 59 道去重面试题 |
| **🌱 个人成长** | AI 转型路线图 · 可交互任务清单 · Markdown 学习笔记 · 云端同步 |
| **🔐 用户系统** | 注册/登录（JWT） · 做题记录 · 错题本 · 云端数据同步 |
| **🌙 暗色模式** | 全站暗色/亮色切换 · 自动保存偏好 |

---

## 快速开始

### 环境要求

- **Node.js** ≥ 22.12（[下载](https://nodejs.org/)）
- **npm** ≥ 10
- **Git**

### 1. 克隆项目

```bash
git clone https://github.com/Rain0832/RainInterview.git
cd RainInterview
```

### 2. 安装依赖

```bash
# 前端依赖
npm install

# 后端依赖
cd server
npm install
cd ..
```

### 3. 启动开发模式

需要同时启动前端和后端，**打开两个终端**：

**终端 1 — 后端（API 服务 + 数据库）**：

```bash
cd server
npx tsx src/index.ts
```

> 后端启动在 `http://localhost:3000`，首次启动会自动创建 SQLite 数据库

**终端 2 — 前端（Vite 开发服务器）**：

```bash
npm run dev
```

> 前端启动在 `http://localhost:5173`，自动代理 `/api` 请求到后端

**Windows PowerShell 用户**可以用一条命令启动：

```powershell
# 后台启动后端
Start-Process -NoNewWindow npx -ArgumentList "tsx server/src/index.ts"
# 前台启动前端
npm run dev
```

### 4. 访问

打开浏览器访问 **http://localhost:5173**

预置账号：`2710007824@qq.com` / `2710007824@qq.com`

### 5. 生产构建 & 部署

```bash
# 构建前端
npm run build

# 启动生产服务（前后端一体化，一个端口搞定）
cd server
PORT=8080 npx tsx src/index.ts
```

访问 `http://localhost:8080`，Express 同时托管前端静态文件和 API。

### 6. 多设备数据同步

笔记、做题记录等数据存储在 `server/data/interview.db`（SQLite），已纳入 Git 管理。

```bash
# 设备 A 使用后，同步数据到远端
git add server/data/interview.db
git commit -m "sync: 更新笔记和做题记录"
git push

# 设备 B 拉取最新数据
git pull
# 重启后端即可看到最新数据
```

> 注意：SQLite 不支持并发写入，请确保同一时间只有一个设备在写入数据。

---

## 项目结构

```
RainInterview/
├── src/                          # 前端源码 (React + TypeScript + Vite)
│   ├── components/
│   │   ├── Layout.tsx            #   全局布局 + 导航 + 面包屑
│   │   └── ui/                   #   通用 UI 组件
│   │       └── FormattedAnswer.tsx#     参考答案格式化渲染
│   ├── contexts/                 #   全局状态 (Theme/Auth/Record)
│   ├── features/                 #   按业务模块分包
│   │   ├── exam/                 #     笔试板块 (data + pages)
│   │   ├── interview/            #     面试板块 (data + pages)
│   │   ├── growth/               #     成长路线图 (pages)
│   │   └── user/                 #     用户工具 (登录/错题本/记录)
│   ├── pages/PortalPage.tsx      #   主页（三大板块导航）
│   └── services/api.ts           #   API 客户端
│
├── server/                       # 后端源码 (Express + SQLite)
│   └── src/
│       ├── index.ts              #   入口（API + 静态文件托管）
│       ├── middleware/auth.ts    #   JWT 鉴权
│       ├── models/database.ts    #   SQLite 数据库（自动建表+种子数据）
│       ├── routes/               #   API 路由
│       │   ├── auth.ts           #     注册/登录
│       │   ├── records.ts        #     做题记录
│       │   ├── submissions.ts    #     代码提交/判题
│       │   ├── questions.ts      #     用户题目
│       │   └── growth.ts         #     路线图/笔记 CRUD
│       └── services/judge.ts     #   混合判题（编译器+LLM）
│
├── dist/                         # 前端构建产物
├── vite.config.ts                # Vite 配置（API 代理）
└── package.json
```

---

## 技术栈

| 层 | 技术 |
|---|---|
| **前端** | React 19 · TypeScript · Vite 8 · TailwindCSS 4 · React Router 7 |
| **后端** | Express 5 · TypeScript · better-sqlite3 · JWT · bcrypt |
| **判题** | Docker 沙箱 / 本地沙箱 · LLM API 代码评审 |
| **部署** | Express 托管 SPA · SQLite 零配置数据库 |

---

## API 接口

| 路径 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 注册 |
| `/api/auth/login` | POST | 登录 |
| `/api/auth/me` | GET | 当前用户信息 |
| `/api/records` | GET/POST/DELETE | 做题记录 |
| `/api/submissions` | GET/POST | 代码提交/判题 |
| `/api/growth/roadmap` | GET/POST/PUT/DELETE | 成长路线图 |
| `/api/growth/notes` | GET/POST/PUT/DELETE | 学习笔记 |
| `/api/health` | GET | 健康检查 |

---

## 许可

本项目仅供个人学习和面试准备使用。题目版权归各公司所有。
