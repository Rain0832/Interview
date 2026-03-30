import type { ExamSession } from './types';

// ===================== 拼多多 笔试 =====================
// 来源：基于26届真题风格整理的模拟题，供练习参考
export const pddTest1: ExamSession = {
  id: 'test1',
  name: '笔试第一场（模拟）',
  date: '2026-03-08',
  type: '笔试',
  questions: [
    {
      id: 1, type: 'choice', title: '虚拟内存',
      content: '以下关于虚拟内存的描述，错误的是（）',
      choices: [
        { label: 'A', text: '虚拟内存使得每个进程拥有独立的地址空间' },
        { label: 'B', text: '虚拟内存的大小受物理内存大小的限制' },
        { label: 'C', text: '页面置换算法用于决定换出哪个页面' },
        { label: 'D', text: '缺页中断会导致进程从用户态切换到内核态' },
      ],
      answer: 'B',
      note: '虚拟内存大小受 CPU 地址位数限制，不受物理内存限制。',
    },
    {
      id: 2, type: 'choice', title: '死锁条件',
      content: '以下哪项不是产生死锁的四个必要条件之一？',
      choices: [
        { label: 'A', text: '互斥条件' }, { label: 'B', text: '请求与保持条件' },
        { label: 'C', text: '不可抢占条件' }, { label: 'D', text: '优先级反转条件' },
      ],
      answer: 'D',
      note: '四个必要条件：互斥、请求与保持、不可抢占、循环等待。优先级反转不是。',
    },
    {
      id: 3, type: 'choice', title: '二叉搜索树',
      content: '在一棵有 n 个节点的二叉搜索树中查找一个元素，最坏情况下的时间复杂度为（）',
      choices: [
        { label: 'A', text: 'O(1)' }, { label: 'B', text: 'O(logn)' },
        { label: 'C', text: 'O(n)' }, { label: 'D', text: 'O(nlogn)' },
      ],
      answer: 'C',
    },
    {
      id: 4, type: 'choice', title: 'HTTPS 加密',
      content: 'HTTPS 在建立连接时使用的加密方式是（）',
      choices: [
        { label: 'A', text: '仅使用对称加密' },
        { label: 'B', text: '仅使用非对称加密' },
        { label: 'C', text: '先用非对称加密协商对称密钥，之后用对称加密传输数据' },
        { label: 'D', text: '先用对称加密协商非对称密钥' },
      ],
      answer: 'C',
    },
    {
      id: 5, type: 'coding', title: '商品打折方案', difficulty: 'Medium', tags: ['DP', '背包'],
      content: `商城有 n 件商品，价格为 pᵢ。现有 k 张满减券，第 j 张券满 mⱼ 减 dⱼ（一张券只能用一次，一件商品最多用一张券）。选若干件商品购买（可以都不买），使得 总价-总优惠 最大化幸福感（幸福感 = 买到的商品数量），求在总花费不超过预算 B 的前提下最多能买多少件商品。`,
      inputDesc: 'n, k, B (1 ≤ n ≤ 100, 0 ≤ k ≤ 50, 1 ≤ B ≤ 10⁶)；n 个价格；k 行满减规则。',
      outputDesc: '最多购买商品数量。',
      examples: [{ input: '3 1 10\n5 8 3\n6 2', output: '3', explanation: '商品价格 5+8+3=16, 第二件满 6 减 2, 实际 5+6+3=14>10。选第1和第3件=8≤10, 答案=2。如果用券对第二件=6, 选第2和第3件=6+3=9≤10, 答案=2。或 5+3=8, 答案=2。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n, k; long long B;\n    cin >> n >> k >> B;\n    vector<long long> p(n);\n    for (int i = 0; i < n; i++) cin >> p[i];\n    // TODO: 背包 DP\n    return 0;\n}`,
    },
    {
      id: 6, type: 'coding', title: '字符串分割', difficulty: 'Medium', tags: ['DP', '字符串'],
      content: `给定一个字符串 s 和一个字典 dict（包含若干单词），判断 s 是否可以被拆分为一个或多个在字典中出现的单词。输出 "Yes" 或 "No"。`,
      inputDesc: '第一行字符串 s (|s| ≤ 10⁴)；第二行整数 n；接下来 n 行每行一个字典单词。',
      outputDesc: 'Yes 或 No。',
      examples: [{ input: 'leetcode\n2\nleet\ncode', output: 'Yes' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    string s; cin >> s;\n    int n; cin >> n;\n    set<string> dict;\n    for (int i = 0; i < n; i++) { string w; cin >> w; dict.insert(w); }\n    // TODO: DP 分词\n    return 0;\n}`,
    },
    {
      id: 7, type: 'coding', title: '二维数组最大路径和', difficulty: 'Medium', tags: ['DP'],
      content: `给定 n×m 矩阵，每个格子有一个整数值。从左上角走到右下角，每步只能向右或向下，求路径上所有数之和的最大值。`,
      inputDesc: 'n, m (1 ≤ n, m ≤ 1000)，n 行每行 m 个整数 (-10⁹ ≤ aᵢⱼ ≤ 10⁹)。',
      outputDesc: '最大路径和。',
      examples: [{ input: '3 3\n1 3 1\n1 5 1\n4 2 1', output: '12', explanation: '1→3→5→2→1=12。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n, m; cin >> n >> m;\n    vector<vector<long long>> a(n, vector<long long>(m));\n    for (int i=0;i<n;i++) for(int j=0;j<m;j++) cin >> a[i][j];\n    // TODO: DP\n    return 0;\n}`,
    },
  ],
};
