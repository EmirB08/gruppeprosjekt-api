import { getItems, displayItems, createPages, createSearchElements, performSearch, createContainer, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } from './uiComponents.js';

const showsAPI = 'https://api.tvmaze.com/shows';
console.log(showsAPI);

window.onpopstate = (event) => { // IMPORTANT: NEEDS TO BE EDITED DEPENDING ON THE HTML - FOR FUTURE REFERENCE
  if (event.state && event.state.content) { // If there's a show in the history state, display it
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
