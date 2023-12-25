let currentPage = 0; //initial state parameters for the page
const itemsPerPage = 12;
let totalPages = 0;
let apiPage = 0;
const totalArray = [];

const createElement = (tagName, attributes = {}, listeners = {}, children = []) => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([attr, value]) => element[attr] = value);
    Object.entries(listeners).forEach(([event, handler]) => element.addEventListener(event, handler));
    children.forEach(child => child instanceof HTMLElement && element.appendChild(child));
    return element;
};

const createContainer = (id) => { // utility function to create a container with the given id, will probably be refactored away and merged if there isn't a need for it
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
};

const displayItems = (items) => {
    let container = document.getElementById("items-container");
    if (!container) {
        container = createContainer("items-container");
    }

    const mainContainer = document.querySelector(".main-container");
    if (!mainContainer.contains(container)) {
        mainContainer.appendChild(container);
    }

    container.innerHTML = "";  // Clear existing content

    items.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
};

const createItemCard = (item) => {
    const isFavorited = JSON.parse(localStorage.getItem('favorites') || '[]').includes(item.id);
    const card = createElement("div", { className: "item-card" });
    console.log("Creating card for item:", item);

    const elements = [
        createElement("img", {
            src: item.image?.medium || "placeholder.jpg",
            alt: item.name || item.title || "Image",
            className: "item-image"
        }),
        createElement("div", { className: "title-container" }, {}, [
            createElement("p", { 
                textContent: item.name || item.title,
                className: "item-title"
            })
        ]),
        createElement("i", {
            className: `fa-star favorite-icon ${isFavorited ? "fas" : "far"}`,
            onclick: (e) => { e.stopPropagation(); toggleFavorite(item, e.target); }
        }),
        item.rating?.average && createElement("p", {
            textContent: `Rating: ${item.rating.average}`,
            className: "item-rating"
        })
    ];

    elements.forEach(element => element && card.appendChild(element));
    card.addEventListener("click", () => displayShowDetails(item));
    return card;
};

const createSearchElements = () => {
    const navbar = document.querySelector(".nav-container");
    const insertBeforeElement = navbar.querySelector(".user-container");

    const searchContainer = createElement("div", { className: "search-container" });
    const searchInput = createElement("input", {
        id: "searchInput",
        placeholder: "  Search...",
        className: "search-input"
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

const displayShowDetails = (item) => { // functon to display the show details, now creates an array for the elements and appends them to the container to reduce code instead of appending each element individually
    const container = document.getElementById("items-container");
    container.innerHTML = '';
    container.classList.add('details-view');

    [
        item.image && item.image.original && createElement("img", {
            src: item.image.original,
            alt: `Image of ${item.name}`,
            className: 'details-image'
        }),
        createElement("h2", {
            textContent: item.name,
            className: 'details-title'
        }),
        item.summary && createElement("p", {
            innerHTML: item.summary,
            className: 'details-summary'
        }),
        item.rating?.average && createElement("p", {
            textContent: `Rating: ${item.rating.average}`,
            className: 'details-rating'
        }),
        item.url && createElement("p", {
            innerHTML: `Under Construction! <span><a href="${item.url}" target="_blank">Click here to view ${item.name} on TVMaze for now!</a></span>`,
            className: "details-tvmaze-link"
        })
    ].forEach(element => element && container.appendChild(element));

    window.history.pushState({ show: item }, item.name, `#${item.id}`);
};


const createPages = (url) => { //function to create the pages and pagination with buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            displayPageItems();
        }
    });
    document.getElementById('next-btn').addEventListener('click', () => {
        currentPage++;
        displayPageItems();
        if (currentPage * itemsPerPage >= totalArray.length && currentPage >= totalPages - 1) {
            getItems(url, apiPage);
        }
    });
    getItems(url, apiPage); //initial call to getItems
};

const getItems = async (url, page) => {
    const response = await fetch(`${url}?page=${page}`); // unfortunately the API doesnt support embedding on the index endpoint - sad
    const data = await response.json();
    console.log(data);
    if (data.length === 0) { 
        return; 
    }
    totalArray.push(...data); // Append new data to the total array
    totalPages = Math.ceil(totalArray.length / itemsPerPage);
    displayPageItems();
    apiPage++; // increment by 1
};

const displayPageItems = () => { //function to display the items on the page
    const startIndex = currentPage * itemsPerPage;
    const itemsToDisplay = totalArray.slice(startIndex, startIndex + itemsPerPage);
    displayItems(itemsToDisplay);
};

const performSearch = async (query) => { //takes in the query from the search input 
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}&embed=cast`); //using the query to search the API search endpoint
    const searchResults = await response.json();
    console.log(searchResults); //
    displayItems(searchResults.map(result => result.show)); //array map the search result, very similar to the displayItems function here
    window.history.pushState({ searchQuery: query }, '', `?search=${encodeURIComponent(query)}`); //update the URL and history state - very neat
};

const toggleFavorite = (item, iconElement) => {
    const isFavorited = manageFavorites(item.id);
    console.log(`Toggling favorite. Show ID: ${item.id}, Favorited: ${isFavorited}`); // adding a bit of logging cause I'm having some conceptualization issues with this //control favorite status and updates using the manageFavorites function
    iconElement.classList.toggle("fas", isFavorited);
    iconElement.classList.toggle("far", !isFavorited);
};

const manageFavorites = (showId) => { //function to manage favorites, will be refactored later if I can think of something better
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; //get favorites from local storage, if it doesn't exist create an empty array
    console.log(`Current favorites before update: ${favorites}`);
    const index = favorites.indexOf(showId); // 

    if (index === -1) { //if the show is not in the favorites array, add the show id to the array
        favorites.push(showId);
        console.log(`Added show to favorites. Show ID: ${showId}`);
    } else {
        favorites.splice(index, 1); // if the show is in the favorites array, remove it using splice for index
        console.log(`Removed show from favorites. Show ID: ${showId}`);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites)); // stringify and set the favorites array in local storage
    return favorites.includes(showId);
};

const getTopRatedShows = async () => { // Function to get the top rated shows displayed on the home page
    const response = await fetch("https://api.tvmaze.com/shows");
    const shows = await response.json();
    
    const topRatedShows = shows.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)).slice(0, 12); // Sort and slice to get top 16 shows based on rating

    displayItems(topRatedShows);
};

// Page loading logic //

export { getItems, currentPage, createPages, createContainer, displayItems, createSearchElements, performSearch, createItemCard, displayShowDetails, toggleFavorite, manageFavorites, };