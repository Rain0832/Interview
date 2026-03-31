/**
 * 学习课程内容数据 — 为路线图中每个子任务提供分章节的学习材料
 *
 * 设计原则：
 * - 每个 Lesson 约 30min~1h 的内容量
 * - 难度基于用户 C++ 背景量身定制，大量 C++ 类比帮助理解
 * - 先给直觉/大白话解释，再给技术细节
 * - 包含实践步骤和外部学习资源链接
 */

export interface Lesson {
  id: string
  title: string
  duration: string       // "30min" | "1h" | "1.5h"
  content: string        // Markdown 格式
}

export interface CourseModule {
  subTaskTitle: string    // 对应路线图中的 subTask.title
  milestoneId: string     // 对应 milestone.id
  lessons: Lesson[]
}

// ==================== 导论：AI 全景地图 ====================

const introCourses: CourseModule[] = [
  {
    subTaskTitle: 'AI 全景导论',
    milestoneId: 'agent-upgrade',
    lessons: [
      {
        id: 'intro-1',
        title: '第 0 课：AI 应用开发全景地图',
        duration: '1h',
        content: `# AI 应用开发全景地图

> *"The best way to predict the future is to invent it."* — Alan Kay
>
> 最好的预测未来的方式，就是去创造它。作为一个 C++ 系统开发者，你即将创造的，是一个能自主思考和行动的 AI 系统。

---

## 🎯 这门课是什么？

欢迎开始你的 AI 转型之旅！

在你开始之前，让我先消除一个误解：**学 AI 不等于学深度学习数学。** 对于 AI 应用开发工程师来说，你需要的不是推导反向传播公式，而是理解：
- 大模型是什么、能做什么、不能做什么
- 怎么让大模型按你的意图工作（Prompt Engineering）
- 怎么给大模型接上"手和眼"（Agent + RAG）
- 怎么把这些能力做成一个可靠的产品

打个比方：你不需要懂发动机的热力学原理才能开好车，但你需要知道方向盘、油门、刹车怎么用，以及什么路况该用什么策略。

## 🗺️ 学习路线全景

想象你在建一座智能大厦，从地基开始：

\`\`\`
┌──────────────────────────────────────────────┐
│               🏢 AI 应用大厦                  │
├──────────────────────────────────────────────┤
│  6F │ 🎯 产品化                              │
│     │   监控 / 评测 / A/B实验 / 安全防护       │
├──────────────────────────────────────────────┤
│  5F │ 🧠 Agent 自主推理          ← 核心突破点  │
│     │   ReAct / Function Calling / 记忆管理    │
├──────────────────────────────────────────────┤
│  4F │ 📚 RAG 知识增强            ← 让AI有外脑  │
│     │   Embedding / FAISS / Reranking          │
├──────────────────────────────────────────────┤
│  3F │ 🔌 模型接口层              ← API + 流式  │
│     │   OpenAI 协议 / SSE / Function Calling   │
├──────────────────────────────────────────────┤
│  2F │ 🏗️ 基础设施层              ← 你已经有了！│
│     │   HTTP 框架 / 连接池 / MQ / 设计模式      │
├──────────────────────────────────────────────┤
│  1F │ 💪 C++ 系统编程             ← 你的根基   │
│     │   Reactor / 多线程 / 内存管理 / 网络编程   │
└──────────────────────────────────────────────┘
\`\`\`

**你现在在哪？** 1F 和 2F 已经建好（C++ 框架 + 基础设施），3F 部分完成（多模型策略），5F 有了原型（MCP 两段式推理）。接下来，我们的任务是把每一层**补齐、加固、精装修**。

## 🤔 C++ 开发者学 AI 的独特优势

你可能觉得 AI 圈都是 Python，C++ 没用武之地。但事实恰好相反——当所有人都会调 Python API 时，**懂底层的人才是稀缺资源**。

| 你已有的能力 | AI 领域怎么用 | 为什么稀缺 |
|---|---|---|
| **内存管理** | KV Cache 原理、显存优化、量化推理 | 99% Python 开发者不懂内存布局 |
| **多线程/并发** | 并行推理、批处理调度、连接池 | 大模型推理本质是 GPU 并行计算 |
| **网络编程** | 推理服务框架、SSE 流式输出 | vLLM/TGI 底层都是 C++ |
| **设计模式** | Agent 框架、策略模式切模型 | 会用框架 ≠ 会设计框架 |
| **性能敏感** | 推理延迟优化、首 token 时间 | 这是工业界最关心的指标 |

举个真实的例子：**vLLM**（目前最流行的大模型推理引擎）的核心——PagedAttention，本质就是操作系统的虚拟内存分页思想。你做过数据库连接池，这和 KV Cache 的内存管理是同一个问题的不同表现形式。

> **你的定位不是"会调 Python API 的人"，而是"能从底层设计和优化 AI 系统的人"。** 这才是你在面试中和别人拉开差距的关键。

## 🏭 大厂怎么做 AI 应用？

了解行业实践，才能在面试中言之有物：

### 阿里：通义千问 + 百炼平台
- 通义千问系列模型（Qwen-Plus/Max/Turbo），你已经用过了
- 百炼平台提供 RAG、Agent、微调一站式服务
- 面试考点：为什么选这个模型？RAG 底层自己怎么做？

### 字节：豆包 + Coze
- 豆包大模型（你也对接过）
- Coze 是低代码 Agent 平台，拖拽式搭建
- 面试考点：Coze 的底层是什么？你能自己实现吗？

### 蚂蚁：支付宝智能体
- 金融场景的 AI Agent（合规要求极高）
- 强调可控性、可解释性
- 面试考点：怎么防止 AI 在金融场景中产生幻觉？

### OpenAI：GPT + Function Calling
- Function Calling 是行业标准
- Assistants API = 官方 Agent 框架
- 面试考点：你的 MCP 实现和 OpenAI 的方案有什么异同？

## 📋 课程设计原则

每节课遵循 4 个原则：

1. **大白话先行**：每个新概念先用生活类比，5 秒建立直觉
2. **C++ 锚点**：所有新知识都锚定你已知的 C++ 概念
3. **动手为主**：每节课都有可运行代码（C++/Python/JS 三语言支持）
4. **面试导向**：每个知识点都给"面试标准答案框架"

## 📊 掌握程度标准

我用 3 个级别定义你需要掌握到什么程度：

| 级别 | 含义 | 面试表现 |
|---|---|---|
| ⭐ 了解 | 知道是什么、能说出核心概念 | 能回答"什么是 X？" |
| ⭐⭐ 熟悉 | 理解原理、能手写伪代码 | 能回答"X 的原理？怎么实现？" |
| ⭐⭐⭐ 精通 | 有实战经验、能对比方案优劣 | 能回答"为什么选 X 不选 Y？遇到什么坑？" |

你的目标：Agent 相关 ⭐⭐⭐，RAG 相关 ⭐⭐⭐，LLM 原理 ⭐⭐，Python/LangChain ⭐⭐。

## 🧪 试试互动实验室

下面是一个 Python 小实验——感受一下调用大模型 API 的核心代码：

\`\`\`python
# 这就是调用大模型的核心代码，只有 10 行！
# （可以直接点运行按钮执行）
import json

# 模拟一个 LLM API 调用
request = {
    "model": "qwen-plus",
    "messages": [
        {"role": "system", "content": "你是一个AI助手"},
        {"role": "user", "content": "什么是Agent?"}
    ],
    "temperature": 0.7
}

print("📤 发送给大模型的请求:")
print(json.dumps(request, indent=2, ensure_ascii=False))
print()
print("📥 模型会返回:")
print(json.dumps({
    "choices": [{"message": {"role": "assistant", "content": "Agent是能自主推理和使用工具的AI系统..."}}]
}, indent=2, ensure_ascii=False))
\`\`\`

## 📚 延展学习

想深入了解 AI 全景？推荐这些资源：

- [State of AI Report 2025](https://www.stateof.ai/) — 年度 AI 行业报告，看大势
- [Andrej Karpathy: Intro to LLMs](https://www.youtube.com/watch?v=zjkBMFhNj_g) — 1 小时了解大模型全貌
- [LangChain Blog](https://blog.langchain.dev/) — AI 应用工程最新实践
- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — 可视化理解 Transformer

## ✅ 本课总结

1. AI 应用开发 ≠ 训练模型，你需要的是**工程能力**
2. C++ 背景是**独特优势**，不是劣势
3. 学习路线：Agent → RAG → Python/LangChain → LLM 原理
4. 大厂都在做 AI Agent，你的 MCP 项目直接匹配
5. 下一课开始动手——升级你的 Agent！

> 准备好了吗？点击"下一课"，让我们从 ReAct 循环开始。
`,
      },
    ],
  },
];

