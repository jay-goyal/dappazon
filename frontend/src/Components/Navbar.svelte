<script lang="ts">
  import { account, provider } from "../stores";
  import { ethers } from "ethers";
  import config from "../contracts/config.json";

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

  async function login() {
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
  }

  async function logout() {
    account.logout();
  }
</script>

<nav>
  <h1 class="heading">Dappazon</h1>
  {#if $account === ""}
    <button class="connectBtn ptr" on:click={login}>CONNECT</button>
  {:else}
    <button class="connectBtn ptr" on:click={logout}>{$account}</button>
  {/if}
</nav>

<style>
  nav {
    background: black;
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .heading {
    color: white;
  }

  .connectBtn {
    background-color: yellow;
    border: none;
    font-size: 1rem;
    font-weight: 700;
    outline: none;
    padding: 5px 20px;
  }
</style>
