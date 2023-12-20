import {
  createContainer,
  createItemCard,
  displayShowDetails,
  createSearchElements,
  toggleFavorite,
  manageFavorites,
} from "./uiComponents.js";

const displayItems = (items, page, pageSize) => {
  //function to display the items
  const container =
    document.getElementById("items-container") ||
    createContainer("items-container"); // container to display the items, if it doesn't exist create it using the createContainer function
  container.innerHTML = "";

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const itemsToShow = items.slice(startIndex, endIndex);
  items.forEach((item) => {
    const card = createItemCard(item);
    container.appendChild(card);
  });
};
/* ------------
!!! Search !!!
------------- */
// Function to perform the search
const performSearch = async (query, page = 1, pageSize = 20) => {
  // this is very intense on the API, will need to be changed Andre
  if (query.trim() === "") {
    getItems(apiUrl, page, pageSize);
  } else {
    const response = await fetch(
      `https://api.tvmaze.com/search/people?q=${query}&page=${page}&size=${pageSize}`
    );
    const searchResults = await response.json();
    displayItems(
      searchResults.map((result) => result.person),
      page,
      pageSize
    );
  }
};
// Event listener for the search input
const searchInput = document.querySelector("[data-search]");
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  performSearch(value);
});
// Event listener for the search button
const searchButton = document.getElementById("Search");
searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value.toLowerCase();
  performSearch(searchValue);
});
/* ------------
!!! Paginator !!!
------------- */
let currentPage = 1;
// Function to create pagination buttons
const createPaginationButton = (text, id, clickHandler) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.id = id;
  button.addEventListener("click", clickHandler);
  return button;
};
// Set the default pageSize
let pageSize = 20;
// Function to handle pagination
const handlePagination = (pageSize) => {
  performSearch(searchInput.value.toLowerCase(), pageSize);
};

// Function to update current page and perform search
const updatePageAndSearch = (increment) => {
  currentPage += increment;
  handlePagination();
  console.log(currentPage);
};

const paginationContainer = document.createElement("div");
paginationContainer.id = "pagination";
document.body.appendChild(paginationContainer);

const prevButton = createPaginationButton("Previous Page", "prevPage", () => {
  if (currentPage > 1) {
    updatePageAndSearch(-1);
  }
});
paginationContainer.appendChild(prevButton);

const nextButton = createPaginationButton("Next Page", "nextPage", () => {
  updatePageAndSearch(1);
});
paginationContainer.appendChild(nextButton);

getItems(apiUrl, currentPage, pageSize);