// ==================== 里程碑3: Agent 升级为标准框架 ====================

const agentUpgradeCourses: CourseModule[] = [
  {
    subTaskTitle: 'ReAct 循环（多步工具调用）',
    milestoneId: 'agent-upgrade',
    lessons: [
      {
        id: 'react-1',
        title: '什么是 ReAct？从"想一步做一步"说起',
        duration: '1h',
        content: `# 什么是 ReAct？

## 大白话解释

想象你在做菜：
1. **想**（Thought）：今天做番茄炒蛋，需要番茄、鸡蛋、盐
2. **做**（Action）：打开冰箱拿番茄
3. **看**（Observation）：冰箱里没有番茄了
4. **再想**（Thought）：没有番茄，那我去超市买，或者换个菜
5. **再做**（Action）：出门去超市
6. ...

这就是 ReAct（Reasoning + Acting）的核心思想——**让 AI 像人一样，边想边做，根据结果调整策略**。

## 你目前的实现 vs ReAct

\`\`\`
你的两段式推理（只能"想一次做一次"）:
  用户问题 → LLM判断 → 调1个工具 → LLM总结 → 结束

ReAct 循环（可以"想多次做多次"）:
  用户问题 → Thought → Action → Observation
            → Thought → Action → Observation
            → ... (循环直到得出最终答案)
            → Final Answer
\`\`\`

## 为什么需要多步？

举个例子：用户问"北京明天适合户外跑步吗？"

**你当前的实现**只能调一个工具：
- 调天气工具 → 得到"明天晴，25°C" → 回答"适合"

**但如果需要更复杂的推理**：
- Step 1: 调天气工具 → 得到温度和天气
- Step 2: 调空气质量工具 → 得到 AQI 指数
- Step 3: 综合两个结果 → "温度适宜但 AQI 超过 150，建议室内运动"

## 核心概念

| 术语 | 含义 | 你项目中的对应 |
|------|------|--------------|
| Thought | LLM 的推理过程（内心独白） | \`buildPrompt\` 中的系统提示 |
| Action | 调用哪个工具、传什么参数 | \`AIToolRegistry::invoke\` |
| Observation | 工具返回的结果 | 工具调用后的 JSON 结果 |
| Final Answer | 最终回答用户的内容 | 第二段推理的输出 |

## 深入学习资源

- [ReAct 原始论文](https://arxiv.org/abs/2210.03629) — Yao et al., 2022
- [LangChain ReAct Agent 文档](https://python.langchain.com/docs/modules/agents/agent_types/react) — 官方实现参考
- [3Blue1Brown: 大模型可视化](https://www.youtube.com/watch?v=wjZofJX0v4M) — 理解 LLM 推理过程
`,
      },
      {
        id: 'react-2',
        title: '动手实现：C++ ReAct 循环引擎',
        duration: '1h',
        content: `# 动手实现 ReAct 循环

## 架构设计

在你现有的 \`AIHelper::chat()\` 基础上改造：

\`\`\`cpp
// 伪代码：ReAct 循环核心
string reactLoop(string userQuery, int maxSteps = 5) {
    messages.push_back({role: "user", content: userQuery});

    for (int step = 0; step < maxSteps; step++) {
        // 1. 让 LLM 推理（Thought + Action 或 Final Answer）
        string response = callLLM(messages);

        // 2. 解析：是 Final Answer 还是 Tool Call？
        auto parsed = parseReActResponse(response);

        if (parsed.type == "final_answer") {
            return parsed.content;  // 推理结束
        }

        if (parsed.type == "tool_call") {
            // 3. 执行工具
            string result = toolRegistry.invoke(
                parsed.toolName, parsed.toolArgs
            );

            // 4. 将 Observation 加入上下文
            messages.push_back({
                role: "assistant",
                content: "Thought: " + parsed.thought +
                         "\\nAction: " + parsed.toolName +
                         "\\nAction Input: " + parsed.toolArgs
            });
            messages.push_back({
                role: "user",  // observation 以 user 角色注入
                content: "Observation: " + result +
                         "\\n请继续推理或给出最终答案。"
            });
        }
    }
    return "抱歉，推理步骤过多，请简化问题。";
}
\`\`\`

## Prompt 设计（最关键的部分）

\`\`\`
你是一个 AI 助手，可以使用以下工具：
{tools_description}

请按以下格式回答：
Thought: 我需要思考一下...
Action: tool_name
Action Input: {"param": "value"}

或者，如果你已经知道答案：
Thought: 我已经有足够信息了
Final Answer: 你的最终回答
\`\`\`

## 实操步骤

1. **修改 \`AIConfig::buildPrompt()\`**：将 ReAct 格式指令加入系统 Prompt
2. **新增 \`parseReActResponse()\`**：用正则解析 Thought/Action/Final Answer
3. **修改 \`AIHelper::chat()\`**：加入循环逻辑
4. **增加循环保护**：maxSteps 防止无限循环，每步记录日志

## 测试用例

- "北京明天天气怎么样？" → 单步工具调用
- "北京和上海哪个城市明天更热？" → 两步工具调用（分别查两个城市）
- "现在几点了？用中文回答" → 单步 + 格式化

## 常见坑

1. **LLM 不按格式输出**：加 few-shot 示例到 Prompt 中
2. **无限循环**：LLM 反复调同一个工具，需要检测重复
3. **上下文爆炸**：多步推理后 messages 很长，需要压缩策略
`,
      },
    ],
  },
  {
    subTaskTitle: '标准 Function Calling 接口',
    milestoneId: 'agent-upgrade',
    lessons: [
      {
        id: 'fc-1',
        title: 'Function Calling：让模型"正式地"调工具',
        duration: '45min',
        content: `# Function Calling vs Prompt 注入

## 大白话

你现在的工具调用方式就像**在微信聊天里约人**——你发一段文字"帮我查一下北京天气"，对方可能理解成查天气，也可能理解成闲聊。

Function Calling 就像**在钉钉里建了一个审批流程**——格式固定、字段明确、不会有歧义。

## 对比

| | Prompt 注入（你现在的方式） | Function Calling（标准方式） |
|---|---|---|
| 工具声明 | 文字描述塞进 system prompt | 结构化 JSON Schema 传给 API |
| 模型输出 | 自由文本，需要你解析 JSON | 模型返回结构化的 \`tool_calls\` 字段 |
| 可靠性 | 模型可能不按格式输出 | API 保证返回固定格式 |
| 兼容性 | 所有模型都支持 | 需要模型支持（通义千问/GPT-4都支持） |

## 通义千问 Function Calling 示例

请求体中新增 \`tools\` 字段：
\`\`\`json
{
  "model": "qwen-plus",
  "messages": [...],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "查询指定城市的天气",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {"type": "string", "description": "城市名"}
          },
          "required": ["city"]
        }
      }
    }
  ]
}
\`\`\`

模型响应中如果需要调工具，会返回：
\`\`\`json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "call_abc123",
        "type": "function",
        "function": {
          "name": "get_weather",
          "arguments": "{\\"city\\": \\"北京\\"}"
        }
      }]
    }
  }]
}
\`\`\`

## 在你的 C++ 项目中实现

核心改动在 \`AIStrategy::buildRequest()\` 中：
1. 将 \`AIToolRegistry\` 中注册的工具转换为 JSON Schema
2. 加入请求的 \`tools\` 字段
3. 解析响应时检查 \`tool_calls\` 字段而非从文本中抽取 JSON

## 深入学习

- [通义千问 Function Calling 文档](https://help.aliyun.com/zh/model-studio/developer-reference/use-qwen-by-calling-api) — 阿里云官方
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling) — 行业标准参考
`,
      },
    ],
  },
  {
    subTaskTitle: 'SSE 流式输出',
    milestoneId: 'agent-upgrade',
    lessons: [
      {
        id: 'sse-1',
        title: 'SSE 流式输出：让用户"看到AI在打字"',
        duration: '45min',
        content: `# SSE（Server-Sent Events）流式输出

## 为什么需要？

用 ChatGPT 的时候，你会看到文字一个一个蹦出来，而不是等 10 秒后一整段话出来。这就是 SSE 流式输出。

**用户体验对比**：
- 没有 SSE：点发送 → 转圈 3 秒 → 啪！整段文字出来
- 有 SSE：点发送 → 0.2 秒后第一个字出来 → 逐字显示 → 3 秒后全部显示完

首 token 延迟从 3s 降到 200ms，用户体验提升 10 倍。

## 原理

SSE 是 HTTP 协议的一部分，服务端可以持续往客户端"推"数据：

\`\`\`
客户端                    服务端
  |  GET /chat (Accept: text/event-stream)  |
  |  ────────────────────────────────────>  |
  |                                         |
  |  data: {"token": "你"}                   |
  |  <────────────────────────────────────  |
  |  data: {"token": "好"}                   |
  |  <────────────────────────────────────  |
  |  data: {"token": "！"}                   |
  |  <────────────────────────────────────  |
  |  data: [DONE]                            |
  |  <────────────────────────────────────  |
\`\`\`

## 在 C++ 中实现

你的项目基于 muduo，核心是利用 curl 的 \`WRITEFUNCTION\` 回调：

\`\`\`cpp
// 1. 设置 curl 流式回调
size_t streamCallback(char* data, size_t size, size_t nmemb,
                      void* userdata) {
    auto* conn = static_cast<TcpConnectionPtr*>(userdata);
    string chunk(data, size * nmemb);

    // 解析 SSE 格式: "data: {...}\\n\\n"
    // 提取 delta.content 中的 token
    string token = extractToken(chunk);

    if (!token.empty()) {
        // 2. 立即推送给客户端
        string sseData = "data: " + json(token) + "\\n\\n";
        (*conn)->send(sseData);
    }
    return size * nmemb;
}

// 3. HTTP 响应头
response.setHeader("Content-Type", "text/event-stream");
response.setHeader("Cache-Control", "no-cache");
response.setHeader("Connection", "keep-alive");
\`\`\`

## 深入学习

- [MDN: Server-Sent Events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events) — 浏览器端标准
- [curl WRITEFUNCTION 文档](https://curl.se/libcurl/c/CURLOPT_WRITEFUNCTION.html) — C/C++ 流式接收
`,
      },
    ],
  },
  {
    subTaskTitle: '记忆管理（滑动窗口+压缩）',
    milestoneId: 'agent-upgrade',
    lessons: [
      {
        id: 'memory-1',
        title: '对话记忆：让AI记住你说过什么',
        duration: '30min',
        content: `# 对话记忆管理

## 问题是什么？

LLM 本身是"无记忆"的——每次请求都是独立的。你的项目通过 \`messages[]\` 数组维护上下文，每次把完整历史发给模型。

但问题来了：**聊天越多，messages 越长，直到超过模型的上下文窗口（4K/8K/128K tokens）**。

这就像你的手机只有 128GB 存储——你不能无限拍照，总得删一些或者压缩。

## 三种记忆策略

### 1. 滑动窗口（最简单，推荐先实现）

只保留最近 N 轮对话，丢弃更早的：

\`\`\`cpp
// 保留最近 20 条消息
if (messages.size() > 20) {
    // 保留 system prompt（第一条）+ 最近 19 条
    messages.erase(messages.begin() + 1,
                   messages.end() - 19);
}
\`\`\`

**优点**：简单、可预测
**缺点**：丢失早期重要信息

### 2. 摘要压缩（进阶）

把旧对话压缩成一段摘要，插入 system prompt：

\`\`\`
之前的对话摘要：用户询问了北京天气（晴，25°C），
然后问了上海天气（阴，22°C），接着讨论了周末出行计划。
\`\`\`

### 3. 混合策略（最佳实践）

- 最近 5 轮：完整保留
- 更早的：压缩为摘要
- 关键信息：提取为"长期记忆"（用户偏好、重要事实）

## 实操建议

先实现滑动窗口（30 分钟就能做完），然后在此基础上加摘要。

## 深入学习

- [LangChain Memory](https://python.langchain.com/docs/modules/memory/) — 各种记忆策略参考
- [MemGPT 论文](https://arxiv.org/abs/2310.08560) — 操作系统级的记忆管理思路
`,
      },
    ],
  },
  {
    subTaskTitle: '新增工具（代码执行/搜索）',
    milestoneId: 'agent-upgrade',
    lessons: [
      {
        id: 'tools-1',
        title: '给 Agent 装上新技能',
        duration: '45min',
        content: `# 扩展 Agent 工具集

## 为什么需要更多工具？

你的 Agent 现在只有两个技能：查天气和查时间。这就像一个实习生只会倒水和复印——能用，但不够强。

AI Agent 的能力上限 = LLM 推理能力 × 工具丰富度。

## 值得实现的工具（按 ROI 排序）

### 1. 网页搜索（ROI 最高）

让 AI 能搜索互联网，解决知识截止问题：

\`\`\`cpp
// 调用搜索 API（推荐 SearXNG 开源方案或 Bing Search API）
string webSearch(const json& args) {
    string query = args["query"];
    string url = "https://api.bing.microsoft.com/v7.0/search?q="
                 + urlEncode(query);
    // curl 请求 → 解析 JSON → 返回前 3 条结果摘要
}
\`\`\`

### 2. 代码执行（展示 AI 编程能力）

让 AI 能写代码并运行：

\`\`\`cpp
string executeCode(const json& args) {
    string code = args["code"];
    string language = args["language"];  // python/cpp

    // 写入临时文件 → Docker 沙箱执行 → 返回输出
    // 注意：必须有沙箱隔离！不能直接 system()
}
\`\`\`

### 3. 文档检索（结合 RAG）

让 AI 能检索你的知识库：
\`\`\`cpp
string searchDocs(const json& args) {
    string query = args["query"];
    // 调用 RAG 检索 → 返回最相关的 3 个文档片段
}
\`\`\`

## 工具注册最佳实践

在你的 \`AIToolRegistry\` 中，每个工具应该有：
1. **名称**：简短唯一的标识符
2. **描述**：告诉 LLM 这个工具能做什么（越清晰越好）
3. **参数 Schema**：JSON Schema 定义参数类型
4. **执行函数**：实际的调用逻辑
5. **超时控制**：防止工具卡死

## 深入学习

- [Anthropic Tool Use 设计指南](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) — 工具设计最佳实践
- [SearXNG](https://github.com/searxng/searxng) — 开源搜索引擎聚合
`,
      },
    ],
  },
];

