<script lang="ts">
  import abi from "./contracts/Dappazon.json";
  import config from "./contracts/config.json";
  import { Contract, ethers } from "ethers";
  import { provider, items } from "./stores";
  import Navbar from "./Components/Navbar.svelte";
  import { onMount } from "svelte";
  import Item from "./Components/Item.svelte";

  // Change Chain to Goerli
  async function requestMetamaskSwitch(): Promise<boolean> {
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

  async function initApp() {
    // Connect to blockchain
    let providerLocal = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );
    const network = await providerLocal.getNetwork();
    if (!(network.chainId in config)) {
      if (await requestMetamaskSwitch()) {
        providerLocal = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
      } else {
        alert("Linking to Metamask failed");
      }
    }
    provider.setProvider(providerLocal);

    // Get contract ABI
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon,
      abi.abi,
      $provider
    );

    for (let i = 1; i <= 9; i++) {
      const item = await dappazon.items(i);
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
    console.log($items);
  }

  onMount(() => {
    items.set({});
    initApp();
  });
</script>

<main>
  <Navbar />
  <section class="prods">
    <div class="sectionHead">Dappazon Best Sellers</div>
    {#each Object.keys($items) as cat, idx (idx)}
      <div class="prodsCat">
        <div class="catName">{cat.charAt(0).toUpperCase()}{cat.slice(1)}</div>
        <div class="prodsCont">
          {#each $items[cat] as item, i (i)}
            <Item {item} />
          {/each}
        </div>
      </div>
    {/each}
  </section>
</main>

<style>
  .prods {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }

  .sectionHead {
    font-size: 2rem;
    align-self: start;
    margin: 10px 10vw;
    font-weight: 700;
  }

  .prodsCat {
    width: 80vw;
    margin: 20px 0;
  }

  .catName {
    width: 100%;
    border-bottom: grey solid 1px;
    font-size: 1.2rem;
    margin-bottom: 20px;
    font-weight: 700;
  }

  .prodsCont {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
