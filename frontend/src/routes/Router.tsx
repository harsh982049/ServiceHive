import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import ProtectedRoute from './ProtectedRoute'

import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import CalendarPage from '@/pages/calendar/CalendarPage'
import MarketplacePage from '@/pages/marketplace/MarketplacePage'
import RequestsPage from '@/pages/requests/RequestsPage'
import NotFound from '@/pages/NotFound'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/', element: <CalendarPage /> },
          { path: '/marketplace', element: <MarketplacePage /> },
          { path: '/requests', element: <RequestsPage /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
