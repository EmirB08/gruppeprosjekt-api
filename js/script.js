import {
  createContainer,
  displayItems,
  createSearchElements,
  performSearch,
  createItemCard,
  displayShowDetails,
  toggleFavorite,
  manageFavorites,
} from "./uiComponents.js";
const fetchAndDisplayShows = async (showIds) => {
  //changed to display top rated shows from today's schedule, topRatedShows is now scheduled shows
  const showsPromises = showIds.map((id) =>
    fetch(`https://api.tvmaze.com/shows/${id}`).then((res) => res.json())
  ); //map array to get the show ids and fetch the shows from the API
  const shows = await Promise.all(showsPromises);

  const topRatedShows = shows
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 12); // Sort and slice to get top 12 based on rating shows

  displayItems(topRatedShows);
};

const getSchedule = async () => {
  //get the schedule from the API and display the top rated shows
  const scheduleResponse = await fetch("https://api.tvmaze.com/schedule");
  const schedule = await scheduleResponse.json();
  const uniqueShowIds = Array.from(
    new Set(schedule.map((episode) => episode.show.id))
  ); //get unique show ids from the schedule

  fetchAndDisplayShows(uniqueShowIds);
};

window.onpopstate = (event) => {
  // IMPORTANT: NEEDS TO BE EDITED DEPENDING ON THE HTML - FOR FUTURE REFERENCE
  if (event.state && event.state.show) {
    // If there's a show in the history state, display it
    displayShowDetails(event.state.show);
  } else {
    const container = document.getElementById("items-container");
    container.classList.remove('details-view');
    container.innerHTML = "";
    getSchedule(); //calls the getSchedule function to display the "home page" if there's no show in the history state - will fix this later
  }
};

createSearchElements();
getSchedule();
