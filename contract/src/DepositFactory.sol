// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {DepositWallet} from "./DepositWallet.sol";
contract DepositFactory is Ownable {
    using SafeERC20 for IERC20;
    address public immutable implementation;
    address public treasury;

    mapping(uint256 => bool) public withdrawn;
    event Withdrawn(
        uint256 indexed withdrawalId,
        address indexed token,
        address indexed to,
        uint256 amount
    );
    constructor(address _treasury) Ownable(msg.sender) {
        implementation = address(new DepositWallet());
        treasury = _treasury;
    }
    function _salt(uint256 userId) internal pure returns (bytes32) {
        return keccak256(abi.encode(userId));
    }
    function predict(uint256 userId) public view returns (address) {
        return
            Clones.predictDeterministicAddress(
                implementation,
                _salt(userId),
                address(this)
            );
    }
    function _wallet(uint256 userId) internal returns (DepositWallet) {
        address payable w = payable(predict(userId));
        if (w.code.length == 0) {
            Clones.cloneDeterministic(implementation, _salt(userId));
            DepositWallet(w).init(address(this));
        }
        return DepositWallet(w);
    }
    function sweep(uint256 userId, IERC20 token) external onlyOwner {
        _wallet(userId).sweep(token, treasury);
    }
    function sweepETH(uint256 userId) external onlyOwner {
        _wallet(userId).sweepETH(payable(treasury));
    }
    function setTreasury(address t) external onlyOwner {
        treasury = t;
    }
    receive() external payable {}
    function withdraw(
        uint256 withdrawalId,
        address token,
        address payable to,
        uint256 amount
    ) external onlyOwner {
        require(!withdrawn[withdrawalId], "already withdrawn");
        require(to != address(0), "zero address");
        require(amount > 0, "zero amount");
        withdrawn[withdrawalId] = true;
        if (token == address(0)) {
            require(address(this).balance >= amount, "insufficient ETH");
            (bool ok, ) = to.call{value: amount}("");
            require(ok, "eth transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
        emit Withdrawn(withdrawalId, token, to, amount);
    }
}
