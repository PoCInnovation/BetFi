// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC4626 {
    function deposit(uint256 assets, address receiver) external returns (uint256 shares);
    function maxWithdraw(address owner) external view returns (uint256);
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256 shares);
    function balanceOf(address account) external view returns (uint256);
    function previewRedeem(uint256 shares) external view returns (uint256 assets);
    function maxDeposit(address receiver) external view returns (uint256);
    function asset() external view returns (address);
}