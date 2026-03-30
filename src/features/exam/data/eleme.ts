import type { ExamSession } from './types';

// ===================== 饿了么 笔试第一场 =====================
// 来源：基于26届真题风格整理的模拟题，供练习参考（27届笔试预计3月下旬）
export const elemeTest1: ExamSession = {
  id: 'test1',
  name: '笔试第一场（模拟）',
  date: '2026-03-21',
  type: '笔试',
  questions: [
    {
      id: 1, type: 'choice', title: 'HTTP 状态码',
      content: '以下哪个 HTTP 状态码表示"资源未找到"？',
      choices: [
        { label: 'A', text: '200' }, { label: 'B', text: '301' },
        { label: 'C', text: '404' }, { label: 'D', text: '500' },
      ],
      answer: 'C',
    },
    {
      id: 2, type: 'choice', title: '进程与线程',
      content: '以下关于进程和线程的描述，正确的是（）',
      choices: [
        { label: 'A', text: '线程是资源分配的基本单位' },
        { label: 'B', text: '同一进程内的线程共享进程的地址空间' },
        { label: 'C', text: '不同进程内的线程可以直接通信' },
        { label: 'D', text: '线程切换一定比进程切换慢' },
      ],
      answer: 'B',
    },
    {
      id: 3, type: 'choice', title: 'SQL 聚合函数',
      content: '在 SQL 中，若要统计某字段非 NULL 值的数量，应使用哪个函数？',
      choices: [
        { label: 'A', text: 'SUM()' }, { label: 'B', text: 'COUNT(*)' },
        { label: 'C', text: 'COUNT(column)' }, { label: 'D', text: 'AVG()' },
      ],
      answer: 'C',
      note: 'COUNT(*) 统计所有行（含 NULL），COUNT(column) 只统计非 NULL 值。',
    },
    {
      id: 4, type: 'choice', title: '排序算法稳定性',
      content: '以下排序算法中，哪些是稳定的？',
      choices: [
        { label: 'A', text: '快速排序和归并排序' },
        { label: 'B', text: '归并排序和插入排序' },
        { label: 'C', text: '堆排序和冒泡排序' },
        { label: 'D', text: '选择排序和基数排序' },
      ],
      answer: 'B',
    },
    {
      id: 5, type: 'choice', title: 'TCP 三次握手',
      content: 'TCP 建立连接的三次握手过程中，第二次握手报文的标志位是？',
      choices: [
        { label: 'A', text: 'SYN' }, { label: 'B', text: 'SYN+ACK' },
        { label: 'C', text: 'ACK' }, { label: 'D', text: 'FIN+ACK' },
      ],
      answer: 'B',
    },
    {
      id: 6, type: 'coding', title: '外卖配送路径', difficulty: 'Easy', tags: ['BFS', '图论'],
      content: `给定一个 n×m 的网格地图，0 表示可通行，1 表示障碍物。骑手从左上角 (0,0) 出发，只能上下左右移动，求到达右下角 (n-1,m-1) 的最短步数。若无法到达输出 -1。`,
      inputDesc: '第一行 n, m (1 ≤ n, m ≤ 1000)，接下来 n 行每行 m 个 0/1。',
      outputDesc: '输出最短步数或 -1。',
      examples: [
        { input: '3 3\n0 0 0\n0 1 0\n0 0 0', output: '4' },
        { input: '2 2\n0 1\n1 0', output: '-1' },
      ],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n, m; cin >> n >> m;\n    vector<vector<int>> grid(n, vector<int>(m));\n    for (int i = 0; i < n; i++)\n        for (int j = 0; j < m; j++) cin >> grid[i][j];\n    // TODO: BFS 求最短路径\n    return 0;\n}`,
    },
    {
      id: 7, type: 'coding', title: '订单合并', difficulty: 'Medium', tags: ['排序', '贪心', '区间合并'],
      content: `饿了么配送系统中有 n 个订单，每个订单有配送时间窗口 [sᵢ, eᵢ]。若两个订单时间窗口有交集，可以合并为一次配送。问最终至少需要几次独立配送？`,
      inputDesc: '第一行 n (1 ≤ n ≤ 10⁵)，接下来 n 行每行两个整数 s, e (0 ≤ s < e ≤ 10⁹)。',
      outputDesc: '最少配送次数。',
      examples: [{ input: '4\n1 3\n2 5\n6 8\n7 10', output: '2', explanation: '[1,3] 和 [2,5] 合并，[6,8] 和 [7,10] 合并。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n; cin >> n;\n    vector<pair<int,int>> intervals(n);\n    for (int i = 0; i < n; i++) cin >> intervals[i].first >> intervals[i].second;\n    // TODO: 排序 + 区间合并\n    return 0;\n}`,
    },
    {
      id: 8, type: 'coding', title: '优惠券最优使用', difficulty: 'Medium', tags: ['DP', '贪心', '排序'],
      content: `小明有 n 张优惠券，每张优惠券有满减门槛 tᵢ 和优惠金额 dᵢ（订单金额 ≥ tᵢ 时可抵扣 dᵢ 元）。现在有一个金额为 P 的订单，最多使用一张优惠券，求最少需支付的金额。`,
      inputDesc: '第一行 n, P (1 ≤ n ≤ 10⁵, 1 ≤ P ≤ 10⁹)。接下来 n 行每行 tᵢ, dᵢ。',
      outputDesc: '最少支付金额。',
      examples: [{ input: '3 100\n50 10\n80 25\n120 30', output: '75', explanation: '使用第二张券，100-25=75。第三张门槛 120 > 100 不可用。' }],
      timeLimit: 'C/C++ 1秒', memoryLimit: 'C/C++ 256MB',
      codeTemplate: `#include <bits/stdc++.h>\nusing namespace std;\nint main() {\n    int n; long long P; cin >> n >> P;\n    long long ans = P;\n    for (int i = 0; i < n; i++) {\n        long long t, d; cin >> t >> d;\n        // TODO: 检查是否可用并更新最优\n    }\n    cout << ans << endl;\n    return 0;\n}`,
    },
  ],
};
