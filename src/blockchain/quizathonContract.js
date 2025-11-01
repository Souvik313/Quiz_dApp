import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0xd4de3eB923af78357e009Ed694dc57a6B63444E4';

const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerPlayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "score", "type": "uint256" }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "getPlayer",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "totalQuizzesTaken", "type": "uint256" },
          { "internalType": "uint256", "name": "highestScore", "type": "uint256" },
          { "internalType": "uint256", "name": "lastUpdated", "type": "uint256" },
          { "internalType": "bool", "name": "registered", "type": "bool" }
        ],
        "internalType": "struct QuizathonProgress.Player",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "uint256", "name": "quizzesTaken", "type": "uint256" },
      { "internalType": "uint256", "name": "highestScore", "type": "uint256" }
    ],
    "name": "adminSetProgress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "account", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "quizzesTaken", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "highestScore", "type": "uint256" }
    ],
    "name": "ProgressUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "PlayerRegistered",
    "type": "event"
  }
];

function ensureEthereum() {
  if (!window.ethereum) {
    throw new Error('MetaMask is required to interact with the Flow EVM Testnet.');
  }
}

export async function getQuizathonContract() {
  ensureEthereum();

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  if (!CONTRACT_ADDRESS) {
    throw new Error('Set CONTRACT_ADDRESS in src/blockchain/quizathonContract.js to your deployed address.');
  }

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export async function registerPlayerOnChain() {
  const contract = await getQuizathonContract();
  const tx = await contract.registerPlayer();
  return tx.wait();
}

export async function submitScoreOnChain(score) {
  const contract = await getQuizathonContract();
  const tx = await contract.submitScore(score);
  return tx.wait();
}

export async function fetchPlayerOnChain(address) {
  const contract = await getQuizathonContract();
  return contract.getPlayer(address);
}

