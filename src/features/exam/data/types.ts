// ==================== 核心类型定义 ====================

export interface Choice {
  label: string;
  text: string;
}

export interface ChoiceQuestion {
  id: number;
  type: 'choice';
  title: string;
  content: string;
  choices: Choice[];
  answer?: string;
  note?: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface CodingQuestion {
  id: number;
  type: 'coding';
  title: string;
  content: string;
  inputDesc: string;
  outputDesc: string;
  examples: Example[];
  timeLimit: string;
  memoryLimit: string;
  codeTemplate: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
}

export type Question = ChoiceQuestion | CodingQuestion;

export interface ExamSession {
  id: string;
  name: string;
  date?: string;
  type: '笔试' | '面试';
  questions: Question[];
}

export interface CompanyData {
  id: string;
  name: string;
  logo: string;
  color: string;
  year: number;
  season: string;
  sessions: ExamSession[];
}
