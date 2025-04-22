import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const [account, setAccount] = useState(null)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [selected] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(selected)
      } catch (err) {
        console.error(err)
      }
    } else {
      alert('Please install MetaMask')
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then(accs => {
          if (accs.length) setAccount(accs[0])
        })
      window.ethereum.on('accountsChanged', accs => {
        setAccount(accs[0] || null)
      })
    }
  }, [])

  const shortAccount = account
    ? account.slice(0, 6) + '…' + account.slice(-4)
    : ''

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <h1 className="text-xl font-bold text-blue-600">
          <Link to="/">dCert</Link>
        </h1>
        <Link to="/" className="hover:text-blue-500">
          Home
        </Link>
        <Link to="/verify" className="hover:text-blue-500">
          Verify
        </Link>
        <Link to="/admin" className="hover:text-blue-500">
          Admin
        </Link>
      </div>
      <div>
        {account ? (
          <span className="px-4 py-2 bg-gray-100 rounded-lg">
            {shortAccount}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}
