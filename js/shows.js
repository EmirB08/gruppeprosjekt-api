import { createContainer, createItemCard, createSearchElements, performSearch, displayShowDetails, toggleFavorite, manageFavorites } from "./uiComponents.js";

const apiUrl = "https://api.tvmaze.com/shows";
const itemsPerPage = 18; // Number of items to display per page

let currentPage = 1;
let items = []; // Store items globally

const getItems = async (url, page) => {
    const response = await fetch(`${url}?page=${page}`);
    items = await response.json();
    console.log(items);
    currentPage = 1; // Update the global items variable
    displayItems();
};

const displayItems = () => {
    const container = document.getElementById("items-container") || createContainer("items-container");
    container.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = items.slice(startIndex, endIndex);

    itemsToDisplay.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });

    createPagination();
};

const createPagination = () => { // some error in your function Illakia, must fix, keeping it like it is for now
  const paginationContainer = document.getElementById("pagination-container") || createContainer("pagination-container");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Previous Button
  const prevButton = document.createElement("button");
  prevButton.textContent = "Previous";
  prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
          currentPage--;
          displayItems();
      }
  });
  paginationContainer.appendChild(prevButton);

  
  // Next Button
  const nextButton = document.createElement("button");
  nextButton.textContent = "Next";
  nextButton.addEventListener("click", async () => {
    if (currentPage < totalPages) {
        currentPage++;
        displayItems();
    } else {
        currentPage++;
        await getItems(apiUrl, currentPage);
    }
});
paginationContainer.appendChild(nextButton);
};

window.onpopstate = (event) => { // IMPORTANT: NEEDS TO BE EDITED DEPENDING ON THE HTML - FOR FUTURE REFERENCE
    if (event.state && event.state.show) { // If there's a show in the history state, display it
            displayShowDetails(event.state.show);
    } else {
        const container = document.getElementById("items-container"); //clear the cointainer and display the "default page"
        container.innerHTML = '';
        getItems(apiUrl,currentPage); //only need to change this to the "default" page of shows.js - will fix later for search query logic so that it doesn't display the default page when there's a search in "queue"
    }
};

createSearchElements();
getItems(apiUrl, currentPage);
