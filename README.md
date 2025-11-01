# Quizathon dApp

Quizathon is a Flow EVM Testnet-enabled quiz platform built with React and Vite. Users can explore quizzes, track their progress, and optionally register on-chain to keep immutable score records using MetaMask.

## Features
- Responsive React single-page application with routing for home, about, contact, login, quiz, and profile pages.
- Navbar `Connect` button that guides users through connecting MetaMask and switching to the Flow EVM Testnet (chain id `0x221`).
- Smart contract integration via `ethers` with helper utilities in `src/blockchain/quizathonContract.js`.
- User profile page that surfaces locally stored quiz history, on-chain registration status, and allows submitting scores to the deployed `QuizathonProgress` contract.
- Clean separation between off-chain data (stored in `localStorage`) and on-chain state.

## Prerequisites
- Node.js 20+ and npm.
- MetaMask installed in your browser.
- Flow EVM Testnet tokens (free faucet funds recommended) in a MetaMask account.

## Getting Started
```bash
npm install
npm run dev
```

Open the printed localhost URL in your browser. The app automatically refreshes via Vite HMR.

## Configuring MetaMask
When you press `Connect` in the navbar, MetaMask will:
1. Prompt for account access.
2. Request to switch (or add) the Flow EVM Testnet network (`chainId: 0x221`).

You can also add the network manually:
- RPC URL: `https://testnet.evm.nodes.onflow.org`
- Currency symbol: `FLOW`
- Block explorer: `https://evm-testnet.flowscan.io`

## Smart Contract Details
- Contract: `QuizathonProgress.sol` in `/contracts`.
- Deployed address (testnet): update `CONTRACT_ADDRESS` inside `src/blockchain/quizathonContract.js` when you redeploy.
- Helper exports:
  - `registerPlayerOnChain()`
  - `submitScoreOnChain(score)`
  - `fetchPlayerOnChain(address)`

These helpers return `ethers` contract calls with MetaMask as the signer.

## Project Structure Highlights
- `src/App.jsx` – application shell, routing, and wallet connection management.
- `src/components/` – reusable UI pieces (`navbar`, `body`, `footer`, etc.).
- `src/pages/UserProfile.jsx` – local profile details plus on-chain actions.
- `src/blockchain/quizathonContract.js` – contract ABI, address, and interaction utilities.
- `contracts/QuizathonProgress.sol` – Flow EVM Testnet Solidity contract source.

## Quiz History Storage
- Quiz attempts should be saved to `localStorage.quizHistory` as an array of objects:
  ```json
  {
    "title": "General Knowledge",
    "score": 8,
    "total": 10,
    "date": "2025-11-01T09:30:00.000Z",
    "time": "5m 30s"
  }
  ```
- Additional metadata (e.g., total time, join date) is derived from similar stored keys.

## Available Scripts
- `npm run dev` – start development server.
- `npm run build` – production build.
- `npm run preview` – locally preview the production build.
- `npm run lint` – run ESLint checks.

## Deploying the Contract
1. Open [Remix](https://remix.ethereum.org/).
2. Load `contracts/QuizathonProgress.sol` and compile with Solidity `0.8.20` or newer.
3. Set environment to **Injected Provider – MetaMask** while MetaMask is on Flow EVM Testnet.
4. Deploy, then copy the new contract address into `src/blockchain/quizathonContract.js`.

## Future Enhancements
- Replace localStorage quiz data with a backend or Flow Cadence storage option.
- Build achievement logic and real quiz leaderboards using the on-chain contract events.
- Add automated tests (unit + integration) and CI workflows.

## License
This project is currently unlicensed. Add your preferred license file before distributing.
