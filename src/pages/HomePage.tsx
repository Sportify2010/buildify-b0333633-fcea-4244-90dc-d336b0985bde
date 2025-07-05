
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchEvents, fetchSports } from '../lib/supabase'
import { CalendarClock, Play, Star, Tv } from 'lucide-react'

export default function HomePage() {
  const { data: sports = [], isLoading: sportsLoading } = useQuery({
    queryKey: ['sports'],
    queryFn: fetchSports
  })

  const { data: liveEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events', 'live'],
    queryFn: () => fetchEvents(undefined, 'live')
  })

  const { data: upcomingEvents = [], isLoading: upcomingLoading } = useQuery({
    queryKey: ['events', 'upcoming'],
    queryFn: () => fetchEvents(undefined, 'upcoming')
  })

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-primary text-white rounded-lg overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Watch All Your Favorite Sports in One Place
            </h1>
            <p className="text-xl mb-8">
              High-quality streaming of every sport imaginable, from football to Formula 1.
              Never miss a game again!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition"
              >
                Start Watching Now
              </Link>
              <Link
                to="/subscription"
                className="bg-transparent border-2 border-white font-semibold px-6 py-3 rounded-md hover:bg-white/10 transition"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Now Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Tv className="mr-2 text-red-500" /> Live Now
          </h2>
          <Link to="/events" className="text-primary hover:underline">
            View All
          </Link>
        </div>

        {eventsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : liveEvents.length === 0 ? (
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-500">No live events at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveEvents.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/watch/${event.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={event.thumbnail_url || 'https://via.placeholder.com/400x225?text=No+Image'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    LIVE
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{event.sport?.name}</p>
                  <div className="flex items-center text-sm text-gray-500">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <CalendarClock className="mr-2 text-primary" /> Upcoming Events
          </h2>
          <Link to="/events" className="text-primary hover:underline">
            View All
          </Link>
        </div>

        {upcomingLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
                {upcomingEvents.slice(0, 5).map((event) => (
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

      {/* Sports Categories Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Star className="mr-2 text-yellow-500" /> Popular Sports
        </h2>

        {sportsLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sports.slice(0, 8).map((sport) => (
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
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-8 text-center">Why Choose Sportify?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tv className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">High-Quality Streaming</h3>
            <p className="text-gray-600">
              Enjoy crystal clear 1080p/60fps or even 4K streaming for the ultimate viewing experience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Favorite Sports & Teams</h3>
            <p className="text-gray-600">
              Follow your favorite sports and teams to never miss an important match or event.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Event Notifications</h3>
            <p className="text-gray-600">
              Get timely reminders for upcoming fixtures so you're always in the loop.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Watching?</h2>
        <p className="text-xl mb-6">
          Join Sportify today for just ฿60 per month and get access to all sports content.
        </p>
        <Link
          to="/register"
          className="bg-white text-primary font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition inline-block"
        >
          Sign Up Now
        </Link>
      </section>
    </div>
  )
}