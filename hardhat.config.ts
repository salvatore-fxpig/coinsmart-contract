import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config"

const mnemonic = process.env.MNEMONIC
const address = process.env.DEPLOYED_ADDRESS!

async function main() {
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

task("read-owner", "Read the owner of the deployed contract")
  .setAction(async (_, { ethers }) => {
    const ContractFactory = await ethers.getContractFactory("CoinSmartTokenTest");
    const contract = ContractFactory.attach(address)
    console.log("owner: ", await contract.callStatic.owner())
  });




task("mint", "Mints tokens")
  .addPositionalParam("to")
  .addPositionalParam("amount")
  .setAction(async ({ to, amount }, { ethers }) => {
    if (!to.startsWith("0x")) throw Error("Invalid 'to' address")
    if (!(+amount > 0)) throw Error("Invalid amount")
    const ContractFactory = await ethers.getContractFactory("CoinSmartTokenTest");
    const contract = ContractFactory.attach(address)
    console.log(await contract.functions.mint(to, amount))
    console.log(`minted ${amount} to ${to}`)
  });

task("send", "Sends tokens")
.addPositionalParam("from")
.addPositionalParam("to")
.addPositionalParam("amount")
.setAction(async ({ from, to, amount }, { ethers }) => {
  if (!from.startsWith("0x")) throw Error("Invalid 'from' address")
  if (!to.startsWith("0x")) throw Error("Invalid 'to' address")
  if (!(+amount > 0)) throw Error("Invalid amount")
  const signers = await ethers.getSigners()
  const signer = signers.find(s => s.address.toLowerCase() === from.toLowerCase())
  if (!signer) throw Error("'from' address is not available")
  const ContractFactory = await ethers.getContractFactory("CoinSmartTokenTest");
  const contract = ContractFactory.attach(address).connect(signer)
  console.log(await contract.functions.transfer(to, amount))
  console.log(`minted ${amount} from ${from} to ${to}`)
});

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic }
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: { mnemonic }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};

export default config;
