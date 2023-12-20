import { getItems, displayItems, createPages, createContainer, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } from './uiComponents.js';

const peopleAPI = 'https://api.tvmaze.com/people';
createPages(peopleAPI);

const createSearchElements = () => { //function to create the search elements and search functionality - will change to dual search functionality later
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const searchInput = document.createElement("input");
  searchInput.id = "searchInput";
  searchInput.placeholder = "Search People";
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
  const response = await fetch(`https://api.tvmaze.com/search/people?q=${query}`); //using the query to search the API search endpoint
  const searchResults = await response.json();
  console.log(searchResults); //
  displayItems(searchResults.map(result => result.person)); //array map the search result, very similar to the displayItems function here
  window.history.pushState({ searchQuery: query }, '', `?search=${encodeURIComponent(query)}`); //update the URL and history state - very neat
};

createSearchElements();