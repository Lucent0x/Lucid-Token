const {expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat")

describe("Lucid Token Contract", function(){

    //STATE VARIABLES
    let Token;
    let LucidToken;
    let owner;
    let address1;
    let address2;
    let tokenCap = 21000000;
    let tokenBlockReward = 25;
    

    beforeEach( async function ( ) {
        // Fetch Contract Factory and Signers here.
        Token = await ethers.getContractFactory("LucidToken");
        [owner, address1, address2 ] = await hre.ethers.getSigners();

        LucidToken = await Token.deploy(tokenCap, tokenBlockReward);
    });

    
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await LucidToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await LucidToken.balanceOf(owner.address);
      expect(await LucidToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await LucidToken.cap();
      expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await LucidToken.blockReward();
      expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenBlockReward);
    });
  });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
          // Transfer 50 tokens from owner to address1
          await LucidToken.transfer(address1.address, 50);
          const address1Balance = await LucidToken.balanceOf(address1.address);
          expect(address1Balance).to.equal(50);
    
          // Transfer 50 tokens from address1 to address2
          // We use .connect(signer) to send a transaction from another account
          await LucidToken.connect(address1).transfer(address2.address, 50);
          const address2Balance = await LucidToken.balanceOf(address2.address);
          expect(address2Balance).to.equal(50);
        });
    
        it("Should fail if sender doesn't have enough tokens", async function () {
          const initialOwnerBalance = await LucidToken.balanceOf(owner.address);
          // Try to send 1 token from address1 (0 tokens) to owner (1000000 tokens).
          // `require` will evaluate false and revert the transaction.
          await expect(
            LucidToken.connect(address1).transfer(owner.address, 1)
          ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    
          // Owner balance shouldn't have changed.
          expect(await LucidToken.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
          );
        });
    
    it("Should update balances after transfers", async function () {
        const initialOwnerBalance = await LucidToken.balanceOf(owner.address);
  
        // Transfer 100 tokens from owner to address1.
        await LucidToken.transfer(address1.address, 100);
  
        // Transfer another 50 tokens from owner to address2.
        await LucidToken.transfer(address2.address, 50);
  
        // Check balances.
        const finalOwnerBalance = await LucidToken.balanceOf(owner.address);
        expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));
  
        const address1Balance = await LucidToken.balanceOf(address1.address);
        expect(address1Balance).to.equal(100);
  
        const address2Balance = await LucidToken.balanceOf(address2.address);
        expect(address2Balance).to.equal(50);
      });
    });
});