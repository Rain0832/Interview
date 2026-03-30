/**
 * 数据注册中心 - 统一导出所有题目数据
 *
 * 【说明】
 * - 本项目收集 2027 届暑期实习（2026 年进行）笔试题目
 * - 美团题目为经核实的真题回忆，其余公司为基于往年真题风格整理的模拟题
 *
 * 【扩展指南】
 * 1. 在 src/data/ 下新建 {company}.ts 文件，定义 ExamSession
 * 2. 在本文件中 import 并注册到 companies 数组
 * 3. 网站自动展示新公司/新场次
 */

export type { Choice, ChoiceQuestion, Example, CodingQuestion, Question, ExamSession, CompanyData } from './types';
import type { CompanyData } from './types';

import { meituanTest1, meituanTest2 } from './meituan';
import { elemeTest1 } from './eleme';
import { antTest1 } from './ant';
import { pddTest1 } from './pdd';
import { mihoyoTest1 } from './mihoyo';

// ==================== 公司注册表 ====================
export const companies: CompanyData[] = [
  {
    id: 'meituan',
    name: '美团',
    logo: '🟡',
    color: '#FFCD00',
    year: 2027,
    season: '暑期实习',
    sessions: [meituanTest1, meituanTest2],
  },
  {
    id: 'eleme',
    name: '饿了么',
    logo: '🔵',
    color: '#0094FF',
    year: 2027,
    season: '暑期实习',
    sessions: [elemeTest1],
  },
  {
    id: 'ant',
    name: '蚂蚁集团',
    logo: '🐜',
    color: '#1677FF',
    year: 2027,
    season: '暑期实习',
    sessions: [antTest1],
  },
  {
    id: 'pdd',
    name: '拼多多',
    logo: '🟠',
    color: '#E02E24',
    year: 2027,
    season: '暑期实习',
    sessions: [pddTest1],
  },
  {
    id: 'mihoyo',
    name: '米哈游',
    logo: '🎮',
    color: '#00C8FF',
    year: 2027,
    season: '暑期实习',
    sessions: [mihoyoTest1],
  },
];

// ==================== 查询工具函数 ====================

export function getCompanyById(id: string): CompanyData | undefined {
  return companies.find((c) => c.id === id);
}

export function getSessionById(companyId: string, sessionId: string) {
  return getCompanyById(companyId)?.sessions.find((s) => s.id === sessionId);
}

export function getQuestionById(companyId: string, sessionId: string, questionId: number) {
  return getSessionById(companyId, sessionId)?.questions.find((q) => q.id === questionId);
}
