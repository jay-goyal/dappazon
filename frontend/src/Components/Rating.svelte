<script lang="ts">
  export let rating: number;
</script>

<div class="rating">
  {#each { length: rating } as _, idx (idx)}
    <img src="/stars/starFill.svg" alt="Star Filled" class="star" />
  {/each}
  {#each { length: 5 - rating } as _, idx (idx)}
    <img src="/stars/starEmpty.svg" alt="Star Empty" class="star" />
  {/each}
</div>

<style>
  .star {
    widows: 20px;
    height: 20px;
  }
</style>
