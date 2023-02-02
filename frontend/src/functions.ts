import { Contract, ethers } from "ethers";
import abi from "./contracts/Dappazon.json";
import config from "./contracts/config.json";
import { dappazon, items, provider } from "./stores";

// Change Chain to Goerli
export async function requestMetamaskSwitch(): Promise<boolean> {
  try {
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x5" }],
    });
    return true;
  } catch (err) {
    if (err.code === 4902) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x5",
              rpcUrl: "https://goerli.infura.io/v3/",
            },
          ],
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  }
}

// Set Items from global dappazon store
export async function setItems() {
  let contract: ethers.Contract;
  const unsubscribe = dappazon.subscribe((value) => {
    contract = value;
  });
  for (let i = 1; i <= 9; i++) {
    const item = await contract.items(i);
    items.update((oldItems) => {
      let newItems = oldItems;
      let cat = [];
      if (item.category in oldItems) {
        cat = oldItems[item.category];
      }
      cat.push(item);
      newItems[item.category] = cat;
      return newItems;
    });
  }
  unsubscribe();
}

export async function connectBlock() {
  let providerLocal = new ethers.providers.Web3Provider(
    (window as any).ethereum
  );
  let network = await providerLocal.getNetwork();
  if (!(network.chainId in config)) {
    if (await requestMetamaskSwitch()) {
      providerLocal = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      network = await providerLocal.getNetwork();
    } else {
      alert("Linking to Metamask failed");
    }
  }
  provider.setProvider(providerLocal);

  // Get contract ABI
  dappazon.setDappazon(
    new Contract(
      config[network.chainId].dappazon,
      abi.abi,
      providerLocal.getSigner()
    )
  );
}
