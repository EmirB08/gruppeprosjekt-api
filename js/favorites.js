import { createContainer, displayItems, createSearchElements, performSearch, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } 
from "./uiComponents.js";

window.onpopstate = (event) => { // using the history API to update the URL and history state
    if (event.state && event.state.content) { // If there is content in the history state, display it
            displayShowDetails(event.state.show);
    } else {
        const container = document.getElementById("items-container"); //clear the cointainer and display the "default page"
        container.classList.remove('details-view');
        container.innerHTML = '';
        displayFavorites(); // this is the "default", needs to be changed on the other pages to correspond to the "default" page
    }
};

const displayFavorites = async () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let favoriteShows = [];

    for (const showId of favorites) {
        const show = await fetchShowDetails(showId);
        if (show) {
            favoriteShows.push(show);
        }
    }

    displayItems(favoriteShows);
};

document.addEventListener('DOMContentLoaded', displayFavorites);

const fetchShowDetails = async (showId) => {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
    return response.json();
};

createSearchElements();