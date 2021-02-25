import { writable } from "svelte/store";

const meetupsStore = writable([]);

const customMeetupsStore = {
  subscribe: meetupsStore.subscribe,
  setMeetups: (meetups) => {
    meetupsStore.set(meetups)
  },
  addMeetup: (meetupData) => {
    meetupsStore.update((items) => [meetupData, ...items]);
  },
  updateMeetup: (id, meetupData) => {
    meetupsStore.update((items) => {
      const meetupIndex = items.findIndex((itm) => itm.id === id);
      const updatedMeetup = { ...items[meetupIndex], ...meetupData };
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  removeMeetup: (id) => {
    meetupsStore.update((items) => {
      console.log(id);
      return items.filter((i) => i.id !== id);
    });
  },
  toggleFavourite: (id) => {
    meetupsStore.update((items) => {
      const updatedMeetup = { ...items.find((m) => m.id === id) };
      updatedMeetup.isFav = !updatedMeetup.isFav;
      const meetupIndex = items.findIndex((itm) => itm.id === id);
      return [
        ...items.slice(0, meetupIndex),
        updatedMeetup,
        ...items.slice(meetupIndex + 1, meetups.length),
      ];
    });
  },
};

export default customMeetupsStore;
