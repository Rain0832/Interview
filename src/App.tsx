import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// 主页
import PortalPage from './pages/PortalPage'

// 笔试板块
import ExamHomePage from './features/exam/pages/HomePage'
import CompanyPage from './features/exam/pages/CompanyPage'
import SessionPage from './features/exam/pages/SessionPage'
import ChoicePage from './features/exam/pages/ChoicePage'
import CodingPage from './features/exam/pages/CodingPage'

// 面试板块
import InterviewHomePage from './features/interview/pages/InterviewHomePage'
import InterviewDeptPage from './features/interview/pages/InterviewDeptPage'
import InterviewCategoryPage from './features/interview/pages/InterviewCategoryPage'

// 成长板块
import GrowthPage from './features/growth/pages/GrowthPage'

// 用户板块
import WrongBookPage from './features/user/pages/WrongBookPage'
import MyRecordsPage from './features/user/pages/MyRecordsPage'
import UploadPage from './features/user/pages/UploadPage'
import AuthPage from './features/user/pages/AuthPage'
import ProfilePage from './features/user/pages/ProfilePage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PortalPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* 笔试板块 */}
        <Route path="/exam" element={<ExamHomePage />} />
        <Route path="/exam/company/:companyId" element={<CompanyPage />} />
        <Route path="/exam/company/:companyId/:sessionId" element={<SessionPage />} />
        <Route path="/exam/company/:companyId/:sessionId/choice" element={<ChoicePage />} />
        <Route path="/exam/company/:companyId/:sessionId/coding/:questionId" element={<CodingPage />} />

        {/* 面试板块 */}
        <Route path="/interview" element={<InterviewHomePage />} />
        <Route path="/interview/category" element={<InterviewCategoryPage />} />
        <Route path="/interview/category/:category" element={<InterviewCategoryPage />} />
        <Route path="/interview/:companyId/:deptId" element={<InterviewDeptPage />} />

        {/* 成长板块 */}
        <Route path="/growth" element={<GrowthPage />} />

        {/* 用户工具 */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wrong-book" element={<WrongBookPage />} />
        <Route path="/my-records" element={<MyRecordsPage />} />
        <Route path="/upload" element={<UploadPage />} />

        {/* 兼容旧路由 */}
        <Route path="/company/:companyId" element={<CompanyPage />} />
        <Route path="/company/:companyId/:sessionId" element={<SessionPage />} />
        <Route path="/company/:companyId/:sessionId/choice" element={<ChoicePage />} />
        <Route path="/company/:companyId/:sessionId/coding/:questionId" element={<CodingPage />} />
      </Route>
    </Routes>
  )
}

export default App
