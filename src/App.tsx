import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/components/landing-page'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { DashboardPage } from '@/pages/dashboard'
import { AddMemberPage } from '@/pages/add-member'
import { MembersPage } from '@/pages/members'
import { ProtectedRoute } from '@/components/protected-route'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/members" 
          element={
            <ProtectedRoute>
              <MembersPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/members/add" 
          element={
            <ProtectedRoute>
              <AddMemberPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

