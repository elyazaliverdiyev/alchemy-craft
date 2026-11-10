// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AlchemyProofOfWorkRegistry
 * @author Elyaz Aliverdiyev (@StratAlchemy) — HabitAI Technologies
 * @notice On-Chain Proof-of-Work Quest Chain & Life RPG Registry for the Alchemy Craft Obsidian Plugin.
 * @dev Designed for zero-cost deployment on Base Sepolia Testnet (Chain ID: 84532, https://sepolia.base.org)
 *      and ultra-low-gas L2 mainnets (Base Mainnet Chain ID: 8453, opBNB, Arbitrum One, Polygon).
 *
 * Architecture:
 * 1. Inside Obsidian, every completed task, daily lever, or focus sprint mines a local SHA-256 block
 *    linked to the previous block's hash (`prevHash -> currentHash`) with zero gas friction.
 * 2. At any milestone (e.g., daily, weekly, or on completing a 1-Month Boss Fight), the user anchors
 *    their latest `chainRootHash`, `blockCount`, `totalXp`, and `level` on-chain via `anchorQuestChainRoot`.
 * 3. Anyone can verify an Alchemist's Proof-of-Work certificate via `verifyAlchemistProof`.
 */
contract AlchemyProofOfWorkRegistry {
    struct AlchemistProfile {
        bytes32 latestChainRootHash;
        uint64 totalBlocksMined;
        uint64 totalXp;
        uint32 level;
        uint32 anchorCount;
        uint64 lastAnchoredAt;
        bool isPatron;
        string vaultTag;
    }

    struct AnchorRecord {
        bytes32 chainRootHash;
        uint64 blockCount;
        uint64 totalXp;
        uint32 level;
        uint64 timestamp;
        string noteOrBossTitle;
    }

    address public immutable owner;
    uint256 public totalAlchemists;
    uint256 public totalGlobalAnchors;

    mapping(address => AlchemistProfile) public profiles;
    mapping(address => AnchorRecord[]) private _anchorHistory;
    mapping(bytes32 => address) public hashToAlchemist;
    mapping(bytes32 => uint64) public hashTimestamp;

    event QuestChainAnchored(
        address indexed alchemist,
        bytes32 indexed chainRootHash,
        uint64 blockCount,
        uint64 totalXp,
        uint32 level,
        string vaultTag,
        uint64 timestamp
    );

    event PatronStatusUpdated(address indexed alchemist, bool isPatron, uint64 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "AlchemyRegistry: caller is not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Anchors the latest SHA-256 Quest Chain root hash from the Alchemy Craft Obsidian plugin.
     * @param chainRootHash The latest SHA-256 block hash from the user's Obsidian Quest Chain (`0x...`).
     * @param blockCount Total number of SHA-256 quest blocks in the user's chain.
     * @param totalXp Total Life RPG XP accumulated by the user.
     * @param level Current Life RPG level.
     * @param vaultTag Optional public alias, note title, or 1-Month Boss Fight name.
     */
    function anchorQuestChainRoot(
        bytes32 chainRootHash,
        uint64 blockCount,
        uint64 totalXp,
        uint32 level,
        string calldata vaultTag
    ) external {
        require(chainRootHash != bytes32(0), "AlchemyRegistry: empty root hash");
        require(blockCount > 0, "AlchemyRegistry: blockCount must be > 0");

        AlchemistProfile storage prof = profiles[msg.sender];
        if (prof.lastAnchoredAt == 0) {
            totalAlchemists += 1;
        }

        prof.latestChainRootHash = chainRootHash;
        prof.totalBlocksMined = blockCount;
        prof.totalXp = totalXp;
        prof.level = level;
        prof.anchorCount += 1;
        prof.lastAnchoredAt = uint64(block.timestamp);
        if (bytes(vaultTag).length > 0 && bytes(vaultTag).length <= 96) {
            prof.vaultTag = vaultTag;
        }

        _anchorHistory[msg.sender].push(
            AnchorRecord({
                chainRootHash: chainRootHash,
                blockCount: blockCount,
                totalXp: totalXp,
                level: level,
                timestamp: uint64(block.timestamp),
                noteOrBossTitle: vaultTag
            })
        );

        if (hashToAlchemist[chainRootHash] == address(0)) {
            hashToAlchemist[chainRootHash] = msg.sender;
            hashTimestamp[chainRootHash] = uint64(block.timestamp);
        }

        totalGlobalAnchors += 1;

        emit QuestChainAnchored(
            msg.sender,
            chainRootHash,
            blockCount,
            totalXp,
            level,
            vaultTag,
            uint64(block.timestamp)
        );
    }

    /**
     * @notice Verifies whether a specific SHA-256 Quest Chain hash was anchored on-chain.
     * @param expectedHash The SHA-256 hash (`0x...`) from an exported Obsidian Proof-of-Work certificate.
     * @return verified True if the hash is recorded on-chain.
     * @return alchemist The wallet address that anchored the hash.
     * @return anchoredAt Unix timestamp when the hash was anchored.
     */
    function verifyAlchemistProof(bytes32 expectedHash)
        external
        view
        returns (bool verified, address alchemist, uint64 anchoredAt)
    {
        alchemist = hashToAlchemist[expectedHash];
        anchoredAt = hashTimestamp[expectedHash];
        verified = (alchemist != address(0));
    }

    /**
     * @notice Returns the total number of on-chain checkpoints anchored by an Alchemist.
     */
    function getAnchorHistoryCount(address alchemist) external view returns (uint256) {
        return _anchorHistory[alchemist].length;
    }

    /**
     * @notice Returns a specific historical anchor checkpoint for an Alchemist.
     */
    function getAnchorRecord(address alchemist, uint256 index)
        external
        view
        returns (AnchorRecord memory)
    {
        require(index < _anchorHistory[alchemist].length, "AlchemyRegistry: index out of bounds");
        return _anchorHistory[alchemist][index];
    }

    /**
     * @notice Allows the studio owner to grant Verified On-Chain Patron status to Pro supporters.
     */
    function setPatronStatus(address alchemist, bool status) external onlyOwner {
        profiles[alchemist].isPatron = status;
        emit PatronStatusUpdated(alchemist, status, uint64(block.timestamp));
    }
}
