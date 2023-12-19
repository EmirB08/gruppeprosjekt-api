import { createContainer, createItemCard, createSearchElements, performSearch } from "./uiComponents.js";

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



const createPagination = () => {
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
        const container = document.getElementById("items-container");
        container.innerHTML = '';
        getItems(apiUrl, currentPage); //calls the getSchedule function to display the "home page" if there's no show in the history state
    }
};

// Create search elements and fetch shows when the page loads
createSearchElements();
getItems(apiUrl, currentPage);
