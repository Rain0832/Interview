import type { ExamSession } from './types';

// ===================== 蚂蚁集团 笔试 =====================
// 来源：基于26届真题风格整理的模拟题，供练习参考（27届笔试预计3月下旬）
export const antTest1: ExamSession = {
  id: 'test1',
  name: '笔试第一场（模拟）',
  date: '2026-03-22',
  type: '笔试',
  questions: [
    {
      id: 1, type: 'choice', title: 'B+ 树索引',
      content: '关于 MySQL 中 B+ 树索引的描述，错误的是（）',
      choices: [
        { label: 'A', text: '所有数据都存储在叶子节点' },
        { label: 'B', text: '叶子节点之间通过链表连接，支持范围查询' },
        { label: 'C', text: '非叶子节点存储数据和指针' },
        { label: 'D', text: '查找效率为 O(logN)' },
      ],
      answer: 'C',
      note: 'B+ 树非叶子节点只存储键和指针，不存储数据。数据全部在叶子节点。',
    },
    {
      id: 2, type: 'choice', title: '事务隔离级别',
      content: '以下哪个事务隔离级别可以避免脏读但不能避免不可重复读？',
      choices: [
        { label: 'A', text: 'READ UNCOMMITTED' },
        { label: 'B', text: 'READ COMMITTED' },
        { label: 'C', text: 'REPEATABLE READ' },
        { label: 'D', text: 'SERIALIZABLE' },
      ],
      answer: 'B',
    },
    {
      id: 3, type: 'choice', title: '分布式 CAP 定理',
      content: '根据 CAP 定理，分布式系统不可能同时满足的三个性质是（）',
      choices: [
        { label: 'A', text: '一致性、可用性、容错性' },
        { label: 'B', text: '一致性、可用性、分区容错性' },
        { label: 'C', text: '一致性、并发性、分区容错性' },
        { label: 'D', text: '可用性、并发性、容错性' },
      ],
      answer: 'B',
    },
    {
      id: 4, type: 'choice', title: 'Redis 数据结构',
      content: '以下哪个不是 Redis 的基本数据类型？',
      choices: [
        { label: 'A', text: 'String' }, { label: 'B', text: 'Hash' },
        { label: 'C', text: 'Tree' }, { label: 'D', text: 'Sorted Set' },
      ],
      answer: 'C',
    },
    {
      id: 5, type: 'choice', title: '哈希冲突解决',
      content: 'Java 的 HashMap 在哈希冲突时，JDK 8 采用的策略是（）',
      choices: [
        { label: 'A', text: '只用链表' },
        { label: 'B', text: '链表长度超过阈值后转为红黑树' },
        { label: 'C', text: '开放定址法' },
        { label: 'D', text: '再哈希法' },
      ],
      answer: 'B',
    },
    {
      id: 6, type: 'coding', title: '树上曼哈顿距离', difficulty: 'Medium', tags: ['树', 'DFS', '排序'],
      content: `给定一棵 n 个节点的树（根为 1），每个节点有坐标 (xᵢ, yᵢ)。对每个节点 u，求其子树中所有节点对之间曼哈顿距离之和。
曼哈顿距离 d(u,v) = |xᵤ - xᵥ| + |yᵤ - yᵥ|。`,
      inputDesc: '第一行 n (1 ≤ n ≤ 10⁵)，接下来 n 行每行 xᵢ, yᵢ，再接下来 n-1 行描述边。',
      outputDesc: '输出 n 行，第 i 行为节点 i 的子树中所有节点对曼哈顿距离之和。',
      examples: [{ input: '3\n0 0\n1 2\n3 1\n1 2\n1 3', output: '6\n0\n0', explanation: '根节点子树包含所有节点，|0-1|+|0-2| + |0-3|+|0-1| + |1-3|+|2-1| = 3+4+3 = 不对，实际求的是所有节点对的曼哈顿距离之和。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    vector<int> x(n+1), y(n+1);\n    for (int i=1;i<=n;i++) cin >> x[i] >> y[i];\n    vector<vector<int>> adj(n+1);\n    for (int i=0;i<n-1;i++) {\n        int u, v; cin >> u >> v;\n        adj[u].push_back(v); adj[v].push_back(u);\n    }\n    // TODO: DFS + 排序计算贡献\n    return 0;\n}`,
    },
    {
      id: 7, type: 'coding', title: '最小操作代价', difficulty: 'Hard', tags: ['DP', '贪心'],
      content: `给定长度为 n 的数组 a，每次操作可以选择一个元素加 1 或减 1，代价为 1。求使数组严格递增的最小总代价。`,
      inputDesc: '第一行 n (1 ≤ n ≤ 2×10⁵)，第二行 n 个整数 aᵢ (|aᵢ| ≤ 10⁹)。',
      outputDesc: '最小总代价。',
      examples: [{ input: '3\n3 1 2', output: '2', explanation: '改为 [1,2,3] 或 [0,1,2] 等，代价都是 2+0+0=2（如改 a[1]=1→不变，a[0]=3→1）。一种最优方案：[0,1,2]，代价 3+0+0=3。再想想：[2,3,4] 代价 1+2+2=5。[1,2,3] 代价 2+1+1=4。实际答案见样例。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    vector<long long> a(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    // TODO: 经典严格递增最小代价 DP\n    // 提示：a[i] -= i 转为非递减问题，用中位数贪心\n    return 0;\n}`,
    },
  ],
};
