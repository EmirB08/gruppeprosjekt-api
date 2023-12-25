import { getItems, displayItems, createPages, createSearchElements, createContainer, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } from './uiComponents.js';

const peopleAPI = 'https://api.tvmaze.com/people';

const performSearch = async (query) => { //takes in the query from the search input 
  const response = await fetch(`https://api.tvmaze.com/search/people?q=${query}`); //using the query to search the API search endpoint
  const searchResults = await response.json();
  console.log(searchResults); //
  displayItems(searchResults.map(result => result.person)); //array map the search result, very similar to the displayItems function here
  window.history.pushState({ searchQuery: query }, '', `?search=${encodeURIComponent(query)}`); //update the URL and history state - very neat
};

window.onpopstate = (event) => { // IMPORTANT: NEEDS TO BE EDITED DEPENDING ON THE HTML - FOR FUTURE REFERENCE
  if (event.state && event.state.content) { // If there's a show in the history state, display it
          displayShowDetails(event.state.content);
  } else {
      const container = document.getElementById("items-container"); //clear the cointainer and 
      container.classList.remove('details-view');
      container.innerHTML = '';
      createPages(peopleAPI); //only need to change this to the "default" page of shows.js - will fix later for search query logic so that it doesn't display the default page when there's a search in "queue"
  }
};

createPages(peopleAPI);
createSearchElements();
