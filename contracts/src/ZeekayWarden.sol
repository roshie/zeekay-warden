// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Interface to PlonkVerifier.sol
interface IPlonkVerifier {
    function verifyProof(bytes memory proof, uint[] memory pubSignals) external view returns (bool);
}

contract ZeekayWarden is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;
    address public s_plonkVerifierAddress;
    uint256 public PLATFORM_FEE;
    string chainName;
    uint256 public _nextTokenId = 1;

    event MemberVerified(bool result);
    event WardenCreated(bool result);
    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);

    struct Membership {
        string[] roles;
        string platformUID;
    }

    struct Warden {
        string name;
        address owner;
        string[3][] roles;
        uint256[2] tokenIdRange;
    }

    // ServerID => Warden
    mapping(string => Warden) public wardens;
    // Member address => roles
    mapping(address => mapping(string => Membership)) public members;
    // Owners => wardens-name[]
    mapping(address => string[]) public owners;

    constructor(address plonkVerifierAddress, uint256 _platformFee, string memory _chainName, address initialOwner) 
        ERC721("WardenNFT", "WSBT")
        Ownable(initialOwner) 
    {
        s_plonkVerifierAddress = plonkVerifierAddress;
        PLATFORM_FEE = _platformFee;
        chainName = _chainName;
    }


    function getUserRoles(string memory serverId) public view returns (string[] memory) {
        require(bytes(members[msg.sender][serverId].platformUID).length > 0, "User not found");
        return members[msg.sender][serverId].roles;
    }


    function getRolesofServer(string memory serverId) public view returns (string memory, string[3][] memory) {
        require(bytes(wardens[serverId].name).length > 0, "Server not found");
        string memory name = wardens[serverId].name;
        string[3][] memory roles = wardens[serverId].roles;
        return (name, roles);
    }

    // ZK proof is generated in the browser and submitted as a transaction w/ the proof as bytes.
    function submitProofAndAddUser(bytes memory proof, uint256[] memory pubSignals, string[] memory data, string[] memory roles) public returns (bool) {
        bool result = IPlonkVerifier(s_plonkVerifierAddress).verifyProof(proof, pubSignals);

        if (result) {
            addUser(data, roles);
        }
        // Emit event
        emit MemberVerified(result);
        return result;
    }

    function addUser(string[] memory data, string[] memory roles) private {
        address user = msg.sender;
        string memory serverId = data[0];
        string memory platformUID = data[1];
        Membership memory member = Membership({platformUID: platformUID, roles: roles});
        members[user][serverId] = member;
    }

    // Call this function before assigning roles. 
    function checkUser(string memory platformUID, string memory serverId) public view returns (bool) {
        string memory _puid = members[msg.sender][serverId].platformUID;
        return keccak256(abi.encodePacked(_puid)) == keccak256(abi.encodePacked(platformUID));
    }

    function createWarden(string memory serverId, string memory wardenName, string[3][] memory roles) public {
        require(!(bytes(wardens[serverId].name).length > 0), "Server already exists");

        uint256[2] memory _tokenIdRange;
        Warden memory newWarden = Warden({name: wardenName, owner: msg.sender, roles: roles, tokenIdRange: _tokenIdRange});
        wardens[serverId] = newWarden;
        owners[msg.sender].push(wardenName);
        emit WardenCreated(true);
    }

    function mintSBTAndCreateWarden(
            string memory serverId, 
            string memory wardenName,
            string[3][] memory roles, 
            address[] memory memberAddresses, 
            string memory tokenUri
     )  external payable {

        require(msg.value >= PLATFORM_FEE, "Insufficient platform fee");
        require(!(bytes(wardens[serverId].name).length > 0), "Server already exists");
        require(memberAddresses.length > 0, "No memberAddresses provided");

        uint256 tokenIdStart = _nextTokenId;

        uint256 counter = tokenIdStart;
        for (uint256 i = 0; i < memberAddresses.length; i++) {
            _mint(memberAddresses[i], counter);
            _setTokenURI(counter, tokenUri);
            counter++;
        }
        uint256 tokenIdEnd = counter - 1;

        for (uint256 i = 0; i < roles.length; i++) {
            if (keccak256(abi.encodePacked(roles[i][1])) == keccak256("SBT")) {
                roles[i][2] = append(chainName, "/", toAsciiString(address(0)), "/", Strings.toString(tokenIdStart), "-", Strings.toString(tokenIdEnd));
            }
        }
        _nextTokenId = tokenIdEnd + 1;
        
        Warden memory newWarden = Warden({name: wardenName, owner: msg.sender, roles: roles, tokenIdRange: [tokenIdStart, tokenIdEnd]});
        wardens[serverId] = newWarden;
        owners[msg.sender].push(wardenName);

        emit WardenCreated(true);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        require(
            from == address(0) || to == address(0),
            "You cannot transfer this token"
        );
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        if (from == address(0)) {
            emit Attest(to, tokenId);
        } else if (to == address(0)) {
            emit Revoke(to, tokenId);
        }
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function append(string memory a, string memory b, string memory c, string memory d, string memory e, string memory f, string memory g) internal pure returns (string memory) {
        return string(abi.encodePacked(a, b, c, d, e, f, g));
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    function getTokenBalance(address token_address) public view returns (uint256) {
        uint256 tokenbalance = IERC20(token_address).balanceOf(address(this));
        return tokenbalance;
    }

}   