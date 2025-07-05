
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import SubscriptionRoute from './components/SubscriptionRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SubscriptionPage from './pages/SubscriptionPage'
import DashboardPage from './pages/DashboardPage'
import SportPage from './pages/SportPage'
import EventPage from './pages/EventPage'
import WatchPage from './pages/WatchPage'
import { Toaster } from 'sonner'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="subscription" element={<SubscriptionPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
              </Route>
              
              <Route element={<SubscriptionRoute />}>
                <Route path="watch/:eventId" element={<WatchPage />} />
              </Route>
              
              <Route path="sports" element={<SportPage />} />
              <Route path="sports/:sportId" element={<SportPage />} />
              <Route path="events/:eventId" element={<EventPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App