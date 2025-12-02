import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CoursePage from './pages/CoursePage.tsx'
import Login from './pages/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="main" element={<App />}></Route>
        <Route path="course/:id" element={<CoursePage />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
