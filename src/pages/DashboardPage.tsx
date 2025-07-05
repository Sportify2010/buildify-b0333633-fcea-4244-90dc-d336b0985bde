
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { fetchFavoriteSports, fetchFavoriteTeams, fetchEvents } from '../lib/supabase'
import { CalendarClock, Heart, Play, Tv } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  
  const { data: favoriteSports = [] } = useQuery({
    queryKey: ['favoriteSports'],
    queryFn: fetchFavoriteSports,
    enabled: !!user
  })
  
  const { data: favoriteTeams = [] } = useQuery({
    queryKey: ['favoriteTeams'],
    queryFn: fetchFavoriteTeams,
    enabled: !!user
  })
  
  const { data: liveEvents = [] } = useQuery({
    queryKey: ['events', 'live'],
    queryFn: () => fetchEvents(undefined, 'live'),
    enabled: !!user
  })
  
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => fetchEvents(undefined, 'upcoming'),
    enabled: !!user
  })

  // Filter events related to favorite sports and teams
  const favoriteTeamIds = favoriteTeams.map(ft => ft.team_id)
  const favoriteSportIds = favoriteSports.map(fs => fs.sport_id)
  
  const filteredLiveEvents = liveEvents.filter(event => 
    favoriteSportIds.includes(event.sport_id)
  )
  
  const filteredUpcomingEvents = upcomingEvents.filter(event => 
    favoriteSportIds.includes(event.sport_id)
  )

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h1>
        <p className="text-gray-600">
          Track your favorite sports and teams, and never miss an event.
        </p>
      </div>
      
      {/* Live Events Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Tv className="mr-2 text-red-500" /> Live Now
          </h2>
          <Link to="/events" className="text-primary hover:underline text-sm">
            View All
          </Link>
        </div>
        
        {filteredLiveEvents.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500">No live events from your favorite sports right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLiveEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/watch/${event.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="relative">
                  <img
                    src={event.thumbnail_url || 'https://via.placeholder.com/400x225?text=No+Image'}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    LIVE
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{event.sport?.name}</p>
                  <div className="flex items-center text-sm text-primary">
                    <Play size={16} className="mr-1" />
                    <span>Watch Now</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      
      {/* Upcoming Events Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <CalendarClock className="mr-2 text-primary" /> Upcoming Events
          </h2>
          <Link to="/events" className="text-primary hover:underline text-sm">
            View All
          </Link>
        </div>
        
        {filteredUpcomingEvents.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-500">No upcoming events from your favorite sports.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUpcomingEvents.slice(0, 5).map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{event.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{event.sport?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(event.start_time).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/events/${event.id}`} className="text-primary hover:underline">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      
      {/* Favorites Section */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Heart className="mr-2 text-red-500" /> Your Favorites
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Favorite Sports */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Favorite Sports</h3>
            
            {favoriteSports.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">You haven't added any favorite sports yet.</p>
                <Link to="/sports" className="text-primary hover:underline text-sm mt-2 inline-block">
                  Browse Sports
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {favoriteSports.map((favorite) => (
                  <li key={favorite.sport_id} className="py-3 flex items-center">
                    <img
                      src={favorite.sports?.image_url || 'https://via.placeholder.com/40?text=Sport'}
                      alt={favorite.sports?.name}
                      className="w-8 h-8 object-cover rounded-full mr-3"
                    />
                    <Link to={`/sports/${favorite.sport_id}`} className="hover:text-primary">
                      {favorite.sports?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Favorite Teams */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Favorite Teams</h3>
            
            {favoriteTeams.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">You haven't added any favorite teams yet.</p>
                <Link to="/sports" className="text-primary hover:underline text-sm mt-2 inline-block">
                  Browse Teams
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {favoriteTeams.map((favorite) => (
                  <li key={favorite.team_id} className="py-3 flex items-center">
                    <img
                      src={favorite.teams?.logo_url || 'https://via.placeholder.com/40?text=Team'}
                      alt={favorite.teams?.name}
                      className="w-8 h-8 object-cover rounded-full mr-3"
                    />
                    <div>
                      <div>{favorite.teams?.name}</div>
                      <div className="text-xs text-gray-500">{favorite.teams?.sport?.name}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}