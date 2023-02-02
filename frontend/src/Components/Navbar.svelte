<script lang="ts">
  import { account } from "../stores";

  async function login() {
    let accounts: string[] = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    let accountActive = accounts[0];

    account.login(accountActive);
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
    <button class="connectBtn ptr" on:click={logout}
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
  }

  .heading {
    color: white;
    font-size: 1.8rem;
    font-weight: 900;
  }

  .connectBtn {
    background-color: yellow;
    border: none;
    font-size: 1rem;
    font-weight: 900;
    outline: none;
    padding: 5px 20px;
  }
</style>
