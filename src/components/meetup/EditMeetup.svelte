<script>
  import { createEventDispatcher } from "svelte";
  import Button from "../UI/Button.svelte";
  import InputField from "../UI/InputField.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../../utils/validation";
  import meetupsStore from "../../stores/meetupsStore";

  const dispatch = createEventDispatcher();

  export let id = null;

  let inputMeetup;
  let templateMeetup = {
    title: "",
    subtitle: "",
    address: "",
    imageUrl: "",
    contactEmail: "",
    description: "",
  };

  if (id) {
    const unsubscribe = meetupsStore.subscribe((items) => {
      inputMeetup = items.find((itm) => itm.id === id);
    });
    unsubscribe();
  } else {
    inputMeetup = templateMeetup;
  }

  let formIsValid = false;

  $: titleValid = !isEmpty(inputMeetup.title);
  $: subtitleValid = !isEmpty(inputMeetup.subtitle);
  $: addressValid = !isEmpty(inputMeetup.address);
  $: descriptionValid = !isEmpty(inputMeetup.description);
  $: imageUrlValid = !isEmpty(inputMeetup.imageUrl);
  $: emailValid = isValidEmail(inputMeetup.contactEmail);

  $: formIsValid =
    titleValid &&
    subtitleValid &&
    addressValid &&
    descriptionValid &&
    imageUrlValid &&
    emailValid;

  function handleSubmit() {
    if (id) {
      fetch(
        `https://svelte-meetups-14a4f-default-rtdb.firebaseio.com/meetups/${id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({ ...inputMeetup, isFav: false }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed adding meetup");
          }
          meetupsStore.updateMeetup(id, inputMeetup);
        })
        .catch((e) => console.log(e));
    } else {
      fetch(
        "https://svelte-meetups-14a4f-default-rtdb.firebaseio.com/meetups.json",
        {
          method: "POST",
          body: JSON.stringify({ ...inputMeetup, isFav: false }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed adding meetup");
          }
          return res.json();
        })
        .then((data) => {
          meetupsStore.addMeetup({
            ...inputMeetup,
            isFav: false,
            id: data.name,
          });
        })
        .catch((e) => console.log(e));
    }
    dispatch("save");
  }

  function deleteMeetup() {
    fetch(
      `https://svelte-meetups-14a4f-default-rtdb.firebaseio.com/meetups/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed adding meetup");
        }
        meetupsStore.removeMeetup(id);
      })
      .catch((e) => console.log(e));
    dispatch("save");
  }

  const cancel = () => dispatch("cancel");
</script>

<Modal title="New Meetup" on:cancel>
  <form>
    <InputField
      id="title"
      label="Title"
      valid={titleValid}
      validityMessage="Please enter a valid title."
      value={inputMeetup.title}
      on:input={(e) => (inputMeetup.title = e.target.value)}
    />
    <InputField
      id="subtitle"
      label="Subtitle"
      valid={subtitleValid}
      validityMessage="Please enter a valid subtitle."
      value={inputMeetup.subtitle}
      on:input={(e) => (inputMeetup.subtitle = e.target.value)}
    />
    <InputField
      id="address"
      label="Address"
      valid={addressValid}
      validityMessage="Please enter a valid address."
      value={inputMeetup.address}
      on:input={(e) => (inputMeetup.address = e.target.value)}
    />
    <InputField
      id="imageUrl"
      label="Image Url"
      valid={imageUrlValid}
      validityMessage="Please enter a valid image url."
      value={inputMeetup.imageUrl}
      on:input={(e) => (inputMeetup.imageUrl = e.target.value)}
    />
    <InputField
      id="contactEmail"
      label="Contact Email"
      type="email"
      valid={emailValid}
      validityMessage="Please enter a valid email address."
      value={inputMeetup.contactEmail}
      on:input={(e) => (inputMeetup.contactEmail = e.target.value)}
    />
    <InputField
      id="description"
      label="Description"
      rows={3}
      controlType="textarea"
      valid={descriptionValid}
      validityMessage="Please enter a valid description."
      value={inputMeetup.description}
      on:input={(e) => (inputMeetup.description = e.target.value)}
    />
  </form>
  <div slot="footer">
    <Button on:click={handleSubmit} disabled={!formIsValid}>Save</Button>
    <Button on:click={cancel} mode="outlined">Cancel</Button>
    {#if id}
      <Button on:click={deleteMeetup}>Delete</Button>
    {/if}
  </div>
</Modal>

<style>
  form {
    width: 100%;
  }
</style>
