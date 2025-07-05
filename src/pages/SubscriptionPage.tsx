
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { processPayment } from '../lib/supabase'
import { PAYMENT_METHODS } from '../types'
import { Building, CreditCard, PaypalLogo, Check } from 'lucide-react'

export default function SubscriptionPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { refreshSubscription } = useAuth()
  const navigate = useNavigate()

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }
    
    try {
      setError(null)
      setLoading(true)
      
      // Process payment through Supabase edge function
      await processPayment(selectedMethod)
      
      // Update subscription status in auth context
      await refreshSubscription()
      
      setSuccess(true)
      
      // Redirect to dashboard after successful payment
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    } catch (error) {
      console.error('Payment error:', error)
      setError('Failed to process payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return <Building size={24} />
      case 'card':
        return <CreditCard size={24} />
      case 'paypal':
        return <PaypalLogo size={24} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-primary text-white p-6">
          <h1 className="text-2xl font-bold">Subscribe to Sportify</h1>
          <p className="mt-2">Get unlimited access to all sports content</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Payment successful! You now have access to all Sportify content.
              Redirecting to dashboard...
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Sportify Premium</span>
                <span className="font-bold text-xl">฿60</span>
              </div>
              <p className="text-gray-600 text-sm">Monthly subscription</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm">
                  <Check size={16} className="text-green-500 mr-2" />
                  Access to all sports content
                </li>
                <li className="flex items-center text-sm">
                  <Check size={16} className="text-green-500 mr-2" />
                  High-quality streaming (1080p/60fps or 4K)
                </li>
                <li className="flex items-center text-sm">
                  <Check size={16} className="text-green-500 mr-2" />
                  Favorite sports and teams
                </li>
                <li className="flex items-center text-sm">
                  <Check size={16} className="text-green-500 mr-2" />
                  Event notifications
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getPaymentIcon(method.id)}
                    </div>
                    <div>
                      <h3 className="font-medium">{method.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={loading || success || !selectedMethod}
            className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing Payment...' : 'Pay ฿60'}
          </button>
          
          <p className="mt-4 text-sm text-gray-500 text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}