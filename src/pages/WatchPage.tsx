
import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchEvent } from '../lib/supabase'
import { ArrowLeft, Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function WatchPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { hasSubscription } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const controlsTimeoutRef = useRef<number | null>(null)
  
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId!),
    enabled: !!eventId
  })
  
  useEffect(() => {
    if (!hasSubscription) {
      navigate('/subscription')
    }
  }, [hasSubscription, navigate])
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        togglePlay()
        e.preventDefault()
      } else if (e.code === 'KeyM') {
        toggleMute()
      } else if (e.code === 'KeyF') {
        toggleFullscreen()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  useEffect(() => {
    const handleMouseMove = () => {
      setControlsVisible(true)
      
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current)
      }
      
      controlsTimeoutRef.current = window.setTimeout(() => {
        if (isPlaying) {
          setControlsVisible(false)
        }
      }, 3000)
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }
  
  const toggleFullscreen = () => {
    const videoContainer = document.getElementById('video-container')
    
    if (!videoContainer) return
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])
  
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
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4">
        <Link to={`/events/${eventId}`} className="flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="mr-1" />
          Back to Event Details
        </Link>
      </div>
      
      <div
        id="video-container"
        className="relative bg-black rounded-lg overflow-hidden"
        onMouseEnter={() => setControlsVisible(true)}
      >
        <video
          ref={videoRef}
          className="w-full aspect-video"
          poster={event.thumbnail_url || 'https://via.placeholder.com/1280x720?text=No+Preview'}
          onClick={togglePlay}
        >
          <source
            src={event.stream_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Controls */}
        {controlsVisible && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-full">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <div className="flex items-center space-x-4">
                <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-full">
                  {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                
                <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded-full">
                  <Maximize size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-500 mb-4">
          {event.sport?.name} • {new Date(event.start_time).toLocaleString()}
        </p>
        
        {event.description && (
          <p className="text-gray-700">{event.description}</p>
        )}
      </div>
    </div>
  )
}