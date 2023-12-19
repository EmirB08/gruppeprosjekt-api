const getItems = async (url) => { //async function to get the items from the API
    const response = await fetch(url);
    const items = await response.json();
    console.log(items);
    displayItems(items); //calling the displayItems function to display the items
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

    const favoriteIcon = document.createElement("i");
    favoriteIcon.className = `fa-star favorite-icon ${JSON.parse(localStorage.getItem('favorites') || '[]').includes(item.id) ? "fas" : "far"}`;
    favoriteIcon.onclick = (e) => {
        e.stopPropagation();
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

export { createItemCard, displayShowDetails, toggleFavorite, manageFavorites };