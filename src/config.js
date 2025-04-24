// src/config.js
export const CONTRACT_ADDRESS = '0x99a7ec38c4ae24e6767fb4e063fcc940bbfcf7c3'
export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "certificateHash",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "issuer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "CertificateIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "certificateHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "recipientName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "issuedAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "issueCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "certificateHash",
				"type": "string"
			}
		],
		"name": "verifyCertificate",
		"outputs": [
			{
				"internalType": "bool",
				"name": "valid",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "recipientName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "course",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "issuedAt",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];