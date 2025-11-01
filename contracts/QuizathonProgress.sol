// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


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

    function registerPlayer() external {
        Player storage player = players[msg.sender];
        require(!player.registered, "Already registered");

        player.registered = true;
        player.lastUpdated = block.timestamp;

        emit PlayerRegistered(msg.sender);
    }

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

    function getPlayer(address account) external view returns (Player memory) {
        return players[account];
    }
}

