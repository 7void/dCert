import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config';

export default function Verify() {
  const [hash, setHash] = useState('');
  const [status, setStatus] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setImageUrl('');
    setStatus('');

    if (!window.ethereum) {
      return setStatus('❌ Please install MetaMask');
    }

    if (!hash.trim()) {
      return setStatus('⚠️ Please enter a certificate hash');
    }

    setStatus('🔍 Checking on-chain…');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const [valid, recipientName, course, issuedAt, ipfsLink] =
        await contract.verifyCertificate(hash);

      if (!valid) {
        return setStatus('❌ Certificate not found or invalid.');
      }

      const issueDate = new Date(Number(issuedAt) * 1000).toLocaleDateString();

      setStatus(
        `✅ Valid Certificate\n\n` +
        `🎓 Recipient: ${recipientName}\n` +
        `📚 Course: ${course}\n` +
        `📅 Issued on: ${issueDate}`
      );

      if (ipfsLink && ipfsLink.startsWith('https://')) {
        setImageUrl(ipfsLink);
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('❌ Error verifying certificate. See console for details.');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Verify Certificate</h2>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          type="text"
          placeholder="Certificate Hash"
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Verify
        </button>
      </form>

      {status && (
        <pre className="mt-4 text-center whitespace-pre-wrap">{status}</pre>
      )}

      {imageUrl && (
        <div className="mt-6 text-center">
          <img
            src={imageUrl}
            alt="Certificate"
            className="inline-block max-w-full h-auto rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
