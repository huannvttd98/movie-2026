// Initialize the application
let currentGenre = 'all';
let currentMovies = [...moviesData];

// DOM Elements
const moviesGrid = document.getElementById('moviesGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const genreButtons = document.querySelectorAll('.genre-btn');
const modal = document.getElementById('movieModal');
const modalBody = document.getElementById('modalBody');
const closeBtn = document.querySelector('.close-btn');
const ctaButton = document.querySelector('.cta-button');

// Display movies
function displayMovies(movies) {
    moviesGrid.innerHTML = '';
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p style="color: #999; text-align: center; width: 100%;">No movies found.</p>';
        return;
    }
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesGrid.appendChild(movieCard);
    });
}

// Create movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${movie.year}</span>
                <span class="movie-rating">⭐ ${movie.rating}</span>
            </div>
            <p class="movie-genre">${capitalizeGenre(movie.genre)}</p>
            <p class="movie-description">${movie.description}</p>
        </div>
    `;
    
    card.addEventListener('click', () => showMovieDetails(movie));
    return card;
}

// Capitalize genre
function capitalizeGenre(genre) {
    return genre.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Show movie details in modal
function showMovieDetails(movie) {
    modalBody.innerHTML = `
        <img src="${movie.poster}" alt="${movie.title}" class="modal-movie-poster">
        <h2 class="modal-movie-title">${movie.title}</h2>
        <div class="modal-movie-meta">
            <span>Year: ${movie.year}</span>
            <span>Genre: ${capitalizeGenre(movie.genre)}</span>
            <span>Rating: ⭐ ${movie.rating}</span>
        </div>
        <p class="modal-movie-description">${movie.description}</p>
        <button class="play-button" onclick="playMovie('${movie.title}', '${movie.trailer}')">▶ Play Now</button>
        <div id="videoContainer"></div>
    `;
    modal.style.display = 'block';
}

// Play movie
function playMovie(title, trailerUrl) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `
        <video controls class="video-player" autoplay>
            <source src="${trailerUrl}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    `;
}

// Filter by genre
function filterByGenre(genre) {
    currentGenre = genre;
    applyFilters();
}

// Search movies
function searchMovies(query) {
    const searchTerm = query.toLowerCase();
    currentMovies = moviesData.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm)
    );
    applyFilters();
}

// Apply all filters
function applyFilters() {
    let filteredMovies = currentMovies;
    
    if (currentGenre !== 'all') {
        filteredMovies = filteredMovies.filter(movie => movie.genre === currentGenre);
    }
    
    displayMovies(filteredMovies);
}

// Event Listeners
genreButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        genreButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterByGenre(this.dataset.genre);
    });
});

searchBtn.addEventListener('click', () => {
    searchMovies(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMovies(searchInput.value);
    }
});

searchInput.addEventListener('input', (e) => {
    if (e.target.value === '') {
        currentMovies = [...moviesData];
        applyFilters();
    }
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
        videoContainer.innerHTML = '';
    }
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        const videoContainer = document.getElementById('videoContainer');
        if (videoContainer) {
            videoContainer.innerHTML = '';
        }
    }
});

ctaButton.addEventListener('click', () => {
    document.getElementById('movies').scrollIntoView({ behavior: 'smooth' });
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Initialize - display all movies on page load
displayMovies(moviesData);
