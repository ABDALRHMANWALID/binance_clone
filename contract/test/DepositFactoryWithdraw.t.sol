// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {DepositFactory} from "../src/DepositFactory.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Mock", "MCK") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

// a recipient that refuses ETH
contract RejectsEth {
    receive() external payable {
        revert("no ETH");
    }
}

contract DepositFactoryWithdrawTest is Test {
    DepositFactory factory;
    MockToken token;

    address user = makeAddr("user");
    address stranger = makeAddr("stranger");
    address treasury = makeAddr("treasury");

    function setUp() public {
        // this test contract deploys the factory, so it is the owner
        factory = new DepositFactory(treasury);
        token = new MockToken();
    }

    function test_withdrawETH_paysTheUserAndEmits() public {
        vm.deal(address(factory), 3 ether);

        vm.expectEmit(true, true, true, true, address(factory));
        emit DepositFactory.Withdrawn(1, address(0), user, 1 ether);

        factory.withdraw(1, address(0), payable(user), 1 ether);

        assertEq(user.balance, 1 ether);
        assertEq(address(factory).balance, 2 ether);
        assertTrue(factory.withdrawn(1));
    }

    function test_withdrawToken_paysTheUser() public {
        token.mint(address(factory), 1000);

        factory.withdraw(2, address(token), payable(user), 400);

        assertEq(token.balanceOf(user), 400);
        assertEq(token.balanceOf(address(factory)), 600);
        assertTrue(factory.withdrawn(2));
    }

    function test_sameWithdrawalIdCannotBePaidTwice() public {
        vm.deal(address(factory), 3 ether);

        factory.withdraw(1, address(0), payable(user), 1 ether);

        vm.expectRevert("already withdrawn");
        factory.withdraw(1, address(0), payable(user), 1 ether);

        assertEq(user.balance, 1 ether); // paid once only
    }

    function test_onlyOwnerCanWithdraw() public {
        vm.deal(address(factory), 1 ether);

        vm.prank(stranger);
        vm.expectRevert();
        factory.withdraw(1, address(0), payable(stranger), 1 ether);

        assertEq(stranger.balance, 0);
    }

    function test_revertsWhenTheFactoryHasNotEnoughETH() public {
        vm.deal(address(factory), 1 ether);

        vm.expectRevert("insufficient ETH");
        factory.withdraw(1, address(0), payable(user), 2 ether);
    }

    function test_rejectsZeroAddressAndZeroAmount() public {
        vm.deal(address(factory), 1 ether);

        vm.expectRevert("zero address");
        factory.withdraw(1, address(0), payable(address(0)), 1 ether);

        vm.expectRevert("zero amount");
        factory.withdraw(1, address(0), payable(user), 0);
    }

    // a failed payment must not burn the id: the same withdrawal can be retried
    function test_failedPaymentCanBeRetriedWithTheSameId() public {
        vm.deal(address(factory), 1 ether);
        RejectsEth bad = new RejectsEth();

        vm.expectRevert("eth transfer failed");
        factory.withdraw(5, address(0), payable(address(bad)), 1 ether);
        assertFalse(factory.withdrawn(5));

        factory.withdraw(5, address(0), payable(user), 1 ether);
        assertTrue(factory.withdrawn(5));
        assertEq(user.balance, 1 ether);
    }

    // the whole path: deposit wallet -> sweep into the factory -> pay the user
    function test_sweepIntoTheFactoryThenWithdraw() public {
        factory.setTreasury(address(factory));

        address wallet = factory.predict(1);
        vm.deal(wallet, 1 ether); // the user's deposit
        factory.sweepETH(1);
        assertEq(address(factory).balance, 1 ether);

        factory.withdraw(9, address(0), payable(user), 0.4 ether);

        assertEq(user.balance, 0.4 ether);
        assertEq(address(factory).balance, 0.6 ether);
    }
}
