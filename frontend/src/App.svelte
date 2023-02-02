<script lang="ts">
  import { onMount } from "svelte";
  import BuyModal from "./Components/BuyModal.svelte";
  import Item from "./Components/Item.svelte";
  import Navbar from "./Components/Navbar.svelte";
  import { connectBlock, setItems } from "./functions";
  import { items } from "./stores";

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
    {:else}
      <h1>Connect Metamask</h1>
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
