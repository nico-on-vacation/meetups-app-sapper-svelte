<script context="module">
  export function preload() {
    return this.fetch(
      "https://svelte-meetups-14a4f-default-rtdb.firebaseio.com/meetups.json"
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Fetching meetups failed, please try again later!");
        }
        return res.json();
      })
      .then((data) => {
        const fetchedMeetups = [];
        for (const key in data) {
          fetchedMeetups.push({
            ...data[key],
            id: key,
          });
        }
        return { fetchedMeetups: fetchedMeetups.reverse() };
      })
      .catch((err) => {
        error = err;
        console.log(err);
        this.error(500, "Could not fetch meetups.");
      });
  }
</script>

<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import EditMeetup from "../components/meetup/EditMeetup.svelte";
  import LoadingSpinner from "../components/UI/LoadingSpinner.svelte";
  import Button from "../components/UI/Button.svelte";
  import MeetupFilter from "../components/meetup/MeetupFilter.svelte";
  import MeetupItem from "../components/meetup/MeetupItem.svelte";
  import meetupsStore from "../stores/meetupsStore";

  export let fetchedMeetups;

  let loadedMeetup = [];
  let editedId = null;
  let editMode = false;
  let favsOnly = false;
  let isLoading = true;
  let unsubscribe;

  const dispatch = createEventDispatcher();

  $: filteredMeetups = favsOnly
    ? loadedMeetup.filter((item) => item.isFav)
    : loadedMeetup;

  onMount(() => {
    unsubscribe = meetupsStore.subscribe((items) => (loadedMeetup = items));
    meetupsStore.setMeetups(fetchedMeetups);
    isLoading = false;
  });

  onDestroy(() => unsubscribe && unsubscribe());

  function setFilter(event) {
    console.log("set", event.detail);
    favsOnly = event.detail === 1 ? true : false;
  }

  function saveMeetup() {
    editMode = false;
    editedId = null;
  }

  function startEdit(event) {
    editMode = true;
    editedId = event.detail;
  }

  function cancelEdit() {
    editMode = false;
    editedId = null;
  }

  function startAdd() {
    editMode = true;
  }
</script>

<svelte:head>
  <title>Homepage</title>
</svelte:head>

{#if editMode}
  <EditMeetup id={editedId} on:save={saveMeetup} on:cancel={cancelEdit} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <section class="meetup-controls">
    <MeetupFilter on:select={setFilter} />

    <Button on:click={startAdd}>New Meetup</Button>
  </section>
  {#if filteredMeetups.length === 0}
    <p id="no-meetups">No meetups found. You can be the first to add one.</p>
  {/if}
  <section id="meetups">
    {#each filteredMeetups as { id, title, subtitle, description, imageUrl, address, contactEmail, isFav } (id)}
      <div animate:flip={{ duration: 300 }} transition:scale>
        <MeetupItem
          {id}
          {title}
          {subtitle}
          {description}
          {imageUrl}
          {address}
          {contactEmail}
          {isFav}
          on:edit={startEdit}
        />
      </div>
    {/each}
  </section>
{/if}

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  .meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  #no-meetups {
    margin: 1rem;
  }
</style>
