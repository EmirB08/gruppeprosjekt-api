// shows.js

document.addEventListener('DOMContentLoaded', function () {
    const apiUrlBase = 'https://api.tvmaze.com/shows';
    const pageSize = 10;
    let currentPage = 1;

    // DOM Elements
    const searchInput = document.querySelector('#search-input');
    const searchButton = document.querySelector('#search-button');
    const showsContainer = document.querySelector('#shows-container');
    const paginationContainer = document.querySelector('#pagination-container');

    // Fetch TV Shows data when the page loads
    fetchAndDisplayShows(apiUrlBase, currentPage);

    // Event listener for the search button
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== '') {
            currentPage = 1;
            const apiUrlSearch = `${apiUrlBase}/search/shows?q=${searchTerm}`;
            fetchAndDisplayShows(apiUrlSearch, currentPage);
        }
    });

    // Function to fetch and display TV Shows
    const fetchAndDisplayShows = async (url, page) => {
        try {
            const shows = await fetchShows(url, page);
            displayShows(shows);
            displayPagination(page, Math.ceil(shows.length / pageSize), url);
        } catch (error) {
            console.error('Error fetching and displaying shows:', error);
        }
    };

    // Function to fetch TV Shows from the API
    const fetchShows = async (url, page) => {
        const response = await fetch(`${url}?page=${page}&pageSize=${pageSize}`);
        return await response.json();
    };

    // Function to display TV Shows
    const displayShows = (shows) => {
        showsContainer.innerHTML = '';

        shows.forEach(show => {
            const card = createShowCard(show);
            showsContainer.appendChild(card);
        });
    };

    // Function to display pagination buttons
    const displayPagination = (currentPage, totalPages, apiUrl) => {
        paginationContainer.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPageButton(i, apiUrl);
            paginationContainer.appendChild(pageButton);
        }
    };

    // Function to create a pagination button
    const createPageButton = (pageNumber, apiUrl) => {
        const pageButton = document.createElement('button');
        pageButton.textContent = pageNumber;
        pageButton.addEventListener('click', function () {
            currentPage = pageNumber;
            fetchAndDisplayShows(apiUrl, currentPage);
        });
        return pageButton;
    };

    // Function to create a card for a TV Show
    const createShowCard = (show) => {
        const card = document.createElement('div');
        card.className = 'show-card';

        const image = createImage(show);
        const title = createTitle(show);
        const rating = createRating(show);

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(rating);

        return card;
    };

    // Function to create an image element for a TV Show
    const createImage = (show) => {
        const image = document.createElement('img');
        image.src = show.image ? show.image.medium : 'placeholder.jpg';
        image.alt = show.name || 'Image';
        image.className = 'show-image';
        return image;
    };

    // Function to create a title element for a TV Show
    const createTitle = (show) => {
        const title = document.createElement('h4');
        title.textContent = show.name || 'Untitled';
        title.className = 'show-title';
        return title;
    };

    // Function to create a rating element for a TV Show
    const createRating = (show) => {
        const rating = document.createElement('p');
        rating.textContent = show.rating && show.rating.average ? `Rating: ${show.rating.average}` : 'Rating: N/A';
        rating.className = 'show-rating';
        return rating;
    };
});
