// ==================== 面试题类型定义 ====================

/** 面试题分类 */
export type InterviewCategory =
  | '操作系统'
  | '计算机网络'
  | '数据结构与算法'
  | 'Java'
  | 'C++'
  | 'Go'
  | 'Python'
  | 'Redis'
  | 'MySQL'
  | 'Elasticsearch'
  | '分布式系统'
  | '系统设计'
  | '场景题'
  | '开放问题'
  | 'AI/大模型'
  | '手撕算法'
  | '项目拷打'
  | '其他';

/** 面试题难度 */
export type InterviewDifficulty = '基础' | '进阶' | '高难';

/** 单道面试题 */
export interface InterviewQuestion {
  id: string;                        // 唯一ID，用于去重
  title: string;                     // 题目标题
  content: string;                   // 题目详细内容
  category: InterviewCategory;       // 分类
  difficulty: InterviewDifficulty;   // 难度
  referenceAnswer?: string;          // 参考答案
  tags?: string[];                   // 补充标签
  source?: string;                   // 来源（牛客/小红书等）
  frequency?: 'low' | 'medium' | 'high'; // 出现频率
}

/** 面试场次（一次面试经历） */
export interface InterviewSession {
  id: string;
  round: string;                     // 面试轮次：一面/二面/HR面
  date?: string;
  duration?: string;                 // 时长
  style?: string;                    // 面试风格描述
  questions: InterviewQuestion[];
}

/** 部门面经 */
export interface DepartmentInterview {
  id: string;
  department: string;                // 部门名
  description?: string;              // 部门介绍
  interviewStyle?: string;           // 面试特点总结
  tips?: string[];                   // 面试建议
  sessions: InterviewSession[];
}

/** 公司面经汇总 */
export interface CompanyInterview {
  id: string;
  name: string;
  logo: string;
  color: string;
  year: number;
  season: string;
  departments: DepartmentInterview[];
}

// ==================== 面经注册中心 ====================

import { meituanInterview } from './interview/meituan';

export const companyInterviews: CompanyInterview[] = [
  meituanInterview,
];

// ==================== 查询工具 ====================

export function getInterviewCompany(id: string) {
  return companyInterviews.find(c => c.id === id);
}

export function getDepartment(companyId: string, deptId: string) {
  return getInterviewCompany(companyId)?.departments.find(d => d.id === deptId);
}

export function getInterviewSession(companyId: string, deptId: string, sessionId: string) {
  return getDepartment(companyId, deptId)?.sessions.find(s => s.id === sessionId);
}

/** 按分类聚合所有面试题（跨公司跨部门），自动去重 */
export function getAllQuestionsByCategory(): Record<InterviewCategory, InterviewQuestion[]> {
  const map: Record<string, InterviewQuestion[]> = {};
  const seen = new Set<string>();

  for (const company of companyInterviews) {
    for (const dept of company.departments) {
      for (const session of dept.sessions) {
        for (const q of session.questions) {
          if (seen.has(q.id)) continue;  // 去重
          seen.add(q.id);
          if (!map[q.category]) map[q.category] = [];
          map[q.category].push(q);
        }
      }
    }
  }
  return map as Record<InterviewCategory, InterviewQuestion[]>;
}

/** 获取所有面试题（去重） */
export function getAllInterviewQuestions(): InterviewQuestion[] {
  const seen = new Set<string>();
  const result: InterviewQuestion[] = [];
  for (const company of companyInterviews) {
    for (const dept of company.departments) {
      for (const session of dept.sessions) {
        for (const q of session.questions) {
          if (seen.has(q.id)) continue;
          seen.add(q.id);
          result.push(q);
        }
      }
    }
  }
  return result;
}
