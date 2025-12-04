import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import CoursePage from './pages/CoursePage.tsx'
import Login from './pages/Login.tsx'
import LessonFeedbackPage from './components/LessonFeedbackPage'
import Profile from './pages/Profile.tsx';

function LessonFeedbackRoute() {
  const params = useParams()
  const lessonId = params.lessonId ?? '1'
  const role = localStorage.getItem('role')
  const mode = role === 'admin' ? 'teacher' : 'student'
  return <LessonFeedbackPage mode={mode as 'teacher' | 'student'} lessonTitle={`Lesson ${lessonId}`} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="main" element={<App />}></Route>
        <Route path="course/:id" element={<CoursePage />}></Route>
        <Route path="course/:id/lesson/:lessonId" element={<LessonFeedbackRoute />}></Route>
        <Route path="profile" element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
