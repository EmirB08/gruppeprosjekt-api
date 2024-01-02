import { getItems, displayItems, createPages, createSearchElements, performSearch, createContainer, createItemCard, displayShowDetails, toggleFavorite, manageFavorites } 
from './uiComponents.js';

const showsAPI = 'https://api.tvmaze.com/shows';
console.log(showsAPI);

window.onpopstate = (event) => { // using the history API to update the URL and history state
  if (event.state && event.state.content) { // If there's content in the history state, display it
          displayShowDetails(event.state.content);
  } else {
      const container = document.getElementById("items-container"); //clear the cointainer and display the "default page"
      container.classList.remove('details-view');
      container.innerHTML = '';
      createPages(showsAPI); // this is the "default", needs to be changed on the other pages to correspond to the "default" page
  }
};

createPages(showsAPI);
createSearchElements();
