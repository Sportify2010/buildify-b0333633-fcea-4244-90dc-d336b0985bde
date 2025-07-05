
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sportify</h3>
            <p className="text-gray-300">
              Watch all your favorite sports in one place with high-quality streaming.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/sports" className="text-gray-300 hover:text-white">Sports</Link></li>
              <li><Link to="/subscription" className="text-gray-300 hover:text-white">Subscription</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Popular Sports</h4>
            <ul className="space-y-2">
              <li><Link to="/sports/football" className="text-gray-300 hover:text-white">Football</Link></li>
              <li><Link to="/sports/basketball" className="text-gray-300 hover:text-white">Basketball</Link></li>
              <li><Link to="/sports/tennis" className="text-gray-300 hover:text-white">Tennis</Link></li>
              <li><Link to="/sports/formula-1" className="text-gray-300 hover:text-white">Formula 1</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: support@sportify.com</li>
              <li>Phone: +66 2 123 4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sportify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}