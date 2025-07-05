
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchEvents, fetchSports, fetchTeams, toggleFavoriteSport } from '../lib/supabase'
import { CalendarClock, Heart, Play } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function SportPage() {
  const { sportId } = useParams<{ sportId: string }>()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'live' | 'completed'>('upcoming')
  
  const { data: sports = [] } = useQuery({
    queryKey: ['sports'],
    queryFn: fetchSports
  })
  
  const { data: teams = [] } = useQuery({
    queryKey: ['teams', sportId],
    queryFn: () => fetchTeams(sportId),
    enabled: !!sportId
  })
  
  const { data: events = [], refetch: refetchEvents } = useQuery({
    queryKey: ['events', sportId, activeTab],
    queryFn: () => fetchEvents(sportId, activeTab),
    enabled: !!sportId
  })
  
  const { data: favoriteSports = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['favoriteSports'],
    queryFn: fetchSports,
    enabled: !!user
  })
  
  const sport = sports.find(s => s.id === sportId)
  const isFavorite = favoriteSports.some(fs => fs.id === sportId)
  
  const handleToggleFavorite = async () => {
    if (!user || !sportId) return
    
    try {
      await toggleFavoriteSport(sportId, isFavorite)
      refetchFavorites()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  if (!sport && sportId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Sport Not Found</h2>
        <p className="text-gray-600 mb-6">The sport you're looking for doesn't exist or has been removed.</p>
        <Link to="/sports" className="text-primary hover:underline">
          Browse All Sports
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {sport ? (
        <>
          {/* Sport Header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary text-white p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{sport.name}</h1>
                {user && (
                  <button
                    onClick={handleToggleFavorite}
                    className="flex items-center bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-md"
                  >
                    <Heart className={`mr-1 ${isFavorite ? 'fill-current' : ''}`} size={18} />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </button>
                )}
              </div>
              {sport.description && (
                <p className="mt-2">{sport.description}</p>
              )}
            </div>
          </div>
          
          {/* Events Tabs */}
          <div>
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === 'upcoming'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Upcoming Events
                </button>
                <button
                  onClick={() => setActiveTab('live')}
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === 'live'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Live Now
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`py-3 px-4 text-sm font-medium ${
                    activeTab === 'completed'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Completed
                </button>
              </nav>
            </div>
            
            {events.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">No {activeTab} events found for {sport.name}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    to={activeTab === 'live' ? `/watch/${event.id}` : `/events/${event.id}`}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                  >
                    <div className="relative">
                      <img
                        src={event.thumbnail_url || 'https://via.placeholder.com/400x225?text=No+Image'}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      {activeTab === 'live' && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          LIVE
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {new Date(event.start_time).toLocaleString()}
                      </p>
                      <div className="flex items-center text-sm text-primary">
                        {activeTab === 'live' ? (
                          <>
                            <Play size={16} className="mr-1" />
                            <span>Watch Now</span>
                          </>
                        ) : (
                          <>
                            <CalendarClock size={16} className="mr-1" />
                            <span>View Details</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {/* Teams Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Teams</h2>
            
            {teams.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-500">No teams found for {sport.name}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {teams.map((team) => (
                  <div key={team.id} className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <img
                      src={team.logo_url || 'https://via.placeholder.com/80?text=Team'}
                      alt={team.name}
                      className="w-16 h-16 object-contain mx-auto mb-3"
                    />
                    <h3 className="font-medium">{team.name}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sports.map((sport) => (
            <Link
              key={sport.id}
              to={`/sports/${sport.id}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition text-center p-6"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src={sport.image_url || 'https://via.placeholder.com/64?text=Sport'}
                  alt={sport.name}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h3 className="font-semibold">{sport.name}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}