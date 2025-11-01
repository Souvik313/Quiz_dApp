import { useState, useEffect, useCallback } from 'react'
import { Routes, Route } from "react-router-dom";
import {Navbar} from './components/navbar.jsx';
import {Body} from './components/body.jsx';
import {Footer} from './components/footer.jsx';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { GetStarted } from './pages/Get-started.jsx';
import {Login} from './pages/Login.jsx';
import { CreateQuiz } from './pages/CreateQuiz.jsx';
import { Profile } from './pages/UserProfile.jsx';
import './index.css';
import Quiz from './pages/Quiz.jsx';

const FLOW_EVM_CHAIN_ID = '0x221';
const FLOW_EVM_NETWORK_PARAMS = {
  chainId: FLOW_EVM_CHAIN_ID,
  chainName: 'Flow EVM Testnet',
  nativeCurrency: {
    name: 'Flow',
    symbol: 'FLOW',
    decimals: 18,
  },
  rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
  blockExplorerUrls: ['https://evm-testnet.flowscan.io'],
};

function App() {
 const [isLoggedIn, setIsLoggedIn] = useState(() => {
   return localStorage.getItem('isLoggedIn') === 'true';
 });
 const [walletAddress, setWalletAddress] = useState('');
 const [chainId, setChainId] = useState('');
 const [isConnectingWallet, setIsConnectingWallet] = useState(false);

 const handleAccountsChanged = useCallback((accounts = []) => {
   if (accounts.length > 0) {
     setWalletAddress(accounts[0]);
   } else {
     setWalletAddress('');
   }
 }, []);

 const handleChainChanged = useCallback((newChainId) => {
   setChainId(newChainId);
 }, []);

 useEffect(() => {
   const { ethereum } = window;

   if (!ethereum) {
     return undefined;
   }

   ethereum
     .request({ method: 'eth_chainId' })
     .then((currentChainId) => handleChainChanged(currentChainId))
     .catch(() => {
       setChainId('');
     });

   ethereum.on('accountsChanged', handleAccountsChanged);
   ethereum.on('chainChanged', handleChainChanged);

   return () => {
     ethereum.removeListener('accountsChanged', handleAccountsChanged);
     ethereum.removeListener('chainChanged', handleChainChanged);
   };
 }, [handleAccountsChanged, handleChainChanged]);

 const ensureFlowEvmNetwork = useCallback(async () => {
   const { ethereum } = window;

   if (!ethereum) {
     throw new Error('MetaMask is not available');
   }

   const currentChainId = await ethereum.request({ method: 'eth_chainId' });

   if (currentChainId === FLOW_EVM_CHAIN_ID) {
     handleChainChanged(currentChainId);
     return;
   }

   try {
     await ethereum.request({
       method: 'wallet_switchEthereumChain',
       params: [{ chainId: FLOW_EVM_CHAIN_ID }],
     });
     handleChainChanged(FLOW_EVM_CHAIN_ID);
   } catch (switchError) {
     if (switchError?.code === 4902) {
       await ethereum.request({
         method: 'wallet_addEthereumChain',
         params: [FLOW_EVM_NETWORK_PARAMS],
       });
       handleChainChanged(FLOW_EVM_CHAIN_ID);
     } else {
       throw switchError;
     }
   }
 }, [handleChainChanged]);

 const connectWallet = useCallback(async () => {
   const { ethereum } = window;

   if (!ethereum) {
     window.alert('MetaMask is required to connect. Please install the extension and try again.');
     return;
   }

   if (isConnectingWallet) {
     return;
   }

   try {
     setIsConnectingWallet(true);
    await ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    });

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    handleAccountsChanged(accounts);

    await ensureFlowEvmNetwork();
   } catch (error) {
     if (error?.code !== 4001) {
       console.error('Failed to connect wallet', error);
       window.alert('Unable to connect to MetaMask. Check the console for more details.');
     }
   } finally {
     setIsConnectingWallet(false);
   }
 }, [ensureFlowEvmNetwork, handleAccountsChanged, isConnectingWallet]);

 return(
  <div>
   <Navbar
     isLoggedIn={isLoggedIn}
     setIsLoggedIn={setIsLoggedIn}
     walletAddress={walletAddress}
     chainId={chainId}
     onConnectWallet={connectWallet}
     isConnectingWallet={isConnectingWallet}
   />
   <Routes>
   
     
        <Route path="/" element={<Body isLoggedIn={isLoggedIn}/>} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/quiz/:slug" element={<Quiz />} />
        <Route
          path="/profile"
          element={
            <Profile
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              walletAddress={walletAddress}
              onConnectWallet={connectWallet}
              isConnectingWallet={isConnectingWallet}
            />
          }
        />
   
   </Routes>
   <Footer />
  </div>
  
 )
}

export default App;
