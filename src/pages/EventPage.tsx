
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchEvent, toggleFavoriteTeam } from '../lib/supabase'
import { CalendarClock, Clock, Heart, Play } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function EventPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { user, hasSubscription } = useAuth()
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId!),
    enabled: !!eventId
  })
  
  const { data: favoriteTeams = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['favoriteTeams'],
    queryFn: () => [],
    enabled: !!user
  })
  
  const handleToggleFavoriteTeam = async (teamId: string) => {
    if (!user) return
    
    const isFavorite = favoriteTeams.some(ft => ft.team_id === teamId)
    
    try {
      await toggleFavoriteTeam(teamId, isFavorite)
      refetchFavorites()
    } catch (error) {
      console.error('Error toggling favorite team:', error)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events" className="text-primary hover:underline">
          Browse All Events
        </Link>
      </div>
    )
  }
  
  const isLive = event.status === 'live'
  const isUpcoming = event.status === 'upcoming'
  const eventDate = new Date(event.start_time)
  const eventEndDate = event.end_time ? new Date(event.end_time) : null
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Event Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={event.thumbnail_url || 'https://via.placeholder.com/1200x400?text=Event'}
            alt={event.title}
            className="w-full h-64 object-cover"
          />
          {isLive && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md font-semibold">
              LIVE NOW
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-4">
            <div className="flex items-center">
              <CalendarClock size={16} className="mr-1" />
              <span>{eventDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{eventDate.toLocaleTimeString()}</span>
            </div>
            <Link to={`/sports/${event.sport_id}`} className="text-primary hover:underline">
              {event.sport?.name}
            </Link>
          </div>
          
          {event.description && (
            <p className="text-gray-700 mb-6">{event.description}</p>
          )}
          
          {isLive ? (
            <Link
              to={hasSubscription ? `/watch/${event.id}` : '/subscription'}
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-primary-dark"
            >
              <Play size={20} className="mr-2" />
              {hasSubscription ? 'Watch Now' : 'Subscribe to Watch'}
            </Link>
          ) : isUpcoming ? (
            <div className="bg-gray-100 rounded-md p-4">
              <h3 className="font-semibold mb-2">Upcoming Event</h3>
              <p className="text-gray-600">
                This event will start on {eventDate.toLocaleString()}.
                {hasSubscription ? '' : ' Subscribe to watch when it goes live.'}
              </p>
              {!hasSubscription && (
                <Link
                  to="/subscription"
                  className="inline-block mt-3 text-primary hover:underline"
                >
                  View Subscription Plans
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-md p-4">
              <h3 className="font-semibold mb-2">Event Completed</h3>
              <p className="text-gray-600">
                This event has ended.
                {hasSubscription ? ' You can still watch the replay.' : ' Subscribe to watch the replay.'}
              </p>
              {hasSubscription ? (
                <Link
                  to={`/watch/${event.id}`}
                  className="inline-flex items-center mt-3 text-primary hover:underline"
                >
                  <Play size={16} className="mr-1" />
                  Watch Replay
                </Link>
              ) : (
                <Link
                  to="/subscription"
                  className="inline-block mt-3 text-primary hover:underline"
                >
                  View Subscription Plans
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Teams Section */}
      {event.teams && event.teams.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Teams</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {event.teams.map((team) => (
              <div key={team.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center">
                  <img
                    src={team.logo_url || 'https://via.placeholder.com/48?text=Team'}
                    alt={team.name}
                    className="w-12 h-12 object-contain mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.sport?.name}</p>
                  </div>
                </div>
                
                {user && (
                  <button
                    onClick={() => handleToggleFavoriteTeam(team.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Heart
                      size={20}
                      className={favoriteTeams.some(ft => ft.team_id === team.id) ? 'fill-red-500 text-red-500' : ''}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Related Events */}
      {/* This would be implemented with a query for events with the same sport_id */}
    </div>
  )
}