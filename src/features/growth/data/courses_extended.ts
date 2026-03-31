/**
 * 补充课程 — 扩展已有里程碑的深度和广度
 */
import type { CourseModule } from './courses';

export const supplementaryCourses: CourseModule[] = [
  // ==================== Agent 升级：补充深度课 ====================
  {
    subTaskTitle: 'ReAct 循环（多步工具调用）',
    milestoneId: 'agent-upgrade',
    lessons: [
      {
        id: 'react-3',
        title: 'ReAct 实战：多工具协作与错误处理',
        duration: '1h',
        content: `# ReAct 实战进阶

> *"好的 Agent 不是永远不犯错，而是犯错后能自我修复。"*

## 🎯 本课目标

上一课你实现了基本的 ReAct 循环，但在实际场景中会遇到各种"翻车"。本课聚焦三个实战问题：
1. 多工具协作场景设计
2. 工具调用失败的兜底策略
3. 上下文管理与 token 优化

---

## 一、多工具协作场景

### 真实案例：智能旅行助手

用户问："下周末北京天气怎么样？帮我推荐一个适合的户外活动，顺便看看附近有没有好评的餐厅。"

这个问题需要 **三步推理**：

\`\`\`
Step 1: Thought: 需要先查天气
        Action: get_weather(city="北京", date="下周末")
        Observation: 晴，24°C，空气质量良好

Step 2: Thought: 天气不错，推荐户外活动，但我没有活动推荐工具，直接用知识回答
        Final Answer: (部分回答天气和活动推荐)
        
等等！这里有问题 ——Agent 在第二步就给了 Final Answer，
但还没查餐厅！
\`\`\`

### 解决方案：任务分解 Prompt

在系统 Prompt 中加入：

\`\`\`
你需要完成用户的所有子任务后才能给出 Final Answer。
如果用户的问题包含多个子任务，请逐一完成。
当前需要完成的子任务：
1. ✅ 查天气（已完成）
2. ⬜ 推荐活动
3. ⬜ 查餐厅
只有所有子任务完成后，才输出 Final Answer。
\`\`\`

### C++ 实现思路

\`\`\`cpp
// 在 ReAct 循环中加入任务清单管理
struct TaskList {
    vector<string> tasks;
    vector<bool> completed;
    
    string getStatusPrompt() {
        string prompt = "当前任务进度:\\n";
        for (int i = 0; i < tasks.size(); i++) {
            prompt += (completed[i] ? "✅ " : "⬜ ") + tasks[i] + "\\n";
        }
        return prompt;
    }
};

// 每步推理时将任务清单注入上下文
messages.push_back({role: "system", content: taskList.getStatusPrompt()});
\`\`\`

---

## 二、工具调用失败的兜底策略

### 常见失败场景

| 故障 | 原因 | 处理策略 |
|------|------|---------|
| 工具超时 | 外部 API 慢 | 设置超时 + 重试 + 降级 |
| 格式错误 | LLM 输出的参数不对 | JSON Schema 校验 + 修复重试 |
| 工具不存在 | LLM "幻想"了一个工具 | 返回可用工具列表让它重选 |
| 结果无关 | 工具返回了无用信息 | 让 LLM 判断结果是否有用 |

### 重试机制实现

\`\`\`cpp
string executeWithRetry(const string& toolName, const json& args, int maxRetry = 2) {
    for (int i = 0; i <= maxRetry; i++) {
        try {
            auto result = toolRegistry.invoke(toolName, args);
            if (!result.empty()) return result;
        } catch (const TimeoutException& e) {
            if (i < maxRetry) continue;  // 重试
            return "工具调用超时，请尝试其他方式回答";  // 降级
        } catch (const ToolNotFoundException& e) {
            return "可用工具：" + toolRegistry.listTools();  // 引导
        }
    }
    return "工具暂时不可用";
}
\`\`\`

### "自我修复"模式

当工具调用失败时，将错误信息回注给 LLM，让它自主修复：

\`\`\`
Observation: 错误 - get_weather 不接受 "weekend" 作为日期参数，
需要具体日期如 "2026-04-05"
\`\`\`

大部分情况下，LLM 会在下一步自动修正参数格式。

---

## 三、上下文管理与 Token 优化

### 问题：多步推理后 messages 暴增

一个 5 步的 ReAct 循环可能产生 10+ 条 messages（每步一个 assistant + 一个 observation），轻松吃掉几千 token。

### 优化策略

**策略 1：滑动窗口**
\`\`\`cpp
// 只保留最近 3 步的推理过程
if (messages.size() > 10) {
    // 保留 system prompt + 用户原始问题 + 最近 6 条
    auto kept = {messages[0], messages[1]};
    kept.insert(kept.end(), messages.end()-6, messages.end());
    messages = kept;
}
\`\`\`

**策略 2：摘要压缩**
\`\`\`
在步骤 3 之前注入：
"之前的推理摘要：查了北京天气（晴24°C），推荐了故宫和颐和园。
现在需要：查附近餐厅。"
\`\`\`

**策略 3：只保留关键 Observation**
工具返回可能很长（比如搜索结果），只取前 500 字符：
\`\`\`cpp
string obs = toolResult.substr(0, 500);
if (toolResult.length() > 500) obs += "...（已截断）";
\`\`\`

---

## 四、面试高频追问

**Q: Agent 怎么处理幻觉和工具调用失败？**

> "我设计了三层防御：
> 1. **格式校验**：用 JSON Schema 验证工具参数，格式错误时返回错误信息让 LLM 自修复
> 2. **重试降级**：工具调用失败时自动重试 2 次，仍失败则降级为直接回答
> 3. **结果验证**：工具返回后增加一步 LLM 自检——'这个结果回答了用户的问题吗？'
>
> 在我的实测中，加入自修复机制后，工具调用成功率从 ~85% 提升到 ~97%。"

---

## ✅ 本课总结

1. 多工具协作需要**任务分解 + 进度追踪**
2. 工具失败要有**重试 + 降级 + 自修复**三层兜底
3. 上下文管理是性能关键——**滑动窗口 + 摘要 + 截断**
4. 面试中强调"工程化"思维，不只是能跑通 demo

## 📚 延展学习

- [LangChain Agent Error Handling](https://python.langchain.com/docs/modules/agents/how_to/handle_parsing_errors) — 错误处理最佳实践
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) — 自主 Agent 的典型实现
- [Voyager (Minecraft Agent)](https://arxiv.org/abs/2305.16291) — 带自我验证的 Agent 论文
`,
      },
    ],
  },

  // ==================== RAG 自建：补充实战课 ====================
  {
    subTaskTitle: 'FAISS C++ API 向量索引',
    milestoneId: 'rag-self-build',
    lessons: [
      {
        id: 'faiss-2',
        title: 'FAISS 进阶：索引调优与生产部署',
        duration: '45min',
        content: `# FAISS 进阶实战

> *"检索系统的好坏，80% 取决于索引的选择和调优。"*

## 一、索引选型决策树

\`\`\`
你有多少条向量？
├── < 10K → IndexFlatL2（暴力搜索，100% 精确）
├── 10K ~ 100K → IndexIVFFlat（聚类后搜索）
│   └── nlist = sqrt(n)，nprobe = nlist/10
├── 100K ~ 1M → IndexIVFPQ（聚类+量化压缩）
│   └── 内存降低 4-8x，recall@10 约 95%
└── > 1M → IndexHNSW 或 IndexIVFPQ + OPQ
    └── HNSW recall 更高但内存也更大
\`\`\`

## 二、关键参数调优

### IVFFlat 参数

| 参数 | 含义 | 建议值 | 影响 |
|------|------|--------|------|
| **nlist** | 聚类中心数 | sqrt(n) ~ 4*sqrt(n) | 越大→构建越慢但查询可能更快 |
| **nprobe** | 搜索时探测的聚类数 | nlist 的 5%~10% | 越大→越精确但越慢 |

**调优方法**：固定 nlist，逐步增大 nprobe，画 recall-latency 曲线，选拐点。

### 实测示例

\`\`\`cpp
#include <faiss/IndexIVFFlat.h>
#include <faiss/IndexFlatL2.h>

int d = 512;        // 向量维度
int nlist = 100;     // 聚类中心数
int nprobe = 10;     // 搜索探测数

// 1. 创建量化器（底层用 FlatL2）
faiss::IndexFlatL2 quantizer(d);

// 2. 创建 IVF 索引
faiss::IndexIVFFlat index(&quantizer, d, nlist);

// 3. 训练（需要一定量的数据来学习聚类）
index.train(n, data);  // n >= 39 * nlist

// 4. 添加向量
index.add(n, data);

// 5. 搜索
index.nprobe = nprobe;
index.search(1, query, k, distances, indices);
\`\`\`

## 三、持久化与加载

\`\`\`cpp
// 保存索引到文件
faiss::write_index(&index, "my_index.faiss");

// 加载索引
auto* loaded = faiss::read_index("my_index.faiss");

// 增量更新：FAISS 不支持删除，常见方案：
// 1. 标记删除 + 定期 rebuild
// 2. 使用 IndexIDMap 管理 ID 映射
faiss::IndexIDMap idIndex(&index);
long ids[] = {1001, 1002, 1003};
idIndex.add_with_ids(3, data, ids);
\`\`\`

## 四、与你项目的集成

在 RainCppAI 中的集成路径：

\`\`\`
用户提问
  → Tokenize + ONNX Embedding (BGE-small)
  → FAISS 搜索 Top-5 相似文档块
  → 拼接到 Prompt
  → 调用 LLM 生成回答
\`\`\`

关键性能指标：
- Embedding 推理：~10ms/query（ONNX Runtime CPU）
- FAISS 搜索：~1ms（10K 向量 FlatL2）
- 整体 RAG 延迟应 < 50ms（不含 LLM 生成时间）

## ✅ 本课总结

1. 索引选型看数据量：<10K 暴力搜，>100K 用 IVF 系列
2. nlist 和 nprobe 是核心调参，画 recall-latency 曲线
3. 持久化用 write_index/read_index，增量更新用 IndexIDMap
4. 你的项目目标：CPU 环境 10K 文档块，FlatL2 就够用

## 📚 延展学习

- [FAISS Wiki: Faiss indexes](https://github.com/facebookresearch/faiss/wiki/Faiss-indexes) — 全部索引类型对比
- [ann-benchmarks](https://ann-benchmarks.com/) — 各种 ANN 算法的性能评测
`,
      },
    ],
  },

  // ==================== RAG 新课：端到端集成 ====================
  {
    subTaskTitle: '混合检索 BM25+Dense',
    milestoneId: 'rag-self-build',
    lessons: [
      {
        id: 'hybrid-2',
        title: 'BM25 实现：用 C++ 写一个简易搜索引擎',
        duration: '1h',
        content: `# 手写 BM25 搜索引擎

> *"理解搜索引擎的最好方式，就是自己写一个。"*

## 为什么要自己实现 BM25？

面试官问"如果不用 ES 和第三方库，你怎么实现文本检索？"——你要能手搓。

而且 BM25 的 C++ 实现非常简洁，只有 ~100 行代码。

## BM25 公式解剖

\`\`\`
score(D, Q) = Σ IDF(qi) × (f(qi,D) × (k1+1)) / (f(qi,D) + k1 × (1-b+b×|D|/avgdl))
\`\`\`

别被公式吓到，拆开看：
- **IDF(qi)**：这个词有多"稀有"（出现在越少文档中越稀有越重要）
- **f(qi,D)**：这个词在当前文档中出现了几次
- **|D|/avgdl**：当前文档长度 / 平均文档长度（长文档做惩罚）
- **k1 和 b**：调节参数，通常 k1=1.5, b=0.75

**用大白话说**：一个词越稀有 × 在文档中出现越多 × 文档不是特别长 → 这个文档越相关。

## C++ 实现

\`\`\`cpp
#include <cmath>
#include <string>
#include <vector>
#include <unordered_map>
#include <sstream>

class BM25 {
    double k1 = 1.5, b = 0.75;
    int totalDocs = 0;
    double avgDocLen = 0;
    
    // 每个文档的词频表
    vector<unordered_map<string, int>> docTermFreqs;
    // 每个词出现在多少文档中
    unordered_map<string, int> docFreq;
    // 每个文档的长度
    vector<int> docLengths;
    
public:
    // 分词（简易版：按空格分）
    vector<string> tokenize(const string& text) {
        vector<string> tokens;
        istringstream iss(text);
        string word;
        while (iss >> word) tokens.push_back(word);
        return tokens;
    }
    
    // 添加文档
    void addDocument(const string& text) {
        auto tokens = tokenize(text);
        unordered_map<string, int> tf;
        for (auto& t : tokens) tf[t]++;
        
        // 更新文档频率
        for (auto& [term, _] : tf) docFreq[term]++;
        
        docTermFreqs.push_back(tf);
        docLengths.push_back(tokens.size());
        totalDocs++;
        
        // 更新平均文档长度
        double totalLen = 0;
        for (auto len : docLengths) totalLen += len;
        avgDocLen = totalLen / totalDocs;
    }
    
    // 计算 IDF
    double idf(const string& term) {
        int df = docFreq.count(term) ? docFreq[term] : 0;
        return log((totalDocs - df + 0.5) / (df + 0.5) + 1.0);
    }
    
    // 搜索：返回 top-k 文档索引及分数
    vector<pair<int, double>> search(const string& query, int topK = 5) {
        auto queryTerms = tokenize(query);
        vector<pair<int, double>> scores;
        
        for (int i = 0; i < totalDocs; i++) {
            double score = 0;
            for (auto& qt : queryTerms) {
                int tf = docTermFreqs[i].count(qt) ? docTermFreqs[i][qt] : 0;
                if (tf == 0) continue;
                double termIdf = idf(qt);
                double numerator = tf * (k1 + 1);
                double denominator = tf + k1 * (1 - b + b * docLengths[i] / avgDocLen);
                score += termIdf * numerator / denominator;
            }
            if (score > 0) scores.push_back({i, score});
        }
        
        sort(scores.begin(), scores.end(),
             [](auto& a, auto& b) { return a.second > b.second; });
        if (scores.size() > topK) scores.resize(topK);
        return scores;
    }
};
\`\`\`

## 试试运行

\`\`\`cpp
// 可以在你的 RainCppAI 项目中测试
#include <iostream>
using namespace std;

int main() {
    BM25 engine;
    engine.addDocument("Redis 是一个内存数据库 支持多种数据结构");
    engine.addDocument("MySQL 是关系型数据库 使用 B+ 树索引");
    engine.addDocument("Redis 的持久化方式有 RDB 和 AOF");
    engine.addDocument("MySQL 的事务隔离级别有四种");
    
    auto results = engine.search("Redis 数据结构", 3);
    for (auto& [idx, score] : results) {
        cout << "Doc " << idx << " score: " << score << endl;
    }
    // 预期：Doc 0 分数最高（同时包含 Redis 和 数据结构）
}
\`\`\`

## 面试回答框架

> "BM25 是基于 TF-IDF 改进的概率检索模型，核心考虑三个因素：词项稀有度(IDF)、文档内词频(TF)、文档长度归一化。相比原始 TF-IDF，BM25 对高词频做了饱和处理（TF 的增长是有上限的），对长文档做了合理惩罚。我在项目中用 C++ 实现了一个简易 BM25 引擎，配合 FAISS 向量检索做混合检索。"

## ✅ 本课总结

1. BM25 核心 = IDF × 饱和TF × 长度归一化
2. C++ 实现只要 ~80 行
3. 面试中能手写 BM25 是巨大加分项
4. 和 Dense 检索互补：BM25 精确关键词，Dense 语义理解

## 📚 延展学习

- [BM25 原始论文](https://www.staff.city.ac.uk/~sbrp622/papers/okapi_trec3.pdf) — Robertson & Walker
- [Elasticsearch BM25 调优](https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables) — ES 官方博客
`,
      },
    ],
  },

  // ==================== LLM 原理：补充 Prompt Engineering 实战 ====================
  {
    subTaskTitle: 'Prompt Engineering',
    milestoneId: 'llm-fundamentals',
    lessons: [
      {
        id: 'prompt-1',
        title: 'Prompt Engineering：让 AI 听懂你的话',
        duration: '45min',
        content: `# Prompt Engineering 实战

> *"和大模型沟通，就像和一个聪明但不懂人情的外星人对话——你得把话说得非常明确。"*

## 一、为什么 Prompt 这么重要？

同一个模型，不同的 Prompt 效果天壤之别：

**差的 Prompt**：
> "帮我写个代码"
> → 模型：写什么代码？用什么语言？干什么用的？

**好的 Prompt**：
> "用 C++17 实现一个线程安全的 LRU 缓存，支持 get 和 put 操作，要求 O(1) 时间复杂度。请使用 unordered_map + 双向链表，加上 mutex 保护。"
> → 模型直接输出完整代码

**区别在于**：好的 Prompt 包含了 **角色、上下文、任务、约束、格式** 五要素。

## 二、核心技巧速记

### 1. System Prompt 定义角色

\`\`\`
你是一个资深 C++ 工程师，专长于高性能服务器开发。
回答问题时：
- 给出具体的代码示例
- 解释底层原理
- 指出常见陷阱
\`\`\`

### 2. Few-shot 给示例教格式

\`\`\`
请分析以下函数的时间复杂度：

示例1：
函数：for循环遍历数组一次
复杂度：O(n)
理由：单层循环，与数组长度成正比

示例2：
函数：嵌套两层for循环
复杂度：O(n²)
理由：外层n次，内层每次n次

现在分析：
函数：快速排序
复杂度：？
理由：？
\`\`\`

### 3. Chain-of-Thought 分步推理

\`\`\`
请一步一步分析以下代码是否有内存泄漏，展示你的推理过程：

Step 1: 找出所有 new/malloc 调用
Step 2: 追踪每个分配是否有对应的 delete/free
Step 3: 检查异常路径是否会跳过释放
Step 4: 给出结论
\`\`\`

### 4. Output Format 结构化输出

\`\`\`
请以 JSON 格式输出代码审查结果：
{
  "issues": [
    {"severity": "high|medium|low", "line": 数字, "description": "..."}
  ],
  "score": 0-100,
  "summary": "一句话总结"
}
\`\`\`

### 5. Context Engineering（你的 MCP 就是这个！）

Context Engineering 是 2025 年的新趋势——不仅优化 Prompt 文本，还精心组织**注入给模型的整个上下文**：

\`\`\`
你的 MCP 两段式推理就是 Context Engineering 的实践：
第一段：注入工具描述 + 用户问题 → 让模型决策
第二段：注入工具结果 + 用户问题 → 让模型综合回答
\`\`\`

## 三、面试实战

面试官可能当场给你一个场景，让你写 Prompt：

**场景**：设计一个 Prompt，让模型从一段产品评论中提取"情感倾向"和"关键问题"。

\`\`\`
你是一个电商产品分析师。请分析以下用户评论：

评论："{review_text}"

请提取：
1. 情感倾向：正面/中性/负面
2. 关键问题：列出用户提到的具体问题（如果有）
3. 改进建议：根据问题给出产品改进建议

以 JSON 格式输出：
{"sentiment": "...", "issues": [...], "suggestions": [...]}
\`\`\`

## 四、进阶技巧

| 技巧 | 场景 | 效果 |
|------|------|------|
| **Self-consistency** | 多次采样取多数答案 | 提升准确率 |
| **Tree of Thought** | 复杂推理 | 探索多条思路 |
| **ReAct** | 需要外部信息 | 你已经实现了！ |
| **Reflection** | 让模型自我检查 | 减少错误 |

\`\`\`javascript
// 试试 Reflection 模式
console.log("=== Reflection Prompt Demo ===")
const prompt = \`
请解决这个问题，然后检查你的答案：

问题：一个 vector<int> 包含 [3,1,4,1,5,9,2,6]，
用快排排序后第 3 小的元素是什么？

步骤 1: 先排序
步骤 2: 找第 3 小
步骤 3: 检查 - 排序结果对吗？第 3 小找对了吗？
\`
console.log(prompt)
console.log("答案：排序后 [1,1,2,3,4,5,6,9]，第3小是 2")
\`\`\`

## ✅ 本课总结

1. 好 Prompt = 角色 + 上下文 + 任务 + 约束 + 格式
2. Few-shot 教模型学格式，CoT 教模型学推理
3. Context Engineering > Prompt Engineering（趋势）
4. 你的 MCP 项目就是 Context Engineering 的实践

## 📚 延展学习

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering) — 官方指南
- [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) — Claude 的最佳实践
- [DSPY](https://github.com/stanfordnlp/dspy) — 自动化 Prompt 优化框架（Stanford）
`,
      },
    ],
  },

  // ==================== LangChain RAG 实战 ====================
  {
    subTaskTitle: 'LangChain RAG FAISS',
    milestoneId: 'python-langchain',
    lessons: [
      {
        id: 'lc-rag-1',
        title: 'LangChain RAG：20 行代码搭建知识库问答',
        duration: '45min',
        content: `# LangChain RAG 速通

> 你已经理解了 RAG 的每个组件（Embedding/FAISS/Reranking），现在用 LangChain 把它们串起来。

## 20 行代码跑通 RAG

\`\`\`python
# pip install langchain langchain-community faiss-cpu sentence-transformers

from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

# 1. 加载文档
loader = TextLoader("knowledge.txt", encoding="utf-8")
docs = loader.load()

# 2. 分块
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(docs)

# 3. Embedding + 向量存储
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-zh-v1.5")
vectorstore = FAISS.from_documents(chunks, embeddings)

# 4. 构建 QA Chain
llm = ChatOpenAI(model="qwen-plus", api_key="...", base_url="...")
qa = RetrievalQA.from_chain_type(llm=llm, retriever=vectorstore.as_retriever(search_kwargs={"k": 3}))

# 5. 提问
answer = qa.invoke("Redis 为什么快？")
print(answer["result"])
\`\`\`

## 与你的 C++ 实现对比

| 组件 | LangChain (Python) | 你的 C++ 实现 |
|------|-------------------|--------------|
| 文档加载 | TextLoader (1行) | 自己读文件 |
| 分块 | RecursiveCharacterTextSplitter (1行) | 自己实现 |
| Embedding | HuggingFaceEmbeddings (1行) | ONNX Runtime 加载 BGE |
| 向量存储 | FAISS.from_documents (1行) | FAISS C++ API |
| 检索 | as_retriever() (1行) | FAISS search() |
| LLM | ChatOpenAI (1行) | curl 调 API |
| 总代码量 | ~20 行 | ~300 行 |

**面试话术**："LangChain 的优势是开发效率极高，20 行代码就能搭建完整 RAG。但我选择 C++ 实现的原因是：(1)性能可控，推理延迟优化到毫秒级；(2)深入理解底层原理，面试时能讲清楚每个环节；(3)在 C++ 服务中原生集成，不需要跨语言调用。"

## 进阶：加入 Reranking

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain_community.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

# Reranker 模型
reranker = HuggingFaceCrossEncoder(model_name="BAAI/bge-reranker-v2-m3")
compressor = CrossEncoderReranker(model=reranker, top_n=3)

# 先粗排 Top-20，再精排 Top-3
retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 20})
)
\`\`\`

## ✅ 本课总结

1. LangChain RAG 20 行代码 = 你 300 行 C++ 的效果
2. 但 C++ 实现展示了底层能力——面试核心竞争力
3. 两者都要会：Python 展示效率，C++ 展示深度

## 📚 延展学习

- [LangChain RAG 教程](https://python.langchain.com/docs/tutorials/rag/) — 官方完整教程
- [RAG 从入门到精通](https://github.com/NirDiamant/RAG_Techniques) — 各种 RAG 优化技巧合集
`,
      },
    ],
  },

  // ==================== C++ vs LangChain 对比 ====================
  {
    subTaskTitle: 'C++ vs LangChain 对比',
    milestoneId: 'python-langchain',
    lessons: [
      {
        id: 'compare-1',
        title: '面试终极话术：C++ vs Python AI 生态对比',
        duration: '30min',
        content: `# C++ vs Python：AI 开发的两条路

## 面试必答题

> "你为什么用 C++ 做 AI 应用？Python 不是更方便吗？"

这个问题几乎每个面试都会问。你需要一个**有说服力的框架**。

## 对比矩阵

| 维度 | C++ (你的选择) | Python (行业主流) |
|------|--------------|-----------------|
| **开发效率** | ⭐⭐ 低（手动内存/编译） | ⭐⭐⭐⭐⭐ 高（动态类型/丰富库） |
| **运行性能** | ⭐⭐⭐⭐⭐ 极高 | ⭐⭐ 低（GIL/解释执行） |
| **推理集成** | ⭐⭐⭐⭐⭐ 原生（ONNX/TRT） | ⭐⭐⭐⭐ 好（PyTorch/HF） |
| **网络性能** | ⭐⭐⭐⭐⭐ 极高（epoll/Reactor） | ⭐⭐⭐ 中（asyncio/uvicorn） |
| **生态丰富** | ⭐⭐ 少 | ⭐⭐⭐⭐⭐ 极其丰富 |
| **团队协作** | ⭐⭐ 门槛高 | ⭐⭐⭐⭐ 门槛低 |
| **面试价值** | ⭐⭐⭐⭐⭐ 极高（底层稀缺） | ⭐⭐⭐ 中（人人都会） |

## 标准面试回答（请背下来）

> "我选择 C++ 实现 AI 应用有三个原因：
>
> **第一，性能可控**。推理引擎（vLLM/TRT-LLM）的核心都是 C++/CUDA，用 C++ 开发能直接和推理层集成，减少跨语言调用开销。我的项目中 ONNX Runtime C++ API 推理延迟比 Python 包装器低 30%。
>
> **第二，深入理解底层**。自己实现 HTTP 状态机、连接池、Agent 循环引擎，让我对每一层的工作原理都非常清楚。面试中我能讲清楚 Reactor 模型、SSL 握手、KV Cache 的内存管理——这些是调 Python 框架的人说不出来的。
>
> **第三，我同时也了解 Python 生态**。我用 LangChain 跑过 Agent 和 RAG 的 demo，知道行业最佳实践。C++ 实现和 LangChain 在架构上是一致的：AIStrategy = LLM 抽象，AIToolRegistry = Tool，messages = Memory。区别只是实现层面。
>
> 我的定位是**能从底层设计 AI 系统的工程师**，而不只是会调框架的人。"

## 什么时候该用 Python？

1. **快速原型验证**：新想法用 Python 10 分钟跑通
2. **训练/微调**：PyTorch 生态无可替代
3. **数据处理**：pandas/numpy 效率极高
4. **团队协作**：大部分 AI 团队用 Python

## 什么时候该用 C++？

1. **推理引擎开发**：vLLM/TensorRT/ONNX Runtime 核心
2. **高性能服务**：需要极低延迟的在线推理
3. **端侧部署**：移动端/嵌入式设备
4. **展示底层能力**：面试中的差异化竞争

## ✅ 结论

> **Python 是 AI 的主流语言，C++ 是 AI 的底层语言。**
> 会 Python 是及格线，懂 C++ 底层是加分项。
> 你的独特优势：两个都会，且能讲清楚从底层到应用的完整链路。
`,
      },
    ],
  },
];
