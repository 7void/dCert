import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config';

let provider, signer, contract;

export async function initEthers() {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected');
  }
  // v6: BrowserProvider replaces Web3Provider
  provider = new ethers.BrowserProvider(window.ethereum);
  // ask for permission
  await provider.send('eth_requestAccounts', []);
  // v6: getSigner() is async
  signer = await provider.getSigner();
  // same contract instantiation
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export function getContract() {
  return contract;
}
