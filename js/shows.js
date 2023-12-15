const apiUrl = "https://api.tvmaze.com/shows";

const getItems = async (url) => {
    const response = await fetch(url);
    const items = await response.json();
    displayItems(items);
};

const displayItems = (items) => {
    const container = document.getElementById("items-container") || createContainer("items-container");
    container.innerHTML = "";

    items.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
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
    searchButton.addEventListener("click", () => performSearch(searchInput.value));

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    document.body.appendChild(searchContainer);
};

const performSearch = async (query) => {
    query = query.toLowerCase();
    const container = document.getElementById("items-container");
    container.innerHTML = ''; // Clear existing items

    try {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch search results. Status: ${response.status}`);
        }

        const searchResults = await response.json();
        displayItems(searchResults.map(result => result.show));
    } catch (error) {
        console.error('Error performing search:', error);
        // Display an error message to the user if needed
    }
};

// Create search elements and fetch shows when the page loads
createSearchElements();
getItems(apiUrl);
