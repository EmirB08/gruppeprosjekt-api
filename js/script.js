import { createContainer, displayItems, createSearchElements, performSearch, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } 
from "./uiComponents.js";

const fetchAndDisplayShows = async (showIds) => {
  const showsPromises = showIds.map((id) => //map array to get the show ids and fetch the shows from the API
    fetch(`https://api.tvmaze.com/shows/${id}`).then((res) => res.json())
    ); 
  const shows = await Promise.all(showsPromises);

  const topRatedShows = shows
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 20); // Sort and slice to get top 12 based on rating shows

  displayItems(topRatedShows);
};

const getSchedule = async () => { //get the schedule from the API and display the top rated shows
  const scheduleResponse = await fetch("https://api.tvmaze.com/schedule");
  const schedule = await scheduleResponse.json();
  const uniqueShowIds = Array.from(
    new Set(schedule.map((episode) => episode.show.id)) //get unique show ids from the schedule
  );

  fetchAndDisplayShows(uniqueShowIds);
};

window.onpopstate = (event) => { // using the history API to update the URL and history state
  if (event.state && event.state.content) { // if there's content in the history state, display it
    displayShowDetails(event.state.show);
  } else {
    const container = document.getElementById("items-container"); //clear the cointainer and display the "default page"
    container.classList.remove('details-view');
    container.innerHTML = "";
    getSchedule(); // this is the "default", needs to be changed on the other pages to correspond to the "default" page
  }
};

createSearchElements();
getSchedule();
