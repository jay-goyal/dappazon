<script lang="ts">
  import { connectBlock, setItems } from "../functions";
  import { account, items } from "../stores";

  async function login() {
    let accounts: string[] = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    let accountActive = accounts[0];
    await connectBlock();
    if (Object.keys($items).length === 0) {
      await setItems();
    }

    account.login(accountActive);
  }

  async function logout() {
    account.logout();
  }
</script>

<nav>
  <h1 class="heading">Dappazon</h1>
  {#if $account === ""}
    <button class="btn ptr" on:click={login}>CONNECT</button>
  {:else}
    <button class="btn ptr" on:click={logout}
      >{$account.slice(0, 6)}...{$account.slice(38, 42)}</button
    >
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
    position: sticky;
    top: 0;
  }

  .heading {
    color: white;
    font-size: 1.8rem;
    font-weight: 900;
  }

  .btn {
    font-size: 1rem;
    padding: 5px 20px;
  }
</style>
