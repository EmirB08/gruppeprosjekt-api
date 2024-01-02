import { getItems, displayItems, createPages, createSearchElements, performSearch, createContainer, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } from './uiComponents.js';

const showsAPI = 'https://api.tvmaze.com/shows';
console.log(showsAPI);

window.onpopstate = (event) => { // using the history API to update the URL and history state
  if (event.state && event.state.content) { // If there's content in the history state, display it
          displayShowDetails(event.state.content);
  } else {
      const container = document.getElementById("items-container"); //clear the cointainer and display the "default page"
      container.classList.remove('details-view');
      container.innerHTML = '';
      createPages(showsAPI); //only need to change this to the "default" page of shows.js - will fix later for search query logic so that it doesn't display the default page when there's a search in "queue"
  }
};

createPages(showsAPI);
createSearchElements();
