<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Rating from "./Rating.svelte";
  export let item;

  const WEI_CONVERSION = Math.pow(10, 18);
  const dispatch = createEventDispatcher();

  function openModal() {
    dispatch("openModal", {
      item: item,
    });
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="prod ptr" on:click={openModal} role="listitem">
  <img class="prodImg" src={item.image} alt={item.name} />
  <p class="prodDetails hoverUnder">{item.name}</p>
  <Rating rating={item.rating} />
  <p class="prodDetails">{item.cost / WEI_CONVERSION} ETH</p>
</div>

<style>
  .prodImg {
    width: 300px;
    height: auto;
  }

  .prodDetails {
    font-size: 1.1rem;
    margin: 4px 0;
  }
</style>
