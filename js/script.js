
document.addEventListener('DOMContentLoaded', function () {
    const moviesContainer = document.getElementById('movies-container');
  
    // Replace with your API endpoint
    const API_URL = 'YOUR_API_ENDPOINT';
  
    // Fetch movies from the API
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=YOUR_API_KEY`)
      .then(response => response.json())
      .then(data => {
        data.forEach(movie => {
          const movieElement = createMovieElement(movie);
          moviesContainer.appendChild(movieElement);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  
    function createMovieElement(movie) {
      const movieDiv = document.createElement('div');
      movieDiv.classList.add('movie');
  
      const img = document.createElement('img');
      img.src = movie.poster;
      img.alt = movie.title;
  
      const title = document.createElement('h2');
      title.textContent = movie.title;
  
      movieDiv.appendChild(img);
      movieDiv.appendChild(title);
  
      return movieDiv;
    }
  });
  