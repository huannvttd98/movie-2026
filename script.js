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

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
        <img src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}" class="movie-poster">
        <div class="movie-info">
            <h3 class="movie-title">${escapeHtml(movie.title)}</h3>
            <div class="movie-meta">
                <span class="movie-year">${escapeHtml(String(movie.year))}</span>
                <span class="movie-rating">⭐ ${escapeHtml(String(movie.rating))}</span>
            </div>
            <p class="movie-genre">${escapeHtml(capitalizeGenre(movie.genre))}</p>
            <p class="movie-description">${escapeHtml(movie.description)}</p>
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
        <img src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)}" class="modal-movie-poster" id="modalMovieTitle">
        <h2 class="modal-movie-title">${escapeHtml(movie.title)}</h2>
        <div class="modal-movie-meta">
            <span>Year: ${escapeHtml(String(movie.year))}</span>
            <span>Genre: ${escapeHtml(capitalizeGenre(movie.genre))}</span>
            <span>Rating: ⭐ ${escapeHtml(String(movie.rating))}</span>
        </div>
        <p class="modal-movie-description">${escapeHtml(movie.description)}</p>
        <button class="play-button" id="playMovieBtn">▶ Play Now</button>
        <div id="videoContainer"></div>
    `;
    
    // Add event listener to play button
    document.getElementById('playMovieBtn').addEventListener('click', () => {
        playMovie(movie.trailer);
    });
    
    modal.style.display = 'block';
    
    // Trap focus in modal
    trapFocus();
}

// Play movie
function playMovie(trailerUrl) {
    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `
        <video controls class="video-player">
            <source src="${escapeHtml(trailerUrl)}" type="video/mp4">
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

// Close modal and cleanup
function closeModal() {
    modal.style.display = 'none';
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
        videoContainer.innerHTML = '';
    }
    // Remove focus trap
    document.removeEventListener('keydown', handleModalKeydown);
}

// Trap focus in modal
function trapFocus() {
    document.addEventListener('keydown', handleModalKeydown);
}

// Handle keyboard events in modal
function handleModalKeydown(e) {
    // Close on Escape key
    if (e.key === 'Escape') {
        closeModal();
        return;
    }
    
    // Trap focus within modal
    if (e.key === 'Tab') {
        const modalContent = document.querySelector('.modal-content');
        const focusableElements = modalContent.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }
}

// Event Listeners
genreButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        genreButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
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

searchInput.addEventListener('input', debounce((e) => {
    if (e.target.value === '') {
        currentMovies = [...moviesData];
        applyFilters();
    }
}, 300));

closeBtn.addEventListener('click', () => {
    closeModal();
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
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
