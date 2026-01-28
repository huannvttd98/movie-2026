# 🎬 MovieStream - Movie Streaming Website

A modern, responsive movie streaming website built with HTML, CSS, and JavaScript.

## Features

- **Browse Movies**: Explore a curated collection of popular movies
- **Search Functionality**: Search for movies by title, description, or genre
- **Genre Filtering**: Filter movies by genre (Action, Comedy, Drama, Sci-Fi, Thriller, Romance)
- **Movie Details**: View detailed information about each movie including rating, year, and description
- **Video Player**: Watch movie trailers directly in the browser
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, dark-themed interface inspired by popular streaming platforms

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No server installation required - this is a static website

### Installation

1. Clone the repository:
```bash
git clone https://github.com/huannvttd98/movie-2026.git
cd movie-2026
```

2. Open `index.html` in your web browser:
```bash
# On Linux/Mac
open index.html

# On Windows
start index.html

# Or simply double-click the index.html file
```

## File Structure

```
movie-2026/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # Main JavaScript logic
├── movies-data.js      # Movie data
└── README.md          # Documentation
```

## Usage

1. **Browse Movies**: Scroll through the featured movies section to see all available movies
2. **Search**: Use the search bar in the navigation to find specific movies
3. **Filter by Genre**: Click on genre buttons to filter movies by category
4. **View Details**: Click on any movie card to see detailed information
5. **Play Trailer**: Click the "Play Now" button in the movie details modal to watch the trailer

## Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Interactive functionality and DOM manipulation

## Customization

### Adding New Movies

Edit the `movies-data.js` file and add new movie objects to the `moviesData` array:

```javascript
{
    id: 16,
    title: "Your Movie Title",
    year: 2026,
    genre: "action", // action, comedy, drama, sci-fi, thriller, romance
    rating: 8.5,
    description: "Movie description here",
    poster: "https://example.com/poster.jpg",
    trailer: "https://example.com/trailer.mp4"
}
```

### Changing Colors

Edit the `styles.css` file to customize the color scheme. Main colors used:
- Primary: `#e50914` (Red)
- Background: `#0f0f0f` (Dark Black)
- Secondary Background: `#1a1a1a` (Light Black)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Contact

For questions or feedback, please open an issue on GitHub.

---

© 2026 MovieStream. All rights reserved.
