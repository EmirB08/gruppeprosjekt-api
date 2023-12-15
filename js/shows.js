document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "https://api.tvmaze.com/shows";

  const searchShows = async () => {
    const searchInput = document.getElementById("search-input").value.toLowerCase();
    const searchUrl = `${apiUrl}/search/shows?q=${encodeURIComponent(searchInput)}`;
    console.log("Search URL:", searchUrl);
    getItems(searchUrl);
  };

  const getItems = async (url) => {
    try {
      const response = await fetch(url);
      const shows = await response.json();
      displayItems(shows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const displayItems = (items) => {
    const container =
      document.getElementById("items-container") ||
      createContainer("items-container");
    container.innerHTML = "";

    items.forEach((item) => {
      const card = createItemCard(item);
      container.appendChild(card);
    });
  };

  const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
  };

  const createItemCard = (item) => {
    const card = document.createElement("div");
    card.className = "item-card";

    const image = document.createElement("img");
    image.src = item.image ? item.image.medium : "placeholder.jpg";
    image.alt = item.name || item.title || "Image";
    image.className = "item-image";
    card.appendChild(image);

    if (item.name || item.title) {
      const title = document.createElement("h4");
      title.textContent = item.name || item.title;
      title.className = "item-title";
      card.appendChild(title);
    }

    if (item.rating && item.rating.average) {
      const rating = document.createElement("p");
      rating.textContent = `Rating: ${item.rating.average}`;
      rating.className = "item-rating";
      card.appendChild(rating);
    }
    return card;
  };

  // Event listener for the search input
  const searchInput = document.getElementById("search-input");
  console.log("Search input element:", searchInput);

  searchInput.addEventListener("input", searchShows);
  console.log("Event listener registered for search input.");

  getItems(apiUrl);
});
