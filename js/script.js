const apiUrl = "https://api.tvmaze.com/shows"; // Im just using the people API, you replace this with whatever you are working on

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

const createContainer = (id) => { //function to create a container with the given id
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
};

const createItemCard = (item) => { //function to create a card for the given item, reusable for other types of items
    const card = document.createElement("div");
    card.className = "item-card";

    const image = document.createElement("img"); // Create an image element
    image.src = item.image ? item.image.medium : "placeholder.jpg";
    image.alt = item.name || item.title || "Image";
    image.className = "item-image";
    card.appendChild(image);

    if (item.name || item.title) { // If the item has a name or title, create a title element
        const title = document.createElement("h4");
        title.textContent = item.name || item.title;
        title.className = "item-title";
        card.appendChild(title);
    }

    if (item.rating && item.rating.average) { // If the item has a rating, create a rating element
        const rating = document.createElement("p");
        rating.textContent = `Rating: ${item.rating.average}`;
        rating.className = "item-rating";
        card.appendChild(rating);
    }
    return card;
};

const createSearchElements = () => {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container"; // just giving everything a class name for css

    const searchInput = document.createElement("input");
    searchInput.id = "searchInput";
    searchInput.placeholder = "Search Shows";
    searchInput.className = "search-input"; /// just giving everything a class name for css

    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.className = "search-button"; // just giving everything a class name for css
    searchButton.addEventListener("click", () => performSearch(searchInput.value)); // adding an event listener to the button to perform the search when clicked

    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchButton);
    document.body.appendChild(searchContainer); // appending everything
};

// Function to perform the search
const performSearch = async (query) => { //takes in the query from the search input
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`); //using the query to search the API
    const searchResults = await response.json();
    console.log(searchResults);
    displayItems(searchResults.map(result => result.show)); //array map the search result, very similar to the displayItems function here
};

createSearchElements();

getItems(apiUrl);
