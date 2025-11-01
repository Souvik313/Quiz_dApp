// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title QuizathonProgress
 * @notice Minimal on-chain registry that lets players connect their Flow EVM wallet
 *         and store quiz progress or reward claims. The contract focuses on
 *         transparent record keeping while keeping business logic flexible for the front-end.
 */
contract QuizathonProgress {
    struct Player {
        uint256 totalQuizzesTaken;
        uint256 highestScore;
        uint256 lastUpdated;
        bool registered;
    }

    address public immutable owner;
    mapping(address => Player) private players;

    event PlayerRegistered(address indexed account);
    event ProgressUpdated(address indexed account, uint256 quizzesTaken, uint256 highestScore);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Register a Flow EVM wallet address. Can be called only once per address.
     */
    function registerPlayer() external {
        Player storage player = players[msg.sender];
        require(!player.registered, "Already registered");

        player.registered = true;
        player.lastUpdated = block.timestamp;

        emit PlayerRegistered(msg.sender);
    }

    /**
     * @notice Submit quiz results for the caller. Stores the highest score and increments
     *         the quiz counter. Can be gated by off-chain checks when used with signatures.
     * @param score Latest quiz score. Must be greater than the previously stored high score
     *              to update the record.
     */
    function submitScore(uint256 score) external {
        require(score > 0, "Score must be > 0");

        Player storage player = players[msg.sender];
        require(player.registered, "Player not registered");

        unchecked {
            player.totalQuizzesTaken += 1;
        }

        if (score > player.highestScore) {
            player.highestScore = score;
        }

        player.lastUpdated = block.timestamp;

        emit ProgressUpdated(msg.sender, player.totalQuizzesTaken, player.highestScore);
    }

    /**
     * @notice Allows the owner to set or correct a player's progress manually.
     */
    function adminSetProgress(
        address account,
        uint256 quizzesTaken,
        uint256 highestScore
    ) external onlyOwner {
        require(account != address(0), "Zero address");

        Player storage player = players[account];
        player.registered = true;
        player.totalQuizzesTaken = quizzesTaken;
        player.highestScore = highestScore;
        player.lastUpdated = block.timestamp;

        emit ProgressUpdated(account, quizzesTaken, highestScore);
    }

    /**
     * @notice Returns player data for a given address.
     */
    function getPlayer(address account) external view returns (Player memory) {
        return players[account];
    }
}

