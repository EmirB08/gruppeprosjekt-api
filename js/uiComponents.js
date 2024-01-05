let currentPage = 0; // initial global state parameters for the pages
const itemsPerPage = 20;
let totalPages = 0;
let apiPage = 0;
const totalArray = [];

const createElement = (tagName, attributes = {}, listeners = {}, children = []) => { // Creates a DOM element with specified parameters - reusable function
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([attr, value]) => element[attr] = value);
    Object.entries(listeners).forEach(([event, handler]) => element.addEventListener(event, handler));
    children.forEach(child => child instanceof HTMLElement && element.appendChild(child));
    return element;
};

const createContainer = (id) => { // creates a DOM container with specified id only - reusable function
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
};

const displayItems = (items) => { // function to display the items on the page
    let container = document.getElementById("items-container");
    if (!container) {
        container = createContainer("items-container");
    }

    const mainContainer = document.querySelector(".main-container"); // retrofitted to work with the new HTML structure that was fixed
    if (!mainContainer.contains(container)) {
        mainContainer.appendChild(container);
    }

    container.innerHTML = "";  // Clear existing content

    items.forEach(item => { // Loop through the items and create a card for each item
        const card = createItemCard(item);
        container.appendChild(card);
    });
};

const createItemCard = (item) => { // function to create the item cards, now creates an array for the elements and appends them to the card
    const isFavorited = JSON.parse(localStorage.getItem('favorites') || '[]').includes(item.id); // localStorage to check if the item is favorited
    const card = createElement("div", { className: "item-card" });
    console.log("Creating card for item:", item);

    const elements = [
        createElement("img", {
            src: item.image?.medium || "./media/no-img.png", // OR operator to display the no-img.png if there's no image
            alt: item.name || item.title || "Image",
            className: "item-image"
        }),
        createElement("div", { className: "title-container" }, {}, [
            createElement("p", { 
                textContent: item.name || item.title, // OR operator to work with both shows and people
                className: "item-title"
            })
        ]),
        createElement("i", {
            className: `fa-star favorite-icon ${isFavorited ? "fas" : "far"}`, // Assigns 'fas' or 'far' class based on whether the item is favorited, combined with common 'fa-star' and 'favorite-icon' classes.
            onclick: (e) => { e.stopPropagation(); toggleFavorite(item, e.target);} // Stops propagation and toggles favorite status for the item.
        }),
        item.rating && createElement("p", {
            textContent: item.rating?.average !== null ? `Rating: ${item.rating.average}` : 'Not rated', // Sets text to item's rating if available
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
        className: "search-input",
        onkeydown: (event) => { //added keydown event listener to the search input
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

const displayShowDetails = (item) => { // functon to display the show details, now creates an array for the elements and appends them to the container
    const container = document.getElementById("items-container");
    container.innerHTML = '';
    container.classList.add('details-view');

    [
        createElement("img", {
            src: item.image?.original || "./media/no-img.png", // OR operator to display the no-img.png if there's no image
            alt: `Image of ${item.name}`,
            className: 'details-image'
        }),
        createElement("h2", {
            textContent: item.name,
            className: 'details-title'
        }),
        item.summary && createElement("p", { // AND operator to check if the summary exists
            innerHTML: item.summary,
            className: 'details-summary'
        }),
        item.rating?.average && createElement("p", { // AND operator to check if the rating exists
            textContent: `Rating: ${item.rating.average}`,
            className: 'details-rating'
        }),
        item.url && createElement("p", { // AND operator to check if the url exists
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
    
    const welcomeElement = document.querySelector(".welcome");
    if (welcomeElement) {
        welcomeElement.textContent = "Search Results";
    }
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

export { getItems, currentPage, createPages, createContainer, displayItems, createSearchElements, performSearch, createItemCard, displayShowDetails, toggleFavorite, manageFavorites, createElement };