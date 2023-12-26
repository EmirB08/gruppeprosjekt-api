import { createContainer, displayItems, createSearchElements, performSearch, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } from "./uiComponents.js";

window.onpopstate = (event) => {
    if (event.state && event.state.content) { // If there's a show in the history state, display it
            displayShowDetails(event.state.show);
    } else {
        const container = document.getElementById("items-container");
        container.classList.remove('details-view');
        container.innerHTML = '';
        displayFavorites(); // display the "home page" if there's no show in the history state
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