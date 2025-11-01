import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import './styles/navbar.css';

const FLOW_EVM_CHAIN_ID = '0x221';

export const Navbar = ({
    isLoggedIn,
    walletAddress,
    chainId,
    onConnectWallet,
    isConnectingWallet,
}) => {
    const connectionLabel = useMemo(() => {
        if (isConnectingWallet) {
            return 'Connecting…';
        }

        if (walletAddress) {
            return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
        }

        return 'Connect';
    }, [isConnectingWallet, walletAddress]);

    const isOnFlowEvm = useMemo(() => {
        return chainId?.toLowerCase() === FLOW_EVM_CHAIN_ID;
    }, [chainId]);

    return (
        <nav className='navbar transparent-bg'>
            <h1 className="nav-title"><Link to="/">Quizathon</Link></h1>
            <div className="nav-items">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                {!isLoggedIn ? <Link to="/login">Login</Link> : <Link to="/profile">Profile</Link>}
                <button
                    type="button"
                    className={`connect-wallet-btn${walletAddress ? ' connected' : ''}`}
                    onClick={onConnectWallet}
                    disabled={isConnectingWallet}
                >
                    {connectionLabel}
                </button>
                {walletAddress && !isOnFlowEvm && (
                    <span className="network-warning" title="Switch to the Flow EVM network in MetaMask">
                        Wrong network
                    </span>
                )}
            </div>
        </nav>
    )
}