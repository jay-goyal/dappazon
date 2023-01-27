import { ethers } from "hardhat";
import items from "../assets/items.json";

const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

async function main() {
  const [deployer] = await ethers.getSigners();

  const Dappazon = await ethers.getContractFactory("Dappazon");
  const dappazon = await Dappazon.deploy();
  await dappazon.deployed();

  console.log(`Deployed Dappazon Contract at: ${dappazon.address}\n`);

  for (let i = 0; i < items.length; i++) {
    const transaction = await dappazon
      .connect(deployer)
      .add(
        items[i].id,
        items[i].name,
        items[i].category,
        items[i].image,
        tokens(parseFloat(items[i].price)),
        items[i].rating,
        items[i].stock
      );

    await transaction.wait();

    console.log(`Listed item ${items[i].id}: ${items[i].name}`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
