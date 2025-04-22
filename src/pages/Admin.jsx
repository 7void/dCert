import { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

const uploadToIPFS = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: formData,
    });

    if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
    const { IpfsHash } = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
  } catch (err) {
    console.error('Error uploading file to IPFS:', err);
    return null;
  }
};

export default function Admin() {
  const [form, setForm] = useState({ name: '', course: '', date: '', image: null });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(prev =>
      name === 'image' ? { ...prev, image: files[0] } : { ...prev, [name]: value }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.ethereum) return setMessage('Please install MetaMask');
    if (!form.image) return setMessage('Please upload an image');

    setMessage('📤 Uploading image to IPFS...');
    const ipfsLink = await uploadToIPFS(form.image);
    if (!ipfsLink) return setMessage('❌ Failed to upload image to IPFS');

    setMessage('⛓️ Submitting transaction to blockchain...');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const rawData = `${form.name}-${form.course}-${form.date}-${ipfsLink}`;
      const hashHex = ethers.keccak256(ethers.toUtf8Bytes(rawData));
      const certificateHash = hashHex.slice(2);

      const issuedAt = Math.floor(new Date(form.date).getTime() / 1000);

      const tx = await contract.issueCertificate(
        certificateHash,
        form.name,
        form.course,
        issuedAt,
        ipfsLink
      );

      setMessage('⏳ Waiting for transaction confirmation...');
      await tx.wait();
      setMessage(`✅ Certificate Issued!\nHash: ${certificateHash}`);
    } catch (error) {
      console.error(error);
      setMessage('❌ Transaction failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Issue Certificate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          placeholder="Recipient Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          type="text"
          placeholder="Course Name"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          type="date"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="image"
          onChange={handleChange}
          type="file"
          accept="image/*"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Issue Certificate
        </button>
      </form>
      {message && <pre className="mt-4 text-center whitespace-pre-wrap">{message}</pre>}
    </div>
  );
}
