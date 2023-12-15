const apiUrl = "https://api.tvmaze.com/search/shows?";
const searchShows = async () => {
  const searchInput = document.getElementById("search-input").value.toLowerCase();
  const searchUrl = `${apiUrl}q=${searchInput}`;
  console.log("Search URL:", searchUrl); // Log the constructed URL
  getItems(searchUrl);
};


const getItems = async (url) => {
    const response = await fetch(url);
    const shows = await response.json(); // Rename 'items' to 'shows' for clarity
    displayItems(shows);
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

// Event listener for the search input
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", searchShows);

getItems(apiUrl);
