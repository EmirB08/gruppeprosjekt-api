import { getItems, displayItems, createPages, createElement, createContainer, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } 
from './uiComponents.js';

const peopleAPI = 'https://api.tvmaze.com/people';

const createSearchElements = () => { // for some reason adding performSearch alone isn't enough, needed to add the createSearchElements aswell for some reason
  const navbar = document.querySelector(".nav-container");
  const insertBeforeElement = navbar.querySelector(".user-container");

  const searchContainer = createElement("div", { className: "search-container" });
  const searchInput = createElement("input", {
      id: "searchInput",
      placeholder: "  Search...",
      className: "search-input",
      onkeydown: (event) => {
          if (event.key === 'Enter') {
              performSearch(searchInput.value);
          }
      }
  });
  const searchButton = createElement("button", {
      className: "search-button",
      textContent: "Search",
      onclick: () => performSearch(searchInput.value)
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);
  navbar.insertBefore(searchContainer, insertBeforeElement);
};

const performSearch = async (query) => { //takes in the query from the search input 
  const response = await fetch(`https://api.tvmaze.com/search/people?q=${query}`); //using the query to search the API search endpoint
  const searchResults = await response.json();
  console.log(searchResults); //
  displayItems(searchResults.map(result => result.person)); //array map the search result, very similar to the displayItems function here
  window.history.pushState({ searchQuery: query }, '', `?search=${encodeURIComponent(query)}`); //update the URL and history state - very neat
};

window.onpopstate = (event) => { // using the history API to update the URL and history state
  if (event.state && event.state.content) { // If there is content in the history state, display it
          displayShowDetails(event.state.content);
  } else {
      const container = document.getElementById("items-container"); //clear the cointainer and display the "default page"
      container.classList.remove('details-view');
      container.innerHTML = '';
      createPages(peopleAPI); // this is the "default", needs to be changed on the other pages to correspond to the "default" page
  }
};

createPages(peopleAPI);
createSearchElements();
