import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
      <h1 className="text-4xl font-bold text-pink">CertChain</h1>
      <p className="text-lg text-gray-600">
        Verify blockchain‑backed certificates in seconds.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/verify"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Verify Certificate
        </Link>
        <Link
          to="/admin"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Issue Certificate
        </Link>
      </div>
    </div>
  )
}
