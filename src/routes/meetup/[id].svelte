<script context="module">
  export function preload(page) {
    return this.fetch(
      `https://svelte-meetups-14a4f-default-rtdb.firebaseio.com/meetups/${page.params.id}.json`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fetching meetups failed, please try again later!");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        return { fetchedMeetup: { ...data, id: page.params.id } };
      })
      .catch((err) => {
        this.error(500, "Could not fetch meetups.");
      });
  }
</script>

<script>
  import Button from "../../components/UI/Button.svelte";

  export let fetchedMeetup;
  let error = null;

  $: error = !fetchedMeetup;
  console.log("fetched Meetup", fetchedMeetup);
</script>

{#if error}
  <p>meetup not found</p>
{:else}
  <section>
    <div class="image">
      <img src={fetchedMeetup.imageUrl} alt={fetchedMeetup.title} />
    </div>
    <div class="content">
      <h1>{fetchedMeetup.title}</h1>
      <h2>{fetchedMeetup.subtitle} - {fetchedMeetup.address}</h2>
      <p>{fetchedMeetup.description}</p>
      <Button href="mailto:{fetchedMeetup.contactEmail}">Contact</Button>
      <Button mode="outline" href="/">Close</Button>
    </div>
  </section>
{/if}

<style>
  section {
    margin-top: 4rem;
  }

  .image {
    width: 100%;
    height: 25rem;
  }

  img {
    height: 100%;
    object-fit: cover;
    width: 100%;
  }

  .image {
    background: #e7e7e7;
  }

  .content {
    text-align: center;
    width: 80%;
    margin: auto;
  }

  h1 {
    font-family: "Roboto Slab", sans-serif;
    font-size: 2rem;
    margin: 0.5rem 0;
  }

  h2 {
    font-size: 1.25rem;
    color: #6b6b6b;
  }

  p {
    font-size: 1.5rem;
  }
</style>
