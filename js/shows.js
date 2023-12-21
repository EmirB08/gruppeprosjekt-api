import { getItems, displayItems, createPages, createContainer, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } from './uiComponents.js';

const showsAPI = 'https://api.tvmaze.com/shows';


const createSearchElements = () => { //function to create the search elements and search functionality - will change to dual search functionality later
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const searchInput = document.createElement("input");
  searchInput.id = "searchInput";
  searchInput.placeholder = "Search Shows";
  searchInput.className = "search-input";

  const searchButton = document.createElement("button");
  searchButton.textContent = "Search";
  searchButton.className = "search-button";
  searchButton.addEventListener("click", () => performSearch(searchInput.value)); // will include enter key functionality later

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);
  document.body.appendChild(searchContainer); // appending everything
};

const performSearch = async (query) => { //takes in the query from the search input 
  const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`); //using the query to search the API search endpoint
  const searchResults = await response.json();
  console.log(searchResults); //
  displayItems(searchResults.map(result => result.person)); //array map the search result, very similar to the displayItems function here
  window.history.pushState({ searchQuery: query }, '', `?search=${encodeURIComponent(query)}`); //update the URL and history state - very neat
};

window.onpopstate = (event) => { // IMPORTANT: NEEDS TO BE EDITED DEPENDING ON THE HTML - FOR FUTURE REFERENCE
  if (event.state && event.state.content) { // If there's a show in the history state, display it
          displayShowDetails(event.state.content);
  } else {
      const container = document.getElementById("items-container"); //clear the cointainer and display the "default page"
      container.innerHTML = '';
      createPages(showsAPI); //only need to change this to the "default" page of shows.js - will fix later for search query logic so that it doesn't display the default page when there's a search in "queue"
  }
};

createPages(showsAPI);
createSearchElements();
