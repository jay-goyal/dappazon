<script lang="ts">
  import { Contract, ethers } from "ethers";
  import { onMount } from "svelte";
  import BuyModal from "./Components/BuyModal.svelte";
  import Item from "./Components/Item.svelte";
  import Navbar from "./Components/Navbar.svelte";
  import config from "./contracts/config.json";
  import abi from "./contracts/Dappazon.json";
  import { connectBlock, requestMetamaskSwitch, setItems } from "./functions";
  import { dappazon, items, provider } from "./stores";

  async function initApp() {
    connectBlock();

    // Set Items
    await setItems();
    console.log($items);
  }

  function openModal(evt) {
    isModal = true;
    item = evt.detail.item;
    scrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
  }

  function closeModal() {
    isModal = false;
    scrollY = window.scrollY;
    body.style.position = "static";
    window.scrollTo(0, -1 * scrollY);
  }

  const body = document.body;
  let isModal = false;
  let item;
  let scrollY = 0;
  $: pageStyle = `
    posistion: ${isModal ? "fixed" : "static"};
    top: ${isModal ? `-${scrollY}px` : "0"};
    overflow: ${isModal ? "hidden" : "auto"}
  `;

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
            <Item {item} on:openModal={openModal} />
          {/each}
        </div>
      </div>
    {/each}
  </section>
  {#if isModal}
    <BuyModal {item} on:closeModal={closeModal} />
  {/if}
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
