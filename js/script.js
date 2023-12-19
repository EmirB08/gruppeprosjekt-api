import { createItemCard, displayShowDetails, toggleFavorite, manageFavorites } from './uiComponents.js';

const apiUrl = "https://api.tvmaze.com/shows"; // Im just using the people API, you replace this with whatever you are working on

const createContainer = (id) => { // utility function to create a container with the given id, will probably be refactored away and merged if there isn't a need for it
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
};




const displayItems = (items) => { //function to display the items
    const container = document.getElementById("items-container") || createContainer("items-container"); // container to display the items, if it doesn't exist create it using the createContainer function
    container.innerHTML = "";

    items.forEach(item => {
        const card = createItemCard(item);
        container.appendChild(card);
    });
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
    const response = await fetch(`https://api.tvmaze.com/search/people?q=${query}`); //using the query to search the API search endpoint
    const searchResults = await response.json();
    console.log(searchResults); //
    displayItems(searchResults.map(result => result.person)); //array map the search result, very similar to the displayItems function here
};

const fetchAndDisplayShows = async (showIds) => { //changed to display top rated shows from today's schedule, topRatedShows is now scheduled shows
    const showsPromises = showIds.map(id => fetch(`https://api.tvmaze.com/shows/${id}`).then(res => res.json())); //map array to get the show ids and fetch the shows from the API
    const shows = await Promise.all(showsPromises);
    
    const topRatedShows = shows.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)).slice(0, 12); // Sort and slice to get top 12 based on rating shows

    displayItems(topRatedShows);
};

const getSchedule = async () => { //get the schedule from the API and display the top rated shows
    const scheduleResponse = await fetch('https://api.tvmaze.com/schedule');
    const schedule = await scheduleResponse.json();
    const uniqueShowIds = Array.from(new Set(schedule.map(episode => episode.show.id))); //get unique show ids from the schedule

    fetchAndDisplayShows(uniqueShowIds);
};

getSchedule();

window.onpopstate = (event) => { // IMPORTANT: NEEDS TO BE EDITED DEPENDING ON THE HTML - FOR FUTURE REFERENCE
    if (event.state && event.state.show) { // If there's a show in the history state, display it
            displayShowDetails(event.state.show);
    } else {
        const container = document.getElementById("items-container");
        container.innerHTML = '';
        getSchedule(); //calls the getSchedule function to display the "home page" if there's no show in the history state
    }
};



createSearchElements();
fetchAndDisplayShows();