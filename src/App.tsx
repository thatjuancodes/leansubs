import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/components/landing-page'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { DashboardPage } from '@/pages/dashboard'
import { ProfilePage } from '@/pages/profile'
import { AddMemberPage } from '@/pages/add-member'
import { MembersPage } from '@/pages/members'
import { AddSessionPage } from '@/pages/add-session'
import { SessionsPage } from '@/pages/sessions'
import { AddSubscriptionPage } from '@/pages/add-subscription'
import { SubscriptionsPage } from '@/pages/subscriptions'
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
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
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
        <Route 
          path="/sessions/add" 
          element={
            <ProtectedRoute>
              <AddSessionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sessions" 
          element={
            <ProtectedRoute>
              <SessionsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscriptions/add" 
          element={
            <ProtectedRoute>
              <AddSubscriptionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/subscriptions" 
          element={
            <ProtectedRoute>
              <SubscriptionsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

