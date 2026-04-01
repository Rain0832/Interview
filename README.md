# 🎯 InterviewOJ — 互联网求职中心

> 笔试 OJ + 面经题库 + 个人成长路线图

---

## 环境要求

| 工具 | 版本 | 检查命令 |
|------|------|---------|
| **Node.js** | ≥ 20 | `node -v` |
| **npm** | ≥ 10 | `npm -v` |
| **Git** | 任意 | `git --version` |
| **Python 3** | 任意（编译 better-sqlite3 需要） | `python3 --version` |
| **C++ 编译器** | g++ 或 MSVC（编译 better-sqlite3 需要） | `g++ --version` |

### WSL2 / Linux 额外依赖

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y python3 make g++

# CentOS/Fedora
sudo yum install -y python3 make gcc-c++
```

### Windows（不使用 WSL）

```powershell
# 安装 Windows 编译工具（管理员 PowerShell）
npm install --global windows-build-tools
```

---

## 快速开始

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

> ⚠️ 如果 `npm install` 报错 `better-sqlite3` 编译失败：
> ```bash
> # WSL/Linux：确保装了编译工具
> sudo apt install -y python3 make g++
> # 然后重新安装
> cd server && rm -rf node_modules && npm install
> ```

### 3. 启动服务

**开两个终端**：

**终端 1 — 后端 API**：
```bash
cd server
npx tsx src/index.ts
```

你应该看到：
```
📦 正在加载模块...
✅ 所有模块加载完成
📂 静态文件: .../dist

  🚀 InterviewOJ Server 已启动:
     http://localhost:3000
     API: http://localhost:3000/api/health
```

> ⚠️ 如果**没有任何输出**就退出了：
> ```bash
> # 检查 Node 版本
> node -v  # 需要 >= 20
>
> # 尝试直接运行看报错
> cd server
> node --loader tsx src/index.ts
>
> # 如果报 better-sqlite3 错误，重新编译
> npm rebuild better-sqlite3
> ```

**终端 2 — 前端开发服务器**：
```bash
npm run dev
```

### 4. 访问

- 前端：**http://localhost:5173**（开发模式，带热更新）
- 后端 API：**http://localhost:3000/api/health**
- 预置账号：`2710007824@qq.com` / `2710007824@qq.com`

### 5. 生产构建（一个端口搞定）

```bash
# 构建前端
npm run build

# 启动生产服务（前后端一体化）
cd server
PORT=8080 npx tsx src/index.ts
# 访问 http://localhost:8080
```

### Windows PowerShell 快捷启动

```powershell
# 一键启动（后台后端 + 前台前端）
Start-Process -NoNewWindow -FilePath "npx" -ArgumentList "tsx server/src/index.ts"
npm run dev
```

---

## 多设备数据同步

笔记、学习进度等数据存储在 `server/data/interview.db`，已纳入 Git 管理。

**自动同步**：保存笔记/标记进度后 5 秒内自动 push 到 GitHub。

**手动同步**：
```bash
# 设备 A 使用后
git add server/data/interview.db
git commit -m "sync: 更新数据"
git push

# 设备 B 拉取
git pull
# 重启后端即可
```

---

## 项目结构

```
RainInterview/
├── src/                          # 前端 (React + Vite + TailwindCSS)
│   ├── components/ui/            #   通用组件 (FormattedAnswer/NoteSidebar)
│   ├── contexts/                 #   全局状态 (Theme/Auth/Record)
│   ├── features/                 #   业务模块
│   │   ├── exam/                 #     笔试 (选择题/编程题/OJ)
│   │   ├── interview/            #     面试 (题库/卡片刷题/收藏/状态标签)
│   │   ├── growth/               #     成长 (路线图/课程/笔记)
│   │   └── user/                 #     用户 (登录/个人中心/错题本)
│   ├── pages/PortalPage.tsx      #   主页
│   └── services/api.ts           #   API 客户端
│
├── server/                       # 后端 (Express + SQLite)
│   ├── src/index.ts              #   入口
│   ├── src/models/database.ts    #   数据库
│   ├── src/routes/               #   API (auth/records/growth/progress)
│   ├── src/utils/gitSync.ts      #   Git 自动同步
│   └── data/interview.db         #   SQLite 数据库 (纳入Git)
│
└── dist/                         # 前端构建产物
```

---

## 常见问题

### Q: 后端启动没有任何输出就退出了

1. **Node 版本太低**：`node -v` 需要 ≥ 20
2. **better-sqlite3 编译失败**：WSL 需要 `sudo apt install python3 make g++`
3. **依赖没装**：`cd server && npm install`
4. **看详细报错**：`cd server && node --loader tsx src/index.ts`

### Q: `npm install` 报错 node-gyp

```bash
# WSL/Linux
sudo apt install -y python3 make g++
npm install

# 或者跳过原生模块编译（用预编译版本）
cd server
npm install --build-from-source=false
```

### Q: Windows 上 Git 自动同步失败

Git 同步是可选功能，失败不影响正常使用。数据已保存在本地数据库中。
确保 Git SSH key 配置正确：`ssh -T git@github.com`

### Q: 端口被占用

```bash
# 查看占用
lsof -i :3000   # Linux/Mac
netstat -ano | findstr :3000   # Windows

# 换端口
PORT=8080 npx tsx server/src/index.ts
```

---

## 许可

本项目仅供个人学习和面试准备使用。题目版权归各公司所有。
