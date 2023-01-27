import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import { beforeEach } from "mocha";
import { Dappazon } from "../typechain-types";

const tokens = (n: number) => ethers.utils.parseUnits(n.toString(), "ether");

const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 5;
const STOCK = 5;

describe("Dappazon", () => {
  let dappazon: Dappazon, deployer: SignerWithAddress, buyer: SignerWithAddress;
  beforeEach(async () => {
    // Setup Accounts
    [deployer, buyer] = await ethers.getSigners();

    // Deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transaction: ContractTransaction;

    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .add(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });

    it("Returns items attibutes", async () => {
      const item = await dappazon.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emits Add event", async () => {
      expect(transaction).to.emit(dappazon, "Add");
    });

    it("Only user can deploy", async () => {
      await expect(
        dappazon
          .connect(buyer)
          .add(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Buying", () => {
    let transaction: ContractTransaction;

    beforeEach(async () => {
      // List an item
      transaction = await dappazon
        .connect(deployer)
        .add(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy an item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
    });

    it("Updates buyers order count", async () => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.equal(1);
    });

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1);

      expect(order.time).to.be.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    });

    it("Updates stock", async () => {
      const item = await dappazon.items(ID);
      const order = await dappazon.orders(buyer.address, 1);
      expect(item.stock).to.equal(STOCK - 1);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(COST);
    });

    it("Emits Buy event", async () => {
      expect(transaction).to.emit(dappazon, "Buy");
    });
  });

  describe("Withdrawing", async () => {
    let balanceBefore: BigNumber;

    beforeEach(async () => {
      // List an item
      let transaction = await dappazon
        .connect(deployer)
        .add(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();

      // Buy an item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();

      // Get deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // Withdraw
      transaction = await dappazon.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates owner balance", async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });

    it("Updates contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.be.equal(0);
    });
  });
});
