<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { dappazon, provider } from "../stores";
  import Rating from "./Rating.svelte";
  export let item;

  const WEI_CONVERSION = Math.pow(10, 18);
  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch("closeModal");
  }

  async function buyProd() {
    try {
      let tx = await $dappazon
        .connect(await $provider.getSigner())
        .buy(item.id, {
          value: item.cost,
        });
      await tx.wait();
      alert("Purchase Successful");
    } catch (err) {
      alert(err);
    }
  }
</script>

<svelte:window
  on:keyup|preventDefault={(evt) => {
    if (evt.key === "Escape") {
      closeModal();
    }
  }}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="modalCont" on:click={closeModal}>
  <div class="modal" on:click|stopPropagation>
    <img src={item.image} alt={`${item.name} Image`} class="prodImg" />
    <div class="details">
      <div class="prodName">{item.name}</div>
      <Rating rating={item.rating} />
      <div class="purchDet">
        <div class="prodCost">{item.cost / WEI_CONVERSION} ETH</div>
        <div class="purchLeft">
          <span class="prodFreeDel">Free Delivery</span>
          <span class="prodDel">
            {new Date(Date.now() + 345600000).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <button class="btn ptr" on:click|stopPropagation={buyProd}>BUY</button>
      <div class="prodOver">
        <div class="prodOverHead">Overview</div>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque
          ratione pariatur saepe magnam? Modi magni odio aperiam, necessitatibus
          error eaque praesentium, corrupti distinctio exercitationem voluptatem
          minus aliquam nobis. Corrupti corporis reprehenderit delectus non id
          assumenda in incidunt inventore voluptates ducimus nisi debitis
          accusamus, error aut beatae. Libero vitae ullam distinctio!
        </p>
      </div>
    </div>
    <img
      class="modalClose ptr"
      src="/close.svg"
      alt="Close Button"
      on:click|stopPropagation={closeModal}
    />
  </div>
</div>

<style>
  .modalCont {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.1);
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    width: 80vw;
    height: 70vh;
    padding: 60px 20px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
  }

  .prodImg {
    width: 400px;
  }

  .details {
    margin-left: 60px;
    height: 100%;
    flex-grow: 1;
    overflow: scroll;
  }

  .prodName {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .purchDet {
    margin: 20px 0;
    padding: 10px 0;
    border-bottom: grey solid 1px;
    border-top: grey solid 1px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .prodCost {
    font-size: 1.1rem;
    font-weight: 600;
  }

  .prodOverHead {
    font-size: 1.5rem;
    font-family: 700;
    margin-bottom: 8px;
  }

  .purchLeft {
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
  }

  .modalClose {
    width: 15px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .btn {
    padding: 10px 50px;
    font-size: 1.2rem;
    margin-bottom: 15px;
  }
</style>
