
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = 'https://fknhneaabmaaifkxcjtk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrbmhuZWFhYm1hYWlma3hjanRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2Mjc5NjcsImV4cCI6MjA2NzIwMzk2N30.HPl9GXOXy67KN4P4GMBYGD1OoK-VxtXJFVKRihaVYss'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export async function processPayment(
  paymentMethod: string,
  paymentId?: string,
  amount: number = 60,
  currency: string = 'THB'
) {
  const { data, error } = await supabase.functions.invoke('process-payment', {
    body: {
      payment_method: paymentMethod,
      payment_id: paymentId,
      amount,
      currency
    }
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function checkSubscription() {
  const { data, error } = await supabase.rpc('check_active_subscription')
  
  if (error) {
    console.error('Error checking subscription:', error)
    return false
  }
  
  return data
}

export async function fetchSports() {
  const { data, error } = await supabase
    .from('sports')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching sports:', error)
    throw new Error('Failed to fetch sports')
  }
  
  return data
}

export async function fetchTeams(sportId?: string) {
  let query = supabase
    .from('teams')
    .select('*, sports(*)')
    .order('name')
  
  if (sportId) {
    query = query.eq('sport_id', sportId)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching teams:', error)
    throw new Error('Failed to fetch teams')
  }
  
  return data
}

export async function fetchEvents(sportId?: string, status?: string) {
  let query = supabase
    .from('events')
    .select('*, sports(*)')
    .order('start_time')
  
  if (sportId) {
    query = query.eq('sport_id', sportId)
  }
  
  if (status) {
    query = query.eq('status', status)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching events:', error)
    throw new Error('Failed to fetch events')
  }
  
  return data
}

export async function fetchEvent(eventId: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*, sports(*)')
    .eq('id', eventId)
    .single()
  
  if (error) {
    console.error('Error fetching event:', error)
    throw new Error('Failed to fetch event')
  }
  
  return data
}

export async function fetchFavoriteSports() {
  const { data, error } = await supabase
    .from('favorite_sports')
    .select('*, sports(*)')
  
  if (error) {
    console.error('Error fetching favorite sports:', error)
    throw new Error('Failed to fetch favorite sports')
  }
  
  return data
}

export async function toggleFavoriteSport(sportId: string, isFavorite: boolean) {
  if (isFavorite) {
    const { error } = await supabase
      .from('favorite_sports')
      .delete()
      .eq('sport_id', sportId)
    
    if (error) {
      console.error('Error removing favorite sport:', error)
      throw new Error('Failed to remove favorite sport')
    }
  } else {
    const { error } = await supabase
      .from('favorite_sports')
      .insert({ sport_id: sportId })
    
    if (error) {
      console.error('Error adding favorite sport:', error)
      throw new Error('Failed to add favorite sport')
    }
  }
}

export async function fetchFavoriteTeams() {
  const { data, error } = await supabase
    .from('favorite_teams')
    .select('*, teams(*)')
  
  if (error) {
    console.error('Error fetching favorite teams:', error)
    throw new Error('Failed to fetch favorite teams')
  }
  
  return data
}

export async function toggleFavoriteTeam(teamId: string, isFavorite: boolean) {
  if (isFavorite) {
    const { error } = await supabase
      .from('favorite_teams')
      .delete()
      .eq('team_id', teamId)
    
    if (error) {
      console.error('Error removing favorite team:', error)
      throw new Error('Failed to remove favorite team')
    }
  } else {
    const { error } = await supabase
      .from('favorite_teams')
      .insert({ team_id: teamId })
    
    if (error) {
      console.error('Error adding favorite team:', error)
      throw new Error('Failed to add favorite team')
    }
  }
}

export async function fetchNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*, events(*)')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching notifications:', error)
    throw new Error('Failed to fetch notifications')
  }
  
  return data
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  
  if (error) {
    console.error('Error marking notification as read:', error)
    throw new Error('Failed to mark notification as read')
  }
}