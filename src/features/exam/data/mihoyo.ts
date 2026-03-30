import type { ExamSession } from './types';

// ===================== 米哈游 笔试 =====================
// 来源：基于26届真题风格整理的模拟题，供练习参考（游戏方向常考图形学/C++）
export const mihoyoTest1: ExamSession = {
  id: 'test1',
  name: '笔试第一场（模拟）',
  date: '2026-03-08',
  type: '笔试',
  questions: [
    {
      id: 1, type: 'choice', title: '图形学坐标系',
      content: '在 OpenGL 中，默认的坐标系统是（）',
      choices: [
        { label: 'A', text: '左手坐标系' }, { label: 'B', text: '右手坐标系' },
        { label: 'C', text: '屏幕坐标系' }, { label: 'D', text: '极坐标系' },
      ],
      answer: 'B',
    },
    {
      id: 2, type: 'choice', title: '四元数表示旋转',
      content: '使用四元数表示 3D 旋转的优势不包括（）',
      choices: [
        { label: 'A', text: '避免万向锁（Gimbal Lock）' },
        { label: 'B', text: '插值更平滑（SLERP）' },
        { label: 'C', text: '存储空间比旋转矩阵小' },
        { label: 'D', text: '可以直接表示缩放变换' },
      ],
      answer: 'D',
    },
    {
      id: 3, type: 'choice', title: 'C++ 虚函数',
      content: '关于 C++ 虚函数的描述，正确的是（）',
      choices: [
        { label: 'A', text: '构造函数可以是虚函数' },
        { label: 'B', text: '析构函数不能是虚函数' },
        { label: 'C', text: '虚函数通过虚函数表（vtable）实现多态' },
        { label: 'D', text: '虚函数不能有默认参数' },
      ],
      answer: 'C',
    },
    {
      id: 4, type: 'choice', title: '设计模式',
      content: '观察者模式（Observer Pattern）的核心思想是（）',
      choices: [
        { label: 'A', text: '封装不同的算法，使它们可以互相替换' },
        { label: 'B', text: '定义对象之间一对多的依赖，当一个对象状态改变时通知所有依赖者' },
        { label: 'C', text: '将创建过程封装在工厂类中' },
        { label: 'D', text: '保证一个类仅有一个实例' },
      ],
      answer: 'B',
    },
    {
      id: 5, type: 'choice', title: '浮点数精度',
      content: 'IEEE 754 单精度浮点数（float）的有效数字位数约为（）',
      choices: [
        { label: 'A', text: '6-7 位十进制' }, { label: 'B', text: '15-16 位十进制' },
        { label: 'C', text: '3-4 位十进制' }, { label: 'D', text: '20 位十进制' },
      ],
      answer: 'A',
    },
    {
      id: 6, type: 'coding', title: '甜甜花酿鸡', difficulty: 'Easy', tags: ['模拟', '数学'],
      content: `做一个甜甜花酿鸡需要 2 个甜甜花和 2 个禽肉。米小游现在有 a 个甜甜花和 b 个禽肉。她还可以去商店购买，甜甜花每个 p₁ 摩拉，禽肉每个 p₂ 摩拉。她有 c 摩拉，求最多能做多少个甜甜花酿鸡。`,
      inputDesc: '一行五个整数 a, b, p₁, p₂, c (0 ≤ a, b ≤ 10⁹, 1 ≤ p₁, p₂ ≤ 10⁹, 0 ≤ c ≤ 10¹⁸)。',
      outputDesc: '最多能做的甜甜花酿鸡数量。',
      examples: [
        { input: '5 3 2 3 10', output: '3', explanation: '有 5 花 3 肉。做 1 个需 2+2。做 1 个后剩 3 花 1 肉。买 1 肉花 3 摩拉。做 2 个用 4 花 2 肉，不够。可做到 3 个需 6 花 6 肉，需补 1 花(2摩拉)+3 肉(9摩拉)=11>10。做 2 个需 4 花 4 肉，补 1 肉(3摩拉)，剩 7 摩拉。还能做第 3 个需再 2 花 2 肉，还有 1 花 0 肉，买 1 花(2)+2 肉(6)=8>7。所以 2 个。' },
      ],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    long long a, b, p1, p2, c;\n    cin >> a >> b >> p1 >> p2 >> c;\n    // TODO: 二分答案\n    return 0;\n}`,
    },
    {
      id: 7, type: 'coding', title: '宝箱解锁序列', difficulty: 'Medium', tags: ['DFS', '回溯', '状压'],
      content: `有 n 个宝箱排成一排，每个宝箱有一个类型 tᵢ。连续打开相同类型的宝箱可以获得连击加成。具体来说，你可以按任意顺序打开所有宝箱，若你打开宝箱时前一个打开的宝箱类型相同，获得 1 点加成。求最大加成。`,
      inputDesc: '第一行 n (1 ≤ n ≤ 10⁵)，第二行 n 个整数 tᵢ (1 ≤ tᵢ ≤ 10⁹)。',
      outputDesc: '最大加成值。',
      examples: [{ input: '5\n1 2 1 2 1', output: '3', explanation: '按 1,1,1,2,2 顺序打开，连击=2+1=3。即同类型放一起。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    map<int,int> cnt;\n    for (int i = 0; i < n; i++) { int t; cin >> t; cnt[t]++; }\n    // TODO: 统计每种类型数量，答案 = n - 种类数\n    return 0;\n}`,
    },
    {
      id: 8, type: 'coding', title: '元素能量值', difficulty: 'Hard', tags: ['线段树', 'DFS', '倍增'],
      content: `给定一棵 n 个节点的树，每个节点有一个能量值 wᵢ。定义路径能量为路径上所有节点能量值的异或和。给定 q 次查询，每次查询 (u, v) 路径上的能量值。`,
      inputDesc: 'n, q (1 ≤ n, q ≤ 2×10⁵)，n 个 wᵢ，n-1 条边，q 次查询。',
      outputDesc: '每次查询输出路径异或和。',
      examples: [{ input: '5 3\n1 2 3 4 5\n1 2\n1 3\n2 4\n2 5\n1 4\n3 5\n4 5', output: '7\n4\n3' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n, q; cin >> n >> q;\n    vector<int> w(n+1);\n    for (int i=1;i<=n;i++) cin >> w[i];\n    vector<vector<int>> adj(n+1);\n    for (int i=0;i<n-1;i++) {\n        int u,v; cin >> u >> v;\n        adj[u].push_back(v); adj[v].push_back(u);\n    }\n    // TODO: LCA + 前缀异或\n    while (q--) { int u,v; cin >> u >> v; /* TODO */ }\n    return 0;\n}`,
    },
  ],
};
