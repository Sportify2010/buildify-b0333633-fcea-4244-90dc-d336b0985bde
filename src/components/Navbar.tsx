
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Bell, Menu, X } from 'lucide-react'
import { fetchNotifications, markNotificationAsRead } from '../lib/supabase'
import { useQuery } from '@tanstack/react-query'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!user,
    refetchInterval: 60000 // Refetch every minute
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleNotificationClick = async (id: string, eventId: string) => {
    try {
      await markNotificationAsRead(id)
      setIsNotificationsOpen(false)
      navigate(`/events/${eventId}`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">Sportify</Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/sports" className="hover:text-gray-200">Sports</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="hover:text-gray-200 relative"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 text-gray-800">
                      <div className="py-2 px-3 bg-gray-100 border-b border-gray-200">
                        <h3 className="text-sm font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="py-4 px-3 text-sm text-gray-500 text-center">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification.id, notification.event_id)}
                              className={`py-3 px-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${!notification.is_read ? 'bg-blue-50' : ''}`}
                            >
                              <div className="text-sm font-medium">{notification.title}</div>
                              <div className="text-xs text-gray-500">{notification.message}</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={handleSignOut} className="hover:text-gray-200">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">Login</Link>
                <Link to="/register" className="bg-white text-primary px-4 py-2 rounded-md hover:bg-gray-100">Sign Up</Link>
              </>
            )}
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-gray-700 py-2">
          <div className="container mx-auto px-4 space-y-2">
            <Link to="/" className="block py-2 hover:text-gray-200">Home</Link>
            <Link to="/sports" className="block py-2 hover:text-gray-200">Sports</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-gray-200">Dashboard</Link>
                <button onClick={handleSignOut} className="block w-full text-left py-2 hover:text-gray-200">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-gray-200">Login</Link>
                <Link to="/register" className="block py-2 bg-white text-primary px-4 rounded-md hover:bg-gray-100">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}