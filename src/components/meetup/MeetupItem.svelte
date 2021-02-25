<script>
  import { goto } from "@sapper/app";
  import { createEventDispatcher } from "svelte";
  import meetupsStore from "../../stores/meetupsStore";
  import Badge from "../UI/Badge.svelte";
  import Button from "../UI/Button.svelte";

  const dispatch = createEventDispatcher();

  export let address;
  export let contactEmail;
  export let description;
  export let id;
  export let imageUrl;
  export let isFav;
  export let subtitle;
  export let title;

  let isLoading;

  function toggleFavourite() {
    isLoading = true;
    fetch(
      `https://svelte-meetups-14a4f-default-rtdb.firebaseio.com/meetups/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify({ isFav: !isFav }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed adding meetup");
        }
        meetupsStore.toggleFavourite(id);
      })
      .catch((e) => {throw new Error(e)})
      .finally(() => (isLoading = false));
  }
</script>

<article>
  <header>
    <h1>
      {title}
      {#if isFav}
        <Badge>Favourite</Badge>
      {/if}
    </h1>
    <h2>{subtitle}</h2>
    <p>{address} - {contactEmail}</p>
  </header>
  <div class="image">
    <img src={imageUrl} alt="" />
  </div>
  <div class="content">
    <p>{description}</p>
  </div>
  <footer>
    <Button mode="outlined" on:click={() => dispatch("edit", id)}>Edit</Button>
    <Button href={`/meetup/${id}`}>Show Details</Button>

    <Button
      color={isFav ? null : "success"}
      mode="outline"
      on:click={toggleFavourite}
    >
      {#if isLoading}
        <span>Loading...</span>
      {:else}
        {isFav ? "Unfavourite" : "Favourite"}
      {/if}
    </Button>
  </footer>
</article>

<style>
  article {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    border-radius: 5px;
    background: white;
    margin: 1rem;
  }

  header,
  .content,
  footer {
    padding: 1rem;
  }

  .image {
    width: 100%;
    height: 14rem;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  h1 {
    font-size: 1.25rem;
    margin: 0.5rem 0;
    font-family: "Roboto Slab", sans-serif;
  }

  /* h1.is-favorite {
    background: #01a129;
    color: white;
    padding: 0 0.5rem;
    border-radius: 5px;
  } */

  h2 {
    font-size: 1rem;
    color: #808080;
    margin: 0.5rem 0;
  }

  p {
    font-size: 1.25rem;
    margin: 0;
  }

  div {
    text-align: right;
  }
</style>
