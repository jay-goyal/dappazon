<script lang="ts">
  import Rating from "./Rating.svelte";
  const WEI_CONVERSION = Math.pow(10, 18);
  export let item;
</script>

<div class="prod ptr">
  <img class="prodImg" src={item.image} alt={item.name} />
  <p class="prodDetails hoverUnder">{item.name}</p>
  <Rating rating={item.rating} />
  <p class="prodDetails">{item.cost / WEI_CONVERSION} ETH</p>
</div>

<style>
  .prodImg {
    width: 20vw;
    height: auto;
  }

  .prodDetails {
    font-size: 1.1rem;
    margin: 4px 0;
  }
</style>
