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

const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
};

const createItemCard = (item) => {
    const card = document.createElement("div");
    card.className = "item-card";

    const image = document.createElement("img");
    image.src = item.image ? item.image.medium : "placeholder.jpg";
    image.alt = item.name || item.title || "Image";
    image.className = "item-image";
    card.appendChild(image);

    if (item.name || item.title) {
        const title = document.createElement("h4");
        title.textContent = item.name || item.title;
        title.className = "item-title";
        card.appendChild(title);
    }

    if (item.rating && item.rating.average) {
        const rating = document.createElement("p");
        rating.textContent = `Rating: ${item.rating.average}`;
        rating.className = "item-rating";
        card.appendChild(rating);
    }
    return card;
};


const createSearchElements = () => {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";

    const searchInput = document.createElement("input");
    searchInput.id = "search-input";
    searchInput.placeholder = "Search Shows";
    searchInput.className = "search-input";

    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.className = "search-button";
    searchButton.addEventListener("click", () => {
        currentPage = 1; // Reset to the first page when performing a new search
        performSearch(searchInput.value);
    });

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    document.body.appendChild(searchContainer);
};

const performSearch = async (query) => {
    query = query.toLowerCase();
    const container = document.getElementById("items-container");
    container.innerHTML = ''; // Clear existing items

    try {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}&page=${currentPage}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch search results. Status: ${response.status}`);
        }

        const searchResults = await response.json();
        items = searchResults.map(result => result.show); // Update the global items variable
        displayItems();
    } catch (error) {
        console.error('Error performing search:', error);
        // Display an error message to the user if needed
    }
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




// Create search elements and fetch shows when the page loads
createSearchElements();
getItems(apiUrl, currentPage);
