import { getItems, displayItems, createPages, createContainer, createItemCard, displayShowDetails, createSearchElements, toggleFavorite, manageFavorites } from './uiComponents.js';

const peopleAPI = 'https://api.tvmaze.com/people';
createPages(peopleAPI);
createSearchElements();
