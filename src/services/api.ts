const API_BASE = import.meta.env.VITE_API_URL || '/api'

class ApiClient {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('oj-token')
  }

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('oj-token', token)
    } else {
      localStorage.removeItem('oj-token')
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || `请求失败 (${res.status})`)
    }
    return data as T
  }

  // Auth
  async register(username: string, email: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    })
    this.setToken(data.token)
    return data
  }

  async login(login: string, password: string) {
    const data = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    })
    this.setToken(data.token)
    return data
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me')
  }

  logout() {
    this.setToken(null)
  }

  // Records
  async saveRecords(records: any[]) {
    return this.request('/records', { method: 'POST', body: JSON.stringify({ records }) })
  }

  async getRecords() {
    return this.request<{ records: any[] }>('/records')
  }

  async getWrongRecords() {
    return this.request<{ records: any[] }>('/records/wrong')
  }

  async getStats() {
    return this.request<{ total: number; correct: number; wrong: number; accuracy: number }>('/records/stats')
  }

  async clearRecords() {
    return this.request('/records', { method: 'DELETE' })
  }

  // Submissions
  async submitCode(data: {
    companyId: string; sessionId: string; questionId: number;
    language: string; code: string; testCases?: any[]; problemDescription?: string
  }) {
    return this.request<any>('/submissions', { method: 'POST', body: JSON.stringify(data) })
  }

  async getSubmissions(limit = 50) {
    return this.request<{ submissions: any[] }>(`/submissions?limit=${limit}`)
  }

  // User Questions
  async createQuestion(data: any) {
    return this.request<{ id: string }>('/questions', { method: 'POST', body: JSON.stringify(data) })
  }

  async getMyQuestions() {
    return this.request<{ questions: any[] }>('/questions/mine')
  }

  async deleteQuestion(id: string) {
    return this.request(`/questions/${id}`, { method: 'DELETE' })
  }

  // Growth — Roadmap
  async getRoadmaps() {
    return this.request<{ roadmaps: any[] }>('/growth/roadmap')
  }
  async saveRoadmap(data: { id?: string; title: string; description: string; milestones: any[] }) {
    if (data.id) {
      return this.request(`/growth/roadmap/${data.id}`, { method: 'PUT', body: JSON.stringify(data) })
    }
    return this.request<{ id: string }>('/growth/roadmap', { method: 'POST', body: JSON.stringify(data) })
  }
  async deleteRoadmap(id: string) {
    return this.request(`/growth/roadmap/${id}`, { method: 'DELETE' })
  }

  // Growth — Notes
  async getNotes(roadmapId?: string) {
    const q = roadmapId ? `?roadmap_id=${roadmapId}` : ''
    return this.request<{ notes: any[] }>(`/growth/notes${q}`)
  }
  async saveNote(data: { id?: string; roadmapId?: string; milestoneId?: string; title: string; content: string }) {
    if (data.id) {
      return this.request(`/growth/notes/${data.id}`, { method: 'PUT', body: JSON.stringify(data) })
    }
    return this.request<{ id: string }>('/growth/notes', { method: 'POST', body: JSON.stringify(data) })
  }
  async deleteNote(id: string) {
    return this.request(`/growth/notes/${id}`, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
