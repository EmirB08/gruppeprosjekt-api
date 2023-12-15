const apiUrl = "https://api.tvmaze.com/shows"; // Im just using the people API, you replace this with whatever you are working on

const createContainer = (id) => {
  // utility function to create a container with the given id, will probably be refactored away and merged if there isn't a need for it
  const container = document.createElement("div");
  container.id = id;
  document.body.appendChild(container);
  return container;
};

const getItems = async (url) => {
  //async function to get the items from the API
  const response = await fetch(url);
  const items = await response.json();
  displayItems(items); // I'm calling the  array of items 'items' instead of 'shows' because the API can return other types of items like movies depending on the URL
};

const displayItems = (items) => {
  //function to display the items
  const container =
    document.getElementById("items-container") ||
    createContainer("items-container"); // container to display the items, if it doesn't exist create it using the createContainer function
  container.innerHTML = "";

  items.forEach((item) => {
    const card = createItemCard(item);
    container.appendChild(card);
  });
};

const createContainer = (id) => {
  //function to create a container with the given id
  const container = document.createElement("div");
  container.id = id;
  document.body.appendChild(container);
  return container;
};

const createItemCard = (item) => {
  //function to create a card for the given item, reusable for other types of items
  const card = document.createElement("div");
  card.className = "item-card";

  const image = document.createElement("img"); // Create an image element
  image.src = item.image ? item.image.medium : "placeholder.jpg";
  image.alt = item.name || item.title || "Image";
  image.className = "item-image";
  card.appendChild(image);

  if (item.name || item.title) {
    // If the item has a name or title, create a title element
    const title = document.createElement("h4");
    title.textContent = item.name || item.title;
    title.className = "item-title";
    card.appendChild(title);
  }

  if (item.rating && item.rating.average) {
    // If the item has a rating, create a rating element
    const rating = document.createElement("p");
    rating.textContent = `Rating: ${item.rating.average}`;
    rating.className = "item-rating";
    card.appendChild(rating);
  }
  return card;
};

const createSearchElements = () => {
  //function to create the search elements and search functionality - will change to dual search functionality later
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const searchInput = document.createElement("input");
  searchInput.id = "searchInput";
  searchInput.placeholder = "Search Shows";
  searchInput.className = "search-input";

  const searchButton = document.createElement("button");
  searchButton.textContent = "Search";
  searchButton.className = "search-button";
  searchButton.addEventListener("click", () =>
    performSearch(searchInput.value)
  ); // will include enter key functionality later

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(searchButton);
  document.body.appendChild(searchContainer); // appending everything
};

const performSearch = async (query) => {
  //takes in the query from the search input
  const response = await fetch(
    `https://api.tvmaze.com/search/shows?q=${query}`
  ); //using the query to search the API
  const searchResults = await response.json();
  console.log(searchResults); //
  displayItems(searchResults.map((result) => result.show)); //array map the search result, very similar to the displayItems function here
};

const getTopRatedShows = async () => {
  // Function to get the top rated shows displayed on the home page
  const response = await fetch("https://api.tvmaze.com/shows");
  const shows = await response.json();

  const topRatedShows = shows
    .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
    .slice(0, 12); // Sort and slice to get top 16 shows based on rating

  displayItems(topRatedShows);
};

const displayShowDetails = (item) => {
  // Function to display the show details when clicked, using browser history API to update the URL
  const container = document.getElementById("items-container");
  container.innerHTML = ""; // Clear existing content

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
  if (event.state && event.state.show) {
    // If there's a show in the history state, display it
    displayShowDetails(event.state.show);
  } else {
    getTopRatedShows(); // display the "home page" if there's no show in the history state
  }
};

const toggleFavorite = (item, iconElement) => {
  //function to toggle the favorite icon

  const isFavorited = iconElement.classList.contains("fas"); //check if the icon is favorited

  iconElement.classList.remove(isFavorited ? "fas" : "far"); //update the icon to the opposite
  iconElement.classList.add(isFavorited ? "far" : "fas");
};

createSearchElements();
getItems(apiUrl);
getTopRatedShows();
