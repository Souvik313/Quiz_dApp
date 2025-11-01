import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    registerPlayerOnChain,
    submitScoreOnChain,
    fetchPlayerOnChain,
} from '../blockchain/quizathonContract.js';

export const Profile = ({
    isLoggedIn,
    setIsLoggedIn,
    walletAddress,
    onConnectWallet,
    isConnectingWallet,
}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        joinDate: '',
        totalQuizzes: 0,
        averageScore: null,
        bestScore: null,
        totalTime: ''
    });
    const [quizHistory, setQuizHistory] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [onChainPlayer, setOnChainPlayer] = useState(null);
    const [scoreInput, setScoreInput] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [onChainError, setOnChainError] = useState('');
    const [isFetchingOnChain, setIsFetchingOnChain] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmittingScore, setIsSubmittingScore] = useState(false);

    useEffect(() => {
        // Load user data from localStorage
        const userEmail = localStorage.getItem('userEmail');
        const loginStatus = localStorage.getItem('isLoggedIn');
        if (!loginStatus || !userEmail) {
            navigate('/login');
            return;
        }

        let storedJoinDate = localStorage.getItem('userJoinDate');
        if (!storedJoinDate) {
            storedJoinDate = new Date().toISOString();
            localStorage.setItem('userJoinDate', storedJoinDate);
        }

        let storedHistory = [];
        const rawHistory = localStorage.getItem('quizHistory');
        if (rawHistory) {
            try {
                storedHistory = JSON.parse(rawHistory);
            } catch (error) {
                console.warn('Failed to parse quizHistory from localStorage', error);
            }
        }

        const totalQuizzesTaken = storedHistory.length;
        let averageScore = null;
        let bestScore = null;

        if (totalQuizzesTaken > 0) {
            let accumulatedScore = 0;
            let accumulatedPossible = 0;
            let highestPercentage = 0;

            storedHistory.forEach(({ score = 0, total = 0 }) => {
                accumulatedScore += Number(score) || 0;
                accumulatedPossible += Number(total) || 0;
                if (total) {
                    const percent = (Number(score) || 0) / Number(total);
                    if (percent > highestPercentage) {
                        highestPercentage = percent;
                    }
                }
            });

            if (accumulatedPossible > 0) {
                averageScore = Math.round((accumulatedScore / accumulatedPossible) * 100);
            }

            if (highestPercentage > 0) {
                bestScore = Math.round(highestPercentage * 100);
            }
        }

        setUser({
            email: userEmail,
            joinDate: new Date(storedJoinDate).toLocaleDateString(),
            totalQuizzes: totalQuizzesTaken,
            averageScore,
            bestScore,
            totalTime: localStorage.getItem('totalQuizTime') || ''
        });

        setQuizHistory(storedHistory);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        navigate('/');
    };

    const getScoreColor = (score, total) => {
        const percentage = (score / total) * 100;
        if (percentage >= 80) return '#4CAF50'; // Green
        if (percentage >= 60) return '#FF9800'; // Orange
        return '#f44336'; // Red
    };

    const normalizeBigNumberish = (value) => {
        if (typeof value === 'bigint') return Number(value);
        if (typeof value === 'string') return Number(value);
        if (value && typeof value === 'object' && typeof value.toString === 'function') {
            return Number(value.toString());
        }
        return Number(value ?? 0);
    };

    const refreshOnChainData = useCallback(async () => {
        if (!walletAddress) {
            setOnChainPlayer(null);
            return;
        }

        setIsFetchingOnChain(true);
        setOnChainError('');
        try {
            const player = await fetchPlayerOnChain(walletAddress);
            setOnChainPlayer({
                registered: Boolean(player.registered),
                totalQuizzesTaken: normalizeBigNumberish(player.totalQuizzesTaken),
                highestScore: normalizeBigNumberish(player.highestScore),
                lastUpdated: normalizeBigNumberish(player.lastUpdated),
            });
        } catch (error) {
            console.error('Failed to fetch on-chain data', error);
            setOnChainError(error?.message ?? 'Unable to read on-chain data.');
        } finally {
            setIsFetchingOnChain(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        if (!walletAddress) {
            setOnChainPlayer(null);
            return;
        }
        refreshOnChainData();
    }, [walletAddress, refreshOnChainData]);

    const handleRegisterOnChain = async () => {
        setOnChainError('');
        setStatusMessage('');
        setIsRegistering(true);

        try {
            await registerPlayerOnChain();
            setStatusMessage('Registration transaction confirmed on Flow EVM Testnet.');
            await refreshOnChainData();
        } catch (error) {
            console.error('Registration failed', error);
            setOnChainError(error?.message ?? 'Registration failed.');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleSubmitScore = async () => {
        const parsedScore = Number(scoreInput);
        if (!Number.isFinite(parsedScore) || parsedScore <= 0) {
            setOnChainError('Enter a score greater than zero to submit.');
            return;
        }

        setOnChainError('');
        setStatusMessage('');
        setIsSubmittingScore(true);

        try {
            await submitScoreOnChain(parsedScore);
            setStatusMessage('Score submitted to the smart contract.');
            setScoreInput('');
            await refreshOnChainData();
        } catch (error) {
            console.error('Submit score failed', error);
            setOnChainError(error?.message ?? 'Could not submit score.');
        } finally {
            setIsSubmittingScore(false);
        }
    };

    return (
        <main className="about-main">
            <div className="body-container transparent-bg" style={{ maxWidth: "1000px", margin: "0 auto" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1>User Profile</h1>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#f44336',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>

                {/* User Info Card */}
                <div style={{
                    background: 'rgba(30,32,40,0.7)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    border: '2px solid #ffd700'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}>
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 style={{ color: '#ffd700', margin: '0 0 8px 0' }}>{user.email}</h2>
                            <p style={{ color: '#fff', margin: '0' }}>Member since {user.joinDate}</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '16px'
                    }}>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4CAF50', margin: '0 0 8px 0' }}>{user.totalQuizzes}</h3>
                            <p style={{ color: '#fff', margin: '0', fontSize: '0.9rem' }}>Quizzes Taken</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <h3 style={{ color: '#FF9800', margin: '0 0 8px 0' }}>{
                                user.averageScore !== null ? `${user.averageScore}%` : '—'
                            }</h3>
                            <p style={{ color: '#fff', margin: '0', fontSize: '0.9rem' }}>Average Score</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <h3 style={{ color: '#4CAF50', margin: '0 0 8px 0' }}>{
                                user.bestScore !== null ? `${user.bestScore}%` : '—'
                            }</h3>
                            <p style={{ color: '#fff', margin: '0', fontSize: '0.9rem' }}>Best Score</p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <h3 style={{ color: '#8f94fb', margin: '0 0 8px 0' }}>{user.totalTime || '—'}</h3>
                            <p style={{ color: '#fff', margin: '0', fontSize: '0.9rem' }}>Total Time</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ marginBottom: '20px' }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            padding: '10px 20px',
                            marginRight: '10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeTab === 'overview' ? '#ffd700' : 'rgba(255,255,255,0.1)',
                            color: activeTab === 'overview' ? '#181920' : '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Quiz History
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        style={{
                            padding: '10px 20px',
                            marginRight: '10px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeTab === 'achievements' ? '#ffd700' : 'rgba(255,255,255,0.1)',
                            color: activeTab === 'achievements' ? '#181920' : '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Achievements
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                    <div>
                        <h3 style={{ color: '#ffd700', marginBottom: '16px' }}>Recent Quiz Results</h3>
                        {quizHistory.length === 0 ? (
                            <p style={{ color: '#ccc' }}>No quiz attempts recorded yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {quizHistory.map((quiz, index) => (
                                    <div
                                        key={quiz.id ?? index}
                                        style={{
                                            background: 'rgba(30,32,40,0.7)',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ color: '#fff', margin: '0 0 4px 0' }}>{quiz.title || 'Untitled Quiz'}</h4>
                                            <p style={{ color: '#ccc', margin: '0', fontSize: '0.9rem' }}>{quiz.date ? new Date(quiz.date).toLocaleString() : 'Date unavailable'}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{
                                                color: getScoreColor(quiz.score || 0, quiz.total || 1),
                                                margin: '0 0 4px 0',
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem'
                                            }}>
                                                {quiz.score ?? 0}/{quiz.total ?? 0}
                                            </p>
                                            {quiz.time && (
                                                <p style={{ color: '#ccc', margin: '0', fontSize: '0.9rem' }}>{quiz.time}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <div>
                        <h3 style={{ color: '#ffd700', marginBottom: '16px' }}>Achievements</h3>
                        <p style={{ color: '#ccc' }}>
                            Achievements will appear here once you complete milestone goals. Keep taking quizzes to unlock them!
                        </p>
                    </div>
                )}

                {/* On-chain progress */}
                <div style={{
                    marginTop: '40px',
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'rgba(30,32,40,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <h3 style={{ color: '#ffd700', marginBottom: '16px' }}>On-chain Progress (Flow EVM Testnet)</h3>

                    {!walletAddress && (
                        <div style={{ color: '#fff', marginBottom: '16px' }}>
                            <p style={{ marginBottom: '12px' }}>
                                Connect your Flow EVM Testnet wallet to record quiz progress on-chain.
                            </p>
                            <button
                                onClick={onConnectWallet}
                                disabled={isConnectingWallet}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#ffd700',
                                    color: '#181920',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {isConnectingWallet ? 'Connecting…' : 'Connect Wallet'}
                            </button>
                        </div>
                    )}

                    {walletAddress && (
                        <div>
                            <p style={{ color: '#fff', marginBottom: '12px', wordBreak: 'break-word' }}>
                                Connected address: <span style={{ color: '#ffd700' }}>{walletAddress}</span>
                            </p>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '12px',
                                marginBottom: '16px'
                            }}>
                                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)' }}>
                                    <p style={{ color: '#ccc', margin: '0 0 8px 0', fontSize: '0.85rem' }}>Status</p>
                                    <p style={{ color: onChainPlayer?.registered ? '#4CAF50' : '#FF9800', margin: 0 }}>
                                        {onChainPlayer?.registered ? 'Registered' : 'Not registered'}
                                    </p>
                                </div>
                                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)' }}>
                                    <p style={{ color: '#ccc', margin: '0 0 8px 0', fontSize: '0.85rem' }}>Quizzes Submitted</p>
                                    <p style={{ color: '#fff', margin: 0 }}>{onChainPlayer?.totalQuizzesTaken ?? 0}</p>
                                </div>
                                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)' }}>
                                    <p style={{ color: '#ccc', margin: '0 0 8px 0', fontSize: '0.85rem' }}>Highest Score</p>
                                    <p style={{ color: '#fff', margin: 0 }}>{onChainPlayer?.highestScore ?? 0}</p>
                                </div>
                                <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)' }}>
                                    <p style={{ color: '#ccc', margin: '0 0 8px 0', fontSize: '0.85rem' }}>Last Updated</p>
                                    <p style={{ color: '#fff', margin: 0 }}>
                                        {onChainPlayer?.lastUpdated
                                            ? new Date(onChainPlayer.lastUpdated * 1000).toLocaleString()
                                            : '—'}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                <button
                                    onClick={refreshOnChainData}
                                    disabled={isFetchingOnChain}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#4e54c8',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isFetchingOnChain ? 'Refreshing…' : 'Refresh'}
                                </button>
                                <button
                                    onClick={handleRegisterOnChain}
                                    disabled={isRegistering || onChainPlayer?.registered}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: onChainPlayer?.registered ? 'rgba(255,255,255,0.1)' : '#ffd700',
                                        color: onChainPlayer?.registered ? '#ccc' : '#181920',
                                        fontWeight: 'bold',
                                        cursor: onChainPlayer?.registered ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isRegistering ? 'Registering…' : onChainPlayer?.registered ? 'Registered' : 'Register on-chain'}
                                </button>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '12px',
                                alignItems: 'center'
                            }}>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Score"
                                    value={scoreInput}
                                    onChange={(event) => setScoreInput(event.target.value)}
                                    style={{
                                        padding: '10px 14px',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.3)',
                                        color: '#fff',
                                        width: '160px'
                                    }}
                                />
                                <button
                                    onClick={handleSubmitScore}
                                    disabled={isSubmittingScore || !onChainPlayer?.registered}
                                    style={{
                                        padding: '10px 18px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: onChainPlayer?.registered ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        cursor: onChainPlayer?.registered ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {isSubmittingScore ? 'Submitting…' : 'Submit Score'}
                                </button>
                            </div>

                            {(statusMessage || onChainError) && (
                                <div style={{ marginTop: '12px' }}>
                                    {statusMessage && (
                                        <p style={{ color: '#4CAF50', margin: 0 }}>{statusMessage}</p>
                                    )}
                                    {onChainError && (
                                        <p style={{ color: '#ff6961', margin: 0 }}>{onChainError}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/get-started')}
                        style={{
                            padding: '12px 24px',
                            marginRight: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#ffd700',
                            color: '#181920',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Take Another Quiz
                    </button>
                    <button
                        onClick={() => navigate('/create-quiz')}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#4e54c8',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        Create New Quiz
                    </button>
                </div>
            </div>
        </main>
    );
};