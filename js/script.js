document.addEventListener('DOMContentLoaded', function () {
    const seriesContainer = document.getElementById('series-container');

    // Replace with your TVmaze API endpoint
    const API_URL = 'https://api.tvmaze.com/shows';

    // Fetch TV series from the TVmaze API
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Sort the series alphabetically by name
            data.sort((a, b) => a.name.localeCompare(b.name));
            data.forEach(series => {
                const seriesElement = createSeriesElement(series);
                seriesContainer.appendChild(seriesElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    function createSeriesElement(series) {
        const seriesDiv = document.createElement('div');
        seriesDiv.classList.add('series');

        const img = document.createElement('img');
        img.src = series.image.medium; // Assuming the image information is available in the medium size
        img.alt = series.name;

        const title = document.createElement('h2');
        title.textContent = series.name;

        seriesDiv.appendChild(img);
        seriesDiv.appendChild(title);

        return seriesDiv;
    }
});