// ==================== 里程碑4: RAG 自建全链路 ====================

const ragCourses: CourseModule[] = [
  {
    subTaskTitle: 'ONNX Runtime 加载 BGE-small Embedding',
    milestoneId: 'rag-self-build',
    lessons: [
      {
        id: 'embed-1',
        title: 'Embedding 是什么？把文字变成数字向量',
        duration: '30min',
        content: `# 文本 Embedding

## 大白话

Embedding 就是**把文字翻译成一串数字**，让计算机能理解语义。

举个例子：
- "猫" → [0.8, 0.1, 0.3, ...]（512 个数字）
- "狗" → [0.7, 0.2, 0.3, ...]（和猫很接近，因为都是宠物）
- "汽车" → [0.1, 0.9, 0.5, ...]（和猫差很远）

这些数字向量有个神奇的性质：**语义相近的文本，向量距离也近**。

## 用你熟悉的 C++ 类比

\`\`\`cpp
// 你的路由系统：URL → Handler（一对一映射）
unordered_map<string, Handler> routes;

// Embedding：文本 → 向量（语义空间中的坐标）
vector<float> embed(string text);
// 相似度 = 两个向量的余弦相似度
float similarity(vector<float>& a, vector<float>& b);
\`\`\`

## 为什么用 BGE-small-zh？

| 模型 | 维度 | 大小 | 中文效果 | 推理速度 |
|------|------|------|---------|---------|
| BGE-small-zh | 512 | 95MB | 很好 | 快 |
| BGE-large-zh | 1024 | 650MB | 最好 | 中 |
| text-embedding-ada-002 | 1536 | API调用 | 好 | 取决于网络 |

BGE-small 是性价比之王：95MB，CPU 跑得动，中文效果优秀。

## ONNX Runtime 加载步骤

\`\`\`cpp
#include <onnxruntime_cxx_api.h>

Ort::Env env(ORT_LOGGING_LEVEL_WARNING, "embedding");
Ort::Session session(env, "bge-small-zh.onnx", sessionOptions);

// 输入：token_ids（分词后的整数序列）
// 输出：512 维浮点向量
\`\`\`

你已经用过 ONNX Runtime 做图像识别（MobileNetV2），文本 Embedding 流程几乎一样，只是输入从图片像素换成了 token IDs。

## 深入学习

- [BGE 模型 GitHub](https://github.com/FlagOpen/FlagEmbedding) — 下载模型和使用指南
- [ONNX Runtime C++ API](https://onnxruntime.ai/docs/api/c/) — 官方 C++ 文档
- [Sentence-BERT 论文](https://arxiv.org/abs/1908.10084) — 文本 Embedding 的里程碑
`,
      },
    ],
  },
  {
    subTaskTitle: 'FAISS C++ API 向量索引',
    milestoneId: 'rag-self-build',
    lessons: [
      {
        id: 'faiss-1',
        title: 'FAISS：高效向量检索引擎',
        duration: '45min',
        content: `# FAISS 向量检索

## 大白话

你有 10 万个文档，每个都变成了一个 512 维的向量。用户问一个问题，也变成向量。怎么快速找到最相似的 5 个文档？

最笨的方法：逐一计算余弦相似度 → O(n)，10 万个文档要算 10 万次。

FAISS（Facebook AI Similarity Search）通过**建索引**，把搜索时间从 O(n) 降到 O(log n)。

**类比**：就像字典——你不会从第一页翻到最后一页找"苹果"，你会先翻到 P 开头的章节。FAISS 对向量做了类似的"分章节"。

## 常用索引类型

| 索引 | 特点 | 适用场景 |
|------|------|---------|
| \`IndexFlatL2\` | 精确搜索，暴力遍历 | < 10万条，要求 100% 准确 |
| \`IndexIVFFlat\` | 先聚类再搜索，近似 | 10万~100万条 |
| \`IndexIVFPQ\` | 聚类+量化压缩，速度最快 | > 100万条，允许少量误差 |

对你的项目（几百到几万个文档片段），\`IndexFlatL2\` 就够用了。

## C++ 使用示例

\`\`\`cpp
#include <faiss/IndexFlatL2.h>

int d = 512;  // 向量维度
faiss::IndexFlatL2 index(d);

// 添加文档向量
vector<float> embeddings = ...; // n * d 的一维数组
index.add(n, embeddings.data());

// 搜索：找最相似的 top-5
vector<float> query = embed("用户的问题");
int k = 5;
vector<float> distances(k);
vector<faiss::idx_t> indices(k);
index.search(1, query.data(), k, distances.data(), indices.data());

// indices[0] 就是最相似的文档编号
\`\`\`

## 深入学习

- [FAISS GitHub](https://github.com/facebookresearch/faiss) — 官方仓库 + Wiki
- [FAISS 索引选型指南](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index) — 帮你选最适合的索引
`,
      },
    ],
  },
  {
    subTaskTitle: '文档递归分块',
    milestoneId: 'rag-self-build',
    lessons: [
      {
        id: 'chunk-1',
        title: '文档分块：RAG 的"地基"',
        duration: '30min',
        content: `# 文档分块策略

## 为什么要分块？

LLM 的上下文窗口有限（8K~128K tokens），你不能把一整本书塞进去。而且，检索时你也只想找到最相关的**那一段**，而不是整个文档。

**类比**：图书馆找信息——你不会搬一整个书架，你会找到相关的那一章，甚至那一段。

## 三种分块策略

### 1. 固定长度分块（最简单）
每 500 字切一刀，相邻块有 50 字重叠。
- 优点：简单
- 缺点：可能从句子中间切断

### 2. 递归分块（推荐！）
按层级切分：先按章节 → 段落 → 句子 → 字符
\`\`\`
层级1: 按 "\\n\\n" 切（段落）
  → 如果某段太长，按 "\\n" 切（行）
    → 还是太长，按 "。！？" 切（句子）
      → 还是太长，按字符切（最后手段）
\`\`\`

### 3. 语义分块（最高级）
用 Embedding 计算相邻句子的相似度，相似度突变的地方切分。
- 优点：语义最连贯
- 缺点：需要额外计算 Embedding

## 实现建议

先用递归分块，chunk_size=500, overlap=50：

\`\`\`python
# 伪代码
def recursive_split(text, max_size=500, overlap=50):
    separators = ["\\n\\n", "\\n", "。", "！", "？", " "]
    for sep in separators:
        chunks = text.split(sep)
        if all(len(c) <= max_size for c in chunks):
            return merge_with_overlap(chunks, overlap)
    # 最后用字符切
    return [text[i:i+max_size] for i in range(0, len(text), max_size-overlap)]
\`\`\`

## 深入学习

- [LangChain Text Splitters](https://python.langchain.com/docs/modules/data_connection/document_transformers/) — 各种分块策略实现
- [Chunking 策略对比实验](https://www.pinecone.io/learn/chunking-strategies/) — Pinecone 的实测报告
`,
      },
    ],
  },
  {
    subTaskTitle: '混合检索 BM25+Dense',
    milestoneId: 'rag-self-build',
    lessons: [
      {
        id: 'hybrid-1',
        title: '混合检索：两种搜索策略的合体',
        duration: '45min',
        content: `# 混合检索

## 大白话

想象你在找一本书：
- **关键词搜索（BM25）**：你知道书名里有"C++"这个词 → 直接搜关键词
- **语义搜索（Dense）**：你只知道"想学编程" → 搜索系统理解你的意思，找到相关的书

两种方式各有擅长：BM25 对**精确关键词**很强（搜索 "MVCC" 一定能找到包含 MVCC 的文档），Dense 对**语义理解**很强（搜索"数据库并发控制"也能找到 MVCC 相关文档）。

**混合检索 = 两者取长补短**。

## BM25 原理（30秒版）

核心公式考虑两个因素：
1. **词频（TF）**：这个词在文档中出现越多，越相关
2. **逆文档频率（IDF）**：这个词越罕见（只在少数文档中出现），越有区分度

"的" 出现在每个文档中 → IDF 低 → 不重要
"MVCC" 只出现在少数文档中 → IDF 高 → 很重要

## 混合策略

\`\`\`
用户 query
    ├── BM25 检索 → Top 50 候选
    ├── Dense 向量检索 → Top 50 候选
    └── 合并 + 去重
         ↓
    Reciprocal Rank Fusion (RRF)
    score = Σ 1/(k + rank_i)
         ↓
    Top 10 最终结果
\`\`\`

RRF 的直觉：如果一个文档在两种搜索中**排名都很高**，那它一定很相关。

## 深入学习

- [Reciprocal Rank Fusion](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf) — RRF 原始论文
- [Elasticsearch: Reciprocal Rank Fusion](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html) — ES 的 RRF 实现
`,
      },
    ],
  },
  {
    subTaskTitle: 'Reranking Cross-Encoder',
    milestoneId: 'rag-self-build',
    lessons: [
      {
        id: 'rerank-1',
        title: 'Reranking：检索结果的"精选"',
        duration: '30min',
        content: `# Reranking 重排序

## 大白话

初步检索像**海选**——快速筛出 50 个候选人。
Reranking 像**复试**——仔细评估每个候选人，选出最好的 5 个。

为什么不直接"复试"全部文档？因为 Cross-Encoder 很慢（要逐一比对），只能处理少量候选。

## Bi-Encoder vs Cross-Encoder

\`\`\`
Bi-Encoder（检索阶段）：
  query → [Encoder] → 向量q
  doc   → [Encoder] → 向量d    → 余弦相似度
  ✅ 快：文档向量可以预先计算
  ❌ 粗：query 和 doc 不交互

Cross-Encoder（重排阶段）：
  [query + doc] → [Encoder] → 相关性分数
  ❌ 慢：每个 doc 都要和 query 拼起来过模型
  ✅ 精：query 和 doc 深度交互
\`\`\`

## 工程流程

\`\`\`
1. 检索：FAISS Top-50（毫秒级）
2. Rerank：Cross-Encoder 对 50 个候选评分（百毫秒级）
3. 取 Top-5 作为 LLM 的上下文
\`\`\`

推荐模型：\`bge-reranker-v2-m3\`（BAAI 开源），ONNX 格式可以用 C++ 加载。

## 效果提升

实测数据（来自多个公开评测）：
- 只用 Dense 检索：Recall@5 约 75%
- Dense + Reranking：Recall@5 约 90%（提升 15-20%）

## 深入学习

- [BGE Reranker](https://github.com/FlagOpen/FlagEmbedding/tree/master/FlagEmbedding/reranker) — 下载和使用
- [Cross-Encoder vs Bi-Encoder](https://www.sbert.net/examples/applications/cross-encoder/README.html) — SBERT 官方对比
`,
      },
    ],
  },
];

