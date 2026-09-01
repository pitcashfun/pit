// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title PitStop
/// @notice LetsCash fee box on Robinhood Chain (4663).
///         Stint: 3 minutes. Grid: 20. stop() then flag().
///         Weight = recorded balance × compound. No merkle. No private keeper.
///         1% bounty to flag() caller. Rest split to the grid.

interface IERC20 {
    function balanceOf(address a) external view returns (uint256);
}

contract PitStop {
    uint64 public constant STINT = 3 minutes;
    uint8 public constant GRID = 20;
    uint16 public constant BOUNTY_BPS = 100;

    string public constant SITE = "https://pitcash.fun";
    string public constant X = "https://x.com/pitcashfun";

    address public owner;
    address public pitToken;
    uint64 public stint;
    uint64 public stintEndsAt;
    uint8 public filled;
    uint256 public pot;

    struct Car {
        address who;
        uint8 compound;
        uint256 weight;
        bool paid;
    }

    mapping(uint64 => Car[GRID]) public grid;
    mapping(uint64 => mapping(address => bool)) public inStint;

    error Auth();
    error Bad();
    error Early();
    error Full();
    error In();

    event Ownership(address indexed who);
    event TokenSet(address indexed token);
    event Stopped(uint64 indexed stint, address indexed who, uint8 compound, uint256 weight);
    event Flagged(uint64 indexed stint, address indexed caller, uint256 bounty, uint256 paid);

    modifier onlyOwner() {
        if (msg.sender != owner) revert Auth();
        _;
    }

    constructor() {
        owner = msg.sender;
        stint = 1;
        stintEndsAt = uint64(block.timestamp) + STINT;
        emit Ownership(msg.sender);
    }

    receive() external payable {
        pot += msg.value;
    }

    function setToken(address token) external onlyOwner {
        if (token == address(0)) revert Bad();
        pitToken = token;
        emit TokenSet(token);
    }

    function stop(uint8 compound) external {
        if (compound > 2) revert Bad();
        if (pitToken == address(0)) revert Bad();
        if (block.timestamp >= stintEndsAt) revert Early();
        if (filled >= GRID) revert Full();
        if (inStint[stint][msg.sender]) revert In();
        uint256 bal = IERC20(pitToken).balanceOf(msg.sender);
        uint256 mult = compound == 0 ? 1 : compound == 1 ? 2 : 3;
        uint256 w = bal * mult;
        grid[stint][filled] = Car(msg.sender, compound, w, false);
        inStint[stint][msg.sender] = true;
        emit Stopped(stint, msg.sender, compound, w);
        unchecked {
            filled += 1;
        }
    }

    function flag() external {
        if (block.timestamp < stintEndsAt) revert Early();
        uint256 purse = pot;
        pot = 0;
        uint256 bounty = (purse * BOUNTY_BPS) / 10_000;
        uint256 rest = purse - bounty;
        uint256 totalW;
        uint8 n = filled;
        for (uint8 i; i < n; i++) totalW += grid[stint][i].weight;
        if (bounty > 0) {
            (bool okB, ) = msg.sender.call{value: bounty}("");
            if (!okB) revert Bad();
        }
        if (totalW > 0 && rest > 0) {
            for (uint8 i; i < n; i++) {
                Car storage c = grid[stint][i];
                uint256 cut = (rest * c.weight) / totalW;
                c.paid = true;
                if (cut == 0) continue;
                (bool ok, ) = c.who.call{value: cut}("");
                if (!ok) revert Bad();
            }
        }
        emit Flagged(stint, msg.sender, bounty, rest);
        unchecked {
            stint += 1;
        }
        filled = 0;
        if (block.timestamp < stintEndsAt + STINT) {
            stintEndsAt = stintEndsAt + STINT;
        } else {
            stintEndsAt = uint64(block.timestamp) + STINT;
        }
    }
}
