import type { ExamSession } from './types';

// ===================== 美团 笔试第一场 =====================
// 来源：27届（2027届毕业 / 2026暑期实习）笔试真题回忆
export const meituanTest1: ExamSession = {
  id: 'test1',
  name: '笔试第一场',
  date: '2026-03-07',
  type: '笔试',
  questions: [
    {
      id: 1, type: 'choice', title: '工具调用参数校验',
      content: '工具调用里经常出现"参数缺字段/类型不对"，更常见的处理是（）',
      choices: [
        { label: 'A', text: '把 temperature 调高，让模型更敢补全参数字段' },
        { label: 'B', text: '收紧 schema 并做校验，失败则重试或回退' },
        { label: 'C', text: '把 history 拼得更长，让模型看到更多上下文' },
        { label: 'D', text: '减少工具数量，让模型每次只会调用一个工具' },
      ],
      answer: 'B',
    },
    {
      id: 2, type: 'choice', title: '推理稳定性熔断/降级',
      content: '推理稳定性里"熔断/降级"更常见的含义是（）',
      choices: [
        { label: 'A', text: '输出慢时调高 temperature，让模型更快输出' },
        { label: 'B', text: '高延迟或异常时切到小模型或模板答案，保证可用性' },
        { label: 'C', text: '把 top_p 调到 1，让输出固定减少波动' },
        { label: 'D', text: '把 prompt 变短，让模型永远不会超上下文窗口' },
      ],
      answer: 'B',
    },
    {
      id: 3, type: 'choice', title: 'LoRA 微调方言退化',
      content: 'LoRA 微调后，模型对少数方言理解下降，但普通话不受影响。更合适的补救是（）',
      choices: [
        { label: 'A', text: '把 tokenizer 词表扩很大，方言自然会被覆盖并能理解' },
        { label: 'B', text: '把方言样本集中到最后几轮训练，强行让模型记住方言' },
        { label: 'C', text: '混合采样维持方言占比，并小步继续微调防止被淹没' },
        { label: 'D', text: '把 temperature 调高一点，让模型更敢输出方言相关内容' },
      ],
      answer: 'C',
    },
    {
      id: 4, type: 'choice', title: 'CLIP 图文对齐',
      content: '做 CLIP 式图文对齐预训练，"文本搜图"很差，但单模态看起来正常。更可疑的问题是（）',
      choices: [
        { label: 'A', text: '图像切 patch 的方式不对，应该改成整图 CNN 才能对齐' },
        { label: 'B', text: '正负样本对构造错配或噪声高，导致对比学习目标失效' },
        { label: 'C', text: '文本不该分词，按字符输入才能学到更稳定的对齐表示' },
        { label: 'D', text: 'embedding 维度偏小，翻倍后跨模态检索一定会明显提升' },
      ],
      answer: 'B',
    },
    {
      id: 5, type: 'choice', title: 'Temperature 参数',
      content: '你正在设计一个基于大语言模型的 AI 代码助手。在生成代码时，为了让模型输出既有创造性又不过于离谱，你需要调整一个关键参数来控制生成结果的随机性。这个参数通常被称为？',
      choices: [
        { label: 'A', text: '上下文窗口（Context Window）' },
        { label: 'B', text: '温度（Temperature）' },
        { label: 'C', text: '批处理大小（Batch Size）' },
        { label: 'D', text: '学习率（Learning Rate）' },
      ],
      answer: 'B',
    },
    {
      id: 6, type: 'choice', title: 'TCP 有序传输',
      content: '在传输层中，TCP 协议提供了保证数据有序传输的机制。请问该机制的实现依赖于哪个特性？',
      choices: [
        { label: 'A', text: 'TCP 报文段中的序列号（Sequence Number）' },
        { label: 'B', text: 'TCP 报文段中的时间戳（Timestamp option）' },
        { label: 'C', text: 'TCP 报文段中的校验和（Checksum）' },
        { label: 'D', text: 'IP 报文头中的源地址和目的地址' },
      ],
      answer: 'A',
    },
    {
      id: 7, type: 'choice', title: '递推时间复杂度',
      content: '物流公司开发智能分拣系统时，某路径规划算法在计算 n 个配送点优化路线时，每增加一个配送点需处理四维空间数据。算法耗时模型为：T(n) = T(n - 1) + 5n⁴ (当 n > 1 时)，T(1) = O(1)。该算法处理 n 个配送点的整体时间复杂度为（）',
      choices: [
        { label: 'A', text: 'O(n⁵)' },
        { label: 'B', text: 'O(n⁴)' },
        { label: 'C', text: 'O(n⁴logn)' },
        { label: 'D', text: 'O(n³)' },
      ],
      answer: 'A',
    },
    {
      id: 8, type: 'choice', title: '信号量 sem_wait',
      content: '线程 T1 调用 sem_wait(&S) 后阻塞（初始值为 0），此时信号量 S 的值为？',
      choices: [
        { label: 'A', text: '0' },
        { label: 'B', text: '-1' },
        { label: 'C', text: '1' },
        { label: 'D', text: '取决于初始值' },
      ],
      answer: 'B',
    },
    {
      id: 9, type: 'choice', title: '因果语言建模（CLM）',
      content: '关于因果语言建模（CLM）的描述，正确的是（）',
      choices: [
        { label: 'A', text: 'GPT 系列模型采用从左到右的单向注意力（因果掩码）' },
        { label: 'B', text: '损失函数仅计算序列最后一个 token 的预测' },
        { label: 'C', text: 'CLM 训练时必须使用采样生成的 token 作为下一步输入' },
        { label: 'D', text: 'CLM 原生只能用于分类任务，不能用于生成任务' },
      ],
      answer: 'A',
    },
    {
      id: 10, type: 'choice', title: '二叉树遍历推断',
      content: '若一棵二叉树的前序遍历序列为 b, c, a, e, f, d，后序遍历序列为 a, f, d, e, c, b，则根结点的孩子结点（）',
      choices: [
        { label: 'A', text: '只有 c' },
        { label: 'B', text: '有 e、d' },
        { label: 'C', text: '有 c、e' },
        { label: 'D', text: '无法确定' },
      ],
      answer: 'A',
    },
    {
      id: 11, type: 'coding', title: '无限循环', difficulty: 'Medium', tags: ['LIS', '贪心', '去重'],
      content: `小美有一个长度为 n 的数组 {a₁, a₂, …, aₙ}，她将与初始数组完全相同的数组连续拼接到其末尾，共拼接 10⁹ 次。设拼接完成后的新数组记为 a'，则新数组的长度为 n × (10⁹ + 1)，并且对于任意的 n < i ≤ n × (10⁹ + 1)，都有 a'[i] = a'[i - n]。

请你计算新数组 a' 的最长严格递增子序列的长度，并输出这个长度。

**名词解释：**
- **子序列**：从原序列中删除任意个（可以为零、可以为全部）元素后按原相对顺序得到的新序列。
- **严格递增子序列**：子序列中相邻元素的值严格递增。`,
      inputDesc: `每个测试文件均包含多组测试数据。第一行输入一个整数 T (1 ≤ T ≤ 10⁴) 代表数据组数：
- 第一行输入一个整数 n (1 ≤ n ≤ 2×10⁵)；
- 第二行输入 n 个整数 a₁…aₙ (1 ≤ aᵢ ≤ n)。
保证 n 之和不超过 2×10⁵。`,
      outputDesc: '对于每一组测试数据，输出最长严格递增子序列长度。',
      examples: [{ input: '2\n4\n1 1 2 3\n5\n4 5 3 3 4', output: '3\n3', explanation: '第 1 组最终 LIS 为 {1, 2, 3}。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int T; cin >> T;\n    while (T--) {\n        int n; cin >> n;\n        vector<int> a(n);\n        for (int i = 0; i < n; i++) cin >> a[i];\n\n        // TODO: 在此处实现你的解法\n\n    }\n    return 0;\n}`,
    },
    {
      id: 12, type: 'coding', title: '交换括号', difficulty: 'Medium', tags: ['贪心', '栈'],
      content: `我们称一个括号序列为"平衡的括号序列"，当且仅当满足以下归纳定义：
1. 空串是平衡的；
2. 若字符串 A 是平衡的，则 "(A)" 是平衡的；
3. 若字符串 A 与 B 均是平衡的，则 "AB" 是平衡的。

给定一个偶数长度的括号序列 s（仅包含 '(' 与 ')'），可以进行若干次相邻交换操作。求最少需要多少次相邻交换使其变为平衡序列。`,
      inputDesc: `多组测试数据。T (1 ≤ T ≤ 10⁵)；每组：偶数 n (2 ≤ n ≤ 2×10⁵)，字符串 s。
保证 n 总和不超过 2×10⁵，保证有解。`,
      outputDesc: '每组输出最少相邻交换次数。',
      examples: [{ input: '3\n2\n)(\n4\n()()\n4\n))((' , output: '1\n0\n3' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int T; cin >> T;\n    while (T--) {\n        int n; cin >> n;\n        string s; cin >> s;\n\n        // TODO: 在此处实现你的解法\n\n    }\n    return 0;\n}`,
    },
    {
      id: 13, type: 'coding', title: '小美的 01 树', difficulty: 'Hard', tags: ['树链剖分', '线段树', '取模'],
      content: `小美有一棵节点编号为 1~n 的树，每个节点值为 0 或 1。
g(u→v) 为路径上 01 字符串对应的十进制数对 (10⁹+7) 取模。
操作 1：路径反置；操作 2：查询 g(u→v)。`,
      inputDesc: `n, m (1 ≤ n, m ≤ 2×10⁵)，n 个 0/1 值，n-1 条边，m 次操作。`,
      outputDesc: '对每个操作 2 输出结果。',
      examples: [{ input: '5 5\n0 0 0 0 0\n1 2\n1 3\n2 4\n2 5\n2 1 4\n1 1 3\n2 4 1\n1 2 5\n2 5 1', output: '0\n1\n7' }],
      timeLimit: 'C/C++ 3秒', memoryLimit: 'C/C++ 512MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nconst int MOD = 1e9 + 7;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    int n, m; cin >> n >> m;\n    vector<int> a(n + 1);\n    for (int i = 1; i <= n; i++) cin >> a[i];\n    vector<vector<int>> adj(n + 1);\n    for (int i = 0; i < n - 1; i++) {\n        int u, v; cin >> u >> v;\n        adj[u].push_back(v); adj[v].push_back(u);\n    }\n    while (m--) {\n        int x, u, v; cin >> x >> u >> v;\n        if (x == 1) {\n            // TODO: 路径反置\n        } else {\n            // TODO: 路径查询\n        }\n    }\n    return 0;\n}`,
    },
  ],
};

// ===================== 美团 笔试第二场 =====================
// 来源：27届（2027届毕业 / 2026暑期实习）笔试真题回忆
export const meituanTest2: ExamSession = {
  id: 'test2',
  name: '笔试第二场',
  date: '2026-03-14',
  type: '笔试',
  questions: [
    {
      id: 1, type: 'choice', title: 'SFT 角色标记与 Loss Mask',
      content: 'SFT 时没做 role 标记与 loss mask，把多轮对话整段算 loss，结果模型上线后经常"复读用户的话"。更可能原因是（）',
      choices: [
        { label: 'A', text: '训练轮数偏少，模型还没学会区分 user 和 assistant 角色' },
        { label: 'B', text: '缺少角色边界与 mask，模型学到复述整段文本的模式' },
        { label: 'C', text: 'tokenizer 特殊符号不够，导致对话分隔符无法被正确识别' },
        { label: 'D', text: '学习率偏高导致过拟合，从而复读输入来降低训练 loss' },
      ],
      answer: 'B',
    },
    {
      id: 2, type: 'choice', title: '长依赖问答策略调整',
      content: '希望模型更擅长跨段落长依赖问答，但不改训练数据，只做结构/策略侧调整。更合理的方向是（）',
      choices: [
        { label: 'A', text: '把 FFN 宽度加大，模型容量提升后长依赖自然就会更强' },
        { label: 'B', text: '把词表扩到 50 万，长文里出现的名词就更不容易丢失' },
        { label: 'C', text: '关闭 dropout 以增强记忆能力，长距离信息保留会更好' },
        { label: 'D', text: '使用更适合外推的位置方案并配合长上下文训练/稀疏化' },
      ],
      answer: 'D',
    },
    {
      id: 3, type: 'choice', title: '稀疏注意力（Sparse Attention）',
      content: '下面关于稀疏注意力（Sparse Attention）的说法，错误的是（）',
      choices: [
        { label: 'A', text: '稀疏注意力通过限制注意力连接模式来降低计算与显存开销' },
        { label: 'B', text: 'Longformer 的局部窗口注意力可以在单层内直接建模任意两位置的全局依赖' },
        { label: 'C', text: 'BigBird 的随机注意力用于提升注意力图连通性并增强信息传播能力' },
        { label: 'D', text: '稀疏注意力可能需要多层传播信息，从而削弱长距离依赖的直接建模' },
      ],
      answer: 'B',
    },
    {
      id: 4, type: 'choice', title: '预训练目标',
      content: '下面关于大模型预训练目标的说法错误的是（）',
      choices: [
        { label: 'A', text: 'BERT 使用的掩码语言模型（MLM）会将一部分 token 随机替换为 [MASK]' },
        { label: 'B', text: 'GPT 使用自回归目标，预测当前 token 的前一个 token' },
        { label: 'C', text: 'T5 通过统一编码器-解码器结构处理文本到文本的转换任务' },
        { label: 'D', text: '对比学习在多模态预训练中被用来增强跨模态表示能力' },
      ],
      answer: 'B',
    },
    {
      id: 5, type: 'choice', title: '机器翻译评估指标',
      content: '在机器翻译的自动评估中，最早且应用最广泛的 n-gram 重叠指标是（）',
      choices: [
        { label: 'A', text: 'ROUGE-L' }, { label: 'B', text: 'BLEU 分数' },
        { label: 'C', text: 'METEOR' }, { label: 'D', text: 'CIDEr' },
      ],
      answer: 'B',
    },
    {
      id: 6, type: 'choice', title: '数据并行',
      content: '数据并行（Data Parallelism）的核心思想是（）',
      choices: [
        { label: 'A', text: '将模型参数拆分到多设备' },
        { label: 'B', text: '同一批次数据分片到不同设备并行计算' },
        { label: 'C', text: '不同设备处理不同层计算' },
        { label: 'D', text: '仅反向传播阶段并行化' },
      ],
      answer: 'B',
    },
    {
      id: 7, type: 'choice', title: '传输层不可靠传输',
      content: '在计算机网络中，传输层的不可靠传输方法是下面哪个（）',
      choices: [
        { label: 'A', text: 'UDP 协议' }, { label: 'B', text: 'TCP 协议' },
        { label: 'C', text: 'IP 协议' }, { label: 'D', text: 'FTP 协议' },
      ],
      answer: 'A',
    },
    {
      id: 8, type: 'choice', title: '线程与进程',
      content: '下面关于线程的叙述中，正确的是（）',
      choices: [
        { label: 'A', text: '一个程序至少有一个进程，一个进程可以没有线程' },
        { label: 'B', text: '不论是内核级线程还是用户级线程，其切换都需要内核的支持' },
        { label: 'C', text: '不管系统中是否有线程，进程都是拥有资源的独立单位' },
        { label: 'D', text: '在引入线程的系统中，线程是资源分配的基本单位' },
      ],
      answer: 'C',
    },
    {
      id: 9, type: 'choice', title: '哈夫曼树非叶节点',
      content: '设有一棵哈夫曼树，其度为 4，叶子节点个数为 50，则非叶节点个数为（）。',
      choices: [
        { label: 'A', text: '49' }, { label: 'B', text: '12' },
        { label: 'C', text: '17' }, { label: 'D', text: '16' },
      ],
      answer: 'C',
      note: '度为 m 的哈夫曼树需补虚节点至 (n₀-1)%(m-1)==0。(50-1)%3=1，补 2 个至 52，nₘ=51/3=17。',
    },
    {
      id: 10, type: 'choice', title: 'Master 定理时间复杂度',
      content: '给定 T(n) = 8T(n/2) + 2n³ + 3n² (n>1), T(n)=0 (n≤1)。该算法时间复杂度为（）',
      choices: [
        { label: 'A', text: 'O(n³)' }, { label: 'B', text: 'O(n³logn)' },
        { label: 'C', text: 'O(n⁴)' }, { label: 'D', text: 'O(n⁴logn)' },
      ],
      answer: 'B',
      note: '原题 A/B 选项格式丢失已补全。Master 定理：a=8,b=2,log₂8=3=d, Case 2。',
    },
    {
      id: 11, type: 'coding', title: '小美的因子数量', difficulty: 'Easy', tags: ['数学', '完全平方数'],
      content: `小美很喜欢因子数量为奇数的数。给定区间 [l, r]，求区间内有多少个因子数量为奇数的数。
提示：因子数量为奇数的数恰好是完全平方数。`,
      inputDesc: '两个整数 l, r (1 ≤ l ≤ r ≤ 10⁹)。',
      outputDesc: '因子数量为奇数的数的个数。',
      examples: [
        { input: '1 1', output: '1', explanation: '1 的因子只有自身。' },
        { input: '4 5', output: '1', explanation: '只有 4 是完全平方数。' },
      ],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    long long l, r;\n    cin >> l >> r;\n    // TODO: 在此处实现你的解法\n    return 0;\n}`,
    },
    {
      id: 12, type: 'coding', title: '超级斐波那契数列', difficulty: 'Medium', tags: ['递推', '前缀和', '取模'],
      content: `定义超级斐波那契数列：前 k 项均为 1，n>k 时 S(n) = S(n-1) + S(n-2) + ⋯ + S(n-k)。
给定 k 和 q 次查询，每次查询第 x 项对 10⁹+7 取模后的值。`,
      inputDesc: 'k, q (1 ≤ k ≤ 10⁶; 1 ≤ q ≤ 3×10⁵)，q 行每行一个 x (1 ≤ x ≤ 10⁶)。',
      outputDesc: '每次查询输出 S(x) mod (10⁹+7)。',
      examples: [{ input: '2 5\n1\n2\n3\n4\n5', output: '1\n1\n2\n3\n5' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nconst int MOD = 1e9 + 7;\nint main() {\n    int k, q; cin >> k >> q;\n    // TODO: 预处理 + 查询\n    while (q--) { int x; cin >> x; /* TODO */ }\n    return 0;\n}`,
    },
    {
      id: 13, type: 'coding', title: '最大节点权值', difficulty: 'Hard', tags: ['离线', '并查集', '图论'],
      content: `n 个节点 m 条边的无向图，节点权值 = 当前度 + 编号。q 次操作：断边或查询连通块最大权值。`,
      inputDesc: 'n, m, q (1 ≤ n,q ≤ 2×10⁵; 0 ≤ m ≤ min(n(n-1)/2, 2×10⁵))。m 条边，q 次操作。',
      outputDesc: '对每个查询操作输出连通块最大权值。',
      examples: [{ input: '5 5 5\n1 2\n1 5\n3 5\n2 4\n1 3\n2 4\n1 1\n2 2\n1 2\n2 1', output: '7\n5\n6' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n, m, q; cin >> n >> m >> q;\n    vector<pair<int,int>> edges(m+1);\n    for (int i=1;i<=m;i++) cin >> edges[i].first >> edges[i].second;\n    vector<pair<int,int>> ops(q);\n    for (int i=0;i<q;i++) cin >> ops[i].first >> ops[i].second;\n    // TODO: 离线 + 反向加边 + 并查集\n    return 0;\n}`,
    },
  ],
};
