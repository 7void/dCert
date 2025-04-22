import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20 space-y-6">
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <p className="text-xl text-gray-600">Page not found.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  )
}