// ==================== 里程碑5: Python + LangChain ====================

const pythonCourses: CourseModule[] = [
  {
    subTaskTitle: 'Python 语法（与C++对照）',
    milestoneId: 'python-langchain',
    lessons: [
      {
        id: 'py-1',
        title: 'Python 速通：C++ 开发者的 2 小时指南',
        duration: '1h',
        content: `# C++ → Python 速通

## 核心区别一览

| 维度 | C++ | Python |
|------|-----|--------|
| 类型 | 静态类型 \`int x = 5;\` | 动态类型 \`x = 5\` |
| 编译 | 编译为机器码 | 解释执行 |
| 内存 | 手动/智能指针 | GC 自动回收 |
| 作用域 | \`{}\` 花括号 | **缩进**（4个空格） |
| 标准库 | STL | 极其丰富（"batteries included"） |

## 语法对照表

### 变量和类型
\`\`\`python
# Python 不需要声明类型
x = 42              # int
name = "Rain"       # str
pi = 3.14           # float
is_cool = True      # bool
items = [1, 2, 3]   # list (类似 vector)
data = {"key": "value"}  # dict (类似 unordered_map)
\`\`\`

### 函数
\`\`\`python
# C++: int add(int a, int b) { return a + b; }
def add(a: int, b: int) -> int:
    return a + b

# 默认参数、可变参数
def greet(name: str, greeting: str = "Hello"):
    print(f"{greeting}, {name}!")

# lambda
square = lambda x: x ** 2
\`\`\`

### 类
\`\`\`python
# C++ 的 class 对应
class AIStrategy:
    def __init__(self, name: str):  # 构造函数
        self.name = name            # 成员变量

    def predict(self, query: str) -> str:  # 成员函数
        return f"Response from {self.name}"

# 继承
class QwenStrategy(AIStrategy):
    def predict(self, query: str) -> str:
        return "Qwen says: " + super().predict(query)
\`\`\`

### 容器操作
\`\`\`python
# vector<int> → list
nums = [1, 2, 3, 4, 5]
nums.append(6)           # push_back
nums.pop()               # pop_back
doubled = [x*2 for x in nums]  # 列表推导式（Python 最美的语法）

# unordered_map → dict
cache = {}
cache["key"] = "value"   # 插入
val = cache.get("key", "default")  # 带默认值的查找

# set
unique = set([1, 2, 2, 3])  # {1, 2, 3}
\`\`\`

## Python 独有的好东西

\`\`\`python
# 1. 多返回值
def min_max(nums):
    return min(nums), max(nums)
lo, hi = min_max([3, 1, 4, 1, 5])

# 2. with 语句（类似 RAII）
with open("file.txt") as f:
    content = f.read()
# 自动关闭文件，不用 try-finally

# 3. 装饰器（类似你的中间件）
def log(func):
    def wrapper(*args):
        print(f"Calling {func.__name__}")
        return func(*args)
    return wrapper

@log
def process():
    pass  # 每次调用 process() 会自动打日志
\`\`\`

## 30 分钟上手实践

1. 安装：\`brew install python3\` 或 [官网下载](https://www.python.org/downloads/)
2. 试试 REPL：终端输入 \`python3\`
3. 写第一个脚本：\`hello.py\`
4. 试试 \`pip install requests\` 然后调个 API

## 深入学习

- [Python for C++ Programmers](https://realpython.com/python-vs-cpp/) — RealPython 对比文章
- [Python 官方教程](https://docs.python.org/zh-cn/3/tutorial/) — 中文官方文档
`,
      },
    ],
  },
  {
    subTaskTitle: 'LangChain Agent ReAct',
    milestoneId: 'python-langchain',
    lessons: [
      {
        id: 'lc-agent-1',
        title: 'LangChain Agent：30 分钟跑通',
        duration: '30min',
        content: `# LangChain ReAct Agent 速通

## 为什么学 LangChain？

面试会问"你用过 LangChain 吗？"。你需要：
1. 知道行业是怎么做的
2. 能对比你的 C++ 实现和 LangChain 的异同
3. 能说出 LangChain 的优缺点

## 10 行代码跑通 Agent

\`\`\`python
pip install langchain langchain-openai
\`\`\`

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_react_agent
from langchain import hub
from langchain.tools import tool

# 1. 定义工具（类似你的 AIToolRegistry）
@tool
def get_weather(city: str) -> str:
    """查询城市天气"""
    return f"{city}: 晴，25°C"

# 2. 创建 Agent
llm = ChatOpenAI(model="qwen-plus", api_key="...", base_url="...")
prompt = hub.pull("hwchase17/react")  # 标准 ReAct Prompt
agent = create_react_agent(llm, [get_weather], prompt)
executor = AgentExecutor(agent=agent, tools=[get_weather], verbose=True)

# 3. 运行
result = executor.invoke({"input": "北京天气怎么样？"})
print(result["output"])
\`\`\`

## 你的 C++ 实现 vs LangChain 对比

| 维度 | 你的实现 | LangChain |
|------|---------|-----------|
| 语言 | C++ | Python |
| 代码量 | ~500 行 | ~10 行 |
| 性能 | 高（编译型） | 低（解释型） |
| 灵活性 | 完全可控 | 框架约束 |
| 生态 | 自建 | 海量集成 |
| 面试价值 | 展示底层能力 | 展示工程效率 |

**面试话术**："我先用 C++ 从底层理解了 Agent 的工作原理，然后用 LangChain 验证了行业最佳实践。两者结合让我对 Agent 架构有全栈的理解。"

## 深入学习

- [LangChain 官方文档](https://python.langchain.com/docs/get_started/introduction) — 最权威
- [LangChain 中文教程](https://www.langchain.com.cn/) — 社区翻译
`,
      },
    ],
  },
];

