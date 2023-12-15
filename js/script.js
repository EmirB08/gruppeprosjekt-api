const apiUrl = "https://api.tvmaze.com/shows"; // Im just using the people API, you replace this with whatever you are working on

const createContainer = (id) => { // utility function to create a container with the given id, will probably be refactored away and merged if there isn't a need for it
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
};

const getItems = async (url) => { //async function to get the items from the API
    const response = await fetch(url);
    const items = await response.json();
    console.log(items);
    displayItems(items); //calling the displayItems function to display the items
};

const displayItems = (items) => { //function to display the items
    const container = document.getElementById("items-container") || createContainer("items-container"); // container to display the items, if it doesn't exist create it using the createContainer function
    container.innerHTML = "";

    items.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
};

const createItemCard = (item) => { //function to create a card that will display the item and the necessary data elements
    const card = document.createElement("div");
    card.className = "item-card";

    const image = document.createElement("img");
    image.src = item.image ? item.image.medium : "placeholder.jpg";
    image.alt = item.name || item.title || "Image";
    image.className = "item-image";
    card.appendChild(image);

    const titleContainer = document.createElement("div"); // decided to create a separate container for css reasons
    titleContainer.className = "title-container";
    card.appendChild(titleContainer); // append the title container to the main

    if (item.name || item.title) { //resusability between shows/people/movies
        const title = document.createElement("h4");
        title.textContent = item.name || item.title;
        title.className = "item-title";
        titleContainer.appendChild(title);
    }

    const favoriteIcon = document.createElement("i"); // function for favorite icon that will be the way to store favorites which will be stored in local storage and displayed on the favorites page
    favoriteIcon.className = "far fa-star favorite-icon"; // using font awesome icons
    favoriteIcon.onclick = (e) => {
        e.stopPropagation(); // makes the click event on the icon not trigger the click event on the card
        toggleFavorite(item, favoriteIcon);
    };
    titleContainer.appendChild(favoriteIcon);

    if (item.rating && item.rating.average) { // Create a rating element if the item has a rating
        const rating = document.createElement("p");
        rating.textContent = `Rating: ${item.rating.average}`;
        rating.className = "item-rating";
        card.appendChild(rating);
    }

    card.addEventListener("click", () => displayShowDetails(item)); // Add click event listener to show information when clicked
    return card;
};

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
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`); //using the query to search the API
    const searchResults = await response.json();
    console.log(searchResults); //
    displayItems(searchResults.map(result => result.show)); //array map the search result, very similar to the displayItems function here
};

const getTopRatedShows = async () => { // Function to get the top rated shows displayed on the home page
    const response = await fetch("https://api.tvmaze.com/shows");
    const shows = await response.json();
    
    const topRatedShows = shows.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)).slice(0, 12); // Sort and slice to get top 16 shows based on rating

    displayItems(topRatedShows);
};

const displayShowDetails = (item) => { // Function to display the show details when clicked, using browser history API to update the URL
    const container = document.getElementById("items-container");
    container.innerHTML = ''; // Clear existing content

    const title = document.createElement("h2"); // very basic for now, will add more details later and classes for css
    title.textContent = item.name;
    container.appendChild(title);

    if (item.summary) {
        const summary = document.createElement("p");
        summary.innerHTML = item.summary;
        container.appendChild(summary);
    }

    if (item.rating && item.rating.average) {
        const rating = document.createElement("p");
        rating.textContent = `Rating: ${item.rating.average}`;
        container.appendChild(rating);
    }
    
    window.history.pushState({ show: item }, item.name, `#${item.id}`); //update the URL and history state
};

window.onpopstate = (event) => {
    if (event.state && event.state.show) { // If there's a show in the history state, display it
            displayShowDetails(event.state.show);
    } else {
    
        getTopRatedShows(); // display the "home page" if there's no show in the history state
    }
};

const toggleFavorite = (item, iconElement) => { //function to toggle the favorite icon

    const isFavorited = iconElement.classList.contains("fas"); //check if the icon is favorited

    iconElement.classList.remove(isFavorited ? "fas" : "far"); //update the icon to the opposite
    iconElement.classList.add(isFavorited ? "far" : "fas");
};

createSearchElements();
getItems(apiUrl);
getTopRatedShows();
