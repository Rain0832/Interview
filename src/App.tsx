import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PortalPage from './pages/PortalPage'
import HomePage from './pages/HomePage'
import CompanyPage from './pages/CompanyPage'
import SessionPage from './pages/SessionPage'
import ChoicePage from './pages/ChoicePage'
import CodingPage from './pages/CodingPage'
import InterviewHomePage from './pages/InterviewHomePage'
import InterviewDeptPage from './pages/InterviewDeptPage'
import InterviewCategoryPage from './pages/InterviewCategoryPage'
import WrongBookPage from './pages/WrongBookPage'
import MyRecordsPage from './pages/MyRecordsPage'
import UploadPage from './pages/UploadPage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* 主页：互联网求职中心 */}
        <Route path="/" element={<PortalPage />} />
        <Route path="/login" element={<AuthPage />} />

        {/* 笔试板块 */}
        <Route path="/exam" element={<HomePage />} />
        <Route path="/exam/company/:companyId" element={<CompanyPage />} />
        <Route path="/exam/company/:companyId/:sessionId" element={<SessionPage />} />
        <Route path="/exam/company/:companyId/:sessionId/choice" element={<ChoicePage />} />
        <Route path="/exam/company/:companyId/:sessionId/coding/:questionId" element={<CodingPage />} />

        {/* 面试板块 */}
        <Route path="/interview" element={<InterviewHomePage />} />
        <Route path="/interview/category" element={<InterviewCategoryPage />} />
        <Route path="/interview/category/:category" element={<InterviewCategoryPage />} />
        <Route path="/interview/:companyId/:deptId" element={<InterviewDeptPage />} />

        {/* 个人工具 */}
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