// ==================== 里程碑6: LLM 原理八股 ====================

const llmCourses: CourseModule[] = [
  {
    subTaskTitle: 'Tokenizer BPE',
    milestoneId: 'llm-fundamentals',
    lessons: [
      {
        id: 'bpe-1',
        title: 'Tokenizer：LLM 看到的不是文字，是数字',
        duration: '30min',
        content: `# Tokenizer 分词器

## 大白话

LLM 不认字，只认数字。Tokenizer 就是**文字 ↔ 数字的翻译官**。

"我爱编程" → [6236, 102, 32145, 10385] → 送给模型 → 模型输出数字 → 翻译回文字

## BPE（Byte Pair Encoding）原理

BPE 像学语言一样，先学字母，再学常见组合：

1. 初始词表：所有单个字符 {a, b, c, ..., z, 我, 爱, ...}
2. 统计哪两个字符最常连在一起，比如 "t" + "h" → "th"
3. 把 "th" 加入词表
4. 重复，直到词表达到目标大小（通常 32K~100K）

最终效果：
- 常见词是一个 token：\`"the"\` → 1 个 token
- 罕见词被拆成多个：\`"Pneumonoultramicroscopic"\` → 好几个 token
- 中文每个字通常是 1-2 个 token

## 为什么重要？

1. **Token 数量 = 计费单位**：API 按 token 收费
2. **上下文窗口**：8K tokens 的窗口能放多少文字取决于分词效率
3. **推理速度**：token 越少 → 推理越快

## 面试标准答案

> "BPE 是一种基于数据驱动的分词算法，通过迭代合并频率最高的字符对来构建词表。优点是能处理 OOV（未登录词）问题，常见词用更少的 token 表示。GPT 系列使用 BPE 的变种，中文常用 SentencePiece（Unigram LM 方法）。"

## 深入学习

- [Hugging Face Tokenizer 教程](https://huggingface.co/docs/tokenizers/index) — 交互式学习
- [minbpe](https://github.com/karpathy/minbpe) — Karpathy 的最小 BPE 实现（200行Python）
`,
      },
    ],
  },
  {
    subTaskTitle: '预训练→SFT→RLHF',
    milestoneId: 'llm-fundamentals',
    lessons: [
      {
        id: 'training-1',
        title: '大模型的三步"教育"流程',
        duration: '45min',
        content: `# 大模型训练三阶段

## 大白话：培养一个AI的三步

1. **预训练（Pre-training）**= 上学读书
   - 读完互联网上的所有文字（TB 级数据）
   - 学会了语言、知识、推理能力
   - 但不知道怎么跟人聊天，也不知道什么该说什么不该说

2. **SFT（Supervised Fine-Tuning）**= 毕业后的岗前培训
   - 用高质量的"问-答"对进行训练
   - 学会了按照人的期望格式回答问题
   - 像客服培训："用户问A，你应该回答B"

3. **RLHF（Reinforcement Learning from Human Feedback）**= 用户反馈+绩效考核
   - 人类标注员给模型的回答打分
   - 训练一个"奖励模型"来预测人类偏好
   - 用 PPO 强化学习优化模型，让它学会输出人类喜欢的回答

## 三个阶段的技术细节

### 预训练
\`\`\`
目标：预测下一个 token（自回归）
数据：互联网文本（Common Crawl/Wikipedia/Books/代码）
算力：数千张 GPU，训练数周到数月
损失函数：Cross-Entropy Loss
关键技术：数据并行 + 模型并行 + 混合精度训练
\`\`\`

### SFT
\`\`\`
目标：学会按指令回答
数据：人工标注的指令-回答对（几万~几十万条）
关键：数据质量 >> 数据数量
      "一条高质量数据 > 100条低质量数据"
技术：LoRA/QLoRA 参数高效微调（不需要更新全部参数）
\`\`\`

### RLHF
\`\`\`
目标：对齐人类偏好
步骤：
  1. 让模型对同一问题生成多个回答
  2. 人类标注员给回答排序
  3. 用排序数据训练 Reward Model
  4. 用 PPO 算法优化生成模型
新趋势：DPO（Direct Preference Optimization）
         简化了 RLHF，不需要单独训练 Reward Model
\`\`\`

## 面试标准答案框架

> "大模型训练分为三个阶段：
> 1. **预训练**在海量文本上学习语言模型，使用 next token prediction 目标
> 2. **SFT** 用高质量指令数据微调，让模型学会遵循指令格式
> 3. **RLHF** 通过人类反馈强化学习，使模型输出更符合人类偏好
> 
> 现在的趋势是用 DPO 替代 RLHF（更简单，效果相当），以及用 LoRA/QLoRA 实现参数高效微调。"

## 深入学习

- [InstructGPT 论文](https://arxiv.org/abs/2203.02155) — RLHF 的里程碑论文
- [DPO 论文](https://arxiv.org/abs/2305.18290) — RLHF 的简化替代
- [LoRA 论文](https://arxiv.org/abs/2106.09685) — 参数高效微调
- [Karpathy: Let's build GPT](https://www.youtube.com/watch?v=kCc8FmEb1nY) — 从零手搓 GPT（强烈推荐）
`,
      },
    ],
  },
  {
    subTaskTitle: 'KV Cache/量化/FlashAttention',
    milestoneId: 'llm-fundamentals',
    lessons: [
      {
        id: 'inference-opt-1',
        title: '推理优化三板斧：让大模型跑得更快',
        duration: '45min',
        content: `# LLM 推理优化

## 为什么需要优化？

GPT-4 有 1.8 万亿参数，即使用最好的 GPU，生成一个 token 也需要数十毫秒。100 个 token 的回答要等好几秒。

推理优化 = 同样的模型，更快地输出。

## 三大优化技术

### 1. KV Cache（面试高频）

**问题**：自回归生成时，每生成一个新 token 都要重新计算之前所有 token 的 Key 和 Value。

**类比**：你写论文引用文献，每写一段都要重新去图书馆找一遍所有参考文献，太浪费了。

**解决**：把已经算过的 K 和 V 存起来（缓存），只计算新 token 的 K/V。

\`\`\`
没有 KV Cache：
  生成 token_1: 计算 [token_0] 的 KV
  生成 token_2: 计算 [token_0, token_1] 的 KV  ← 重复计算了 token_0
  生成 token_3: 计算 [token_0, token_1, token_2] 的 KV  ← 又重复了

有 KV Cache：
  生成 token_1: 计算 token_0 的 KV → 缓存
  生成 token_2: 复用 token_0 的 KV，只算 token_1 的 → 缓存
  生成 token_3: 复用 0,1 的 KV，只算 token_2 的 → 缓存
\`\`\`

时间复杂度从 O(n²) 降到 O(n)。

### 2. 量化（减少显存占用）

**思想**：模型参数本来是 FP32（32位浮点），精度很高但占空间。很多参数的精度其实不需要这么高。

\`\`\`
FP32 → FP16：精度几乎无损，显存减半
FP16 → INT8：精度轻微下降，显存再减半
INT8 → INT4：精度有损但多数场景可接受，显存极小
\`\`\`

**类比**：高清照片 10MB，压缩成 JPG 只要 1MB，肉眼几乎看不出区别。

### 3. FlashAttention（计算加速）

**问题**：标准 Attention 的 softmax(Q×K^T) 生成巨大的 N×N 矩阵，对 GPU 显存不友好。

**解决**：将计算分块（tiling），在 GPU SRAM（快但小）上完成计算，避免反复读写 HBM（慢但大）。

**效果**：2-4x 加速 + 减少显存占用，是当前所有大模型训练/推理的标配。

## 面试标准答案

> "推理优化我了解三个核心技术：
> 1. **KV Cache** 缓存历史 token 的 Key/Value，避免自回归中的重复计算
> 2. **量化** 用低精度（INT8/INT4）表示模型参数，牺牲少量精度换取显存和速度提升
> 3. **FlashAttention** 通过分块计算和 IO 感知优化，加速 Attention 计算
> 
> 工程方面，vLLM 的 PagedAttention 进一步优化了 KV Cache 的内存管理，像操作系统的虚拟内存分页一样，消除了内存碎片。"

## 深入学习

- [FlashAttention 论文](https://arxiv.org/abs/2205.14135) — Tri Dao, 2022
- [vLLM PagedAttention](https://blog.vllm.ai/2023/06/20/vllm.html) — 工程化最佳实践
- [GPTQ 量化](https://github.com/IST-DASLab/gptq) — INT4 量化方案
`,
      },
    ],
  },
  {
    subTaskTitle: 'MoE/Speculative Decoding',
    milestoneId: 'llm-fundamentals',
    lessons: [
      {
        id: 'advanced-1',
        title: '前沿技术：MoE 和投机解码',
        duration: '30min',
        content: `# 前沿推理技术

## MoE（Mixture of Experts）

### 大白话
一个公司不可能让所有员工都精通所有事，而是分成**专家组**：法务组处理法律问题，技术组处理技术问题，财务组处理财务问题。

MoE 就是这个思路：不让模型的所有参数处理每个 token，而是用一个**路由器**选择最合适的"专家"子网络。

### 关键概念
- **Router（门控网络）**：决定每个 token 由哪几个 Expert 处理
- **Expert**：每个 Expert 是一个完整的 FFN（前馈网络）
- **Top-K 路由**：每个 token 只激活 K 个 Expert（通常 K=2）

### 优势
- 总参数很大（如 Mixtral 8x7B = 47B 参数）
- 但每次推理只激活部分参数（~13B），速度与 13B 模型相当

## Speculative Decoding（投机解码）

### 大白话
大模型一个一个 token 地生成很慢。**投机解码**的思路：用一个**小模型快速猜**多个 token，然后让**大模型一次性验证**。

类比：写文章时，你的"直觉"先快速写一段草稿，然后"理性思维"审核修改。

### 流程
\`\`\`
小模型（Draft Model）快速生成 5 个 token：A B C D E
大模型（Target Model）并行验证：
  A ✓  B ✓  C ✗（大模型选择了 C'）
  → 最终输出 A B C'，从 C' 处重新让小模型猜
\`\`\`

### 效果
- 大模型只需要做一次前向传播就能验证多个 token
- 加速比通常 2-3x（取决于小模型猜对的比例）

## 面试话术

> "MoE 和投机解码是当前大模型工程化的两个前沿方向。MoE 通过稀疏激活实现了'参数多但推理快'，Mixtral 是典型代表。投机解码通过'小模型猜+大模型验'的方式加速了自回归生成。两者可以结合使用。"

## 深入学习

- [Mixtral 论文](https://arxiv.org/abs/2401.04088) — MoE 的标杆
- [Speculative Decoding 论文](https://arxiv.org/abs/2302.01318) — Google/DeepMind
`,
      },
    ],
  },
];

// ==================== 汇总导出 ====================

import { supplementaryCourses } from './courses_extended';

export const ALL_COURSES: CourseModule[] = [
  ...introCourses,
  ...agentUpgradeCourses,
  ...ragCourses,
  ...pythonCourses,
  ...llmCourses,
  ...supplementaryCourses,
];

/** 根据里程碑ID和子任务标题查找课程 */
export function findCourse(milestoneId: string, subTaskTitle: string): CourseModule | undefined {
  return ALL_COURSES.find(c => c.milestoneId === milestoneId && c.subTaskTitle === subTaskTitle);
}

/** 获取某个里程碑下的所有课程 */
export function getCoursesByMilestone(milestoneId: string): CourseModule[] {
  return ALL_COURSES.filter(c => c.milestoneId === milestoneId);
}
