// Sample movie data
const moviesData = [
    {
        id: 1,
        title: "The Matrix",
        year: 1999,
        genre: "sci-fi",
        rating: 8.7,
        description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=The+Matrix",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 2,
        title: "Inception",
        year: 2010,
        genre: "sci-fi",
        rating: 8.8,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Inception",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 3,
        title: "The Dark Knight",
        year: 2008,
        genre: "action",
        rating: 9.0,
        description: "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Dark+Knight",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 4,
        title: "Pulp Fiction",
        year: 1994,
        genre: "thriller",
        rating: 8.9,
        description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Pulp+Fiction",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 5,
        title: "Forrest Gump",
        year: 1994,
        genre: "drama",
        rating: 8.8,
        description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Forrest+Gump",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 6,
        title: "The Shawshank Redemption",
        year: 1994,
        genre: "drama",
        rating: 9.3,
        description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Shawshank",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 7,
        title: "The Godfather",
        year: 1972,
        genre: "drama",
        rating: 9.2,
        description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Godfather",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 8,
        title: "Fight Club",
        year: 1999,
        genre: "thriller",
        rating: 8.8,
        description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Fight+Club",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 9,
        title: "The Hangover",
        year: 2009,
        genre: "comedy",
        rating: 7.7,
        description: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Hangover",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 10,
        title: "Superbad",
        year: 2007,
        genre: "comedy",
        rating: 7.6,
        description: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Superbad",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 11,
        title: "Interstellar",
        year: 2014,
        genre: "sci-fi",
        rating: 8.6,
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Interstellar",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 12,
        title: "The Notebook",
        year: 2004,
        genre: "romance",
        rating: 7.8,
        description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Notebook",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 13,
        title: "Titanic",
        year: 1997,
        genre: "romance",
        rating: 7.9,
        description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Titanic",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 14,
        title: "John Wick",
        year: 2014,
        genre: "action",
        rating: 7.4,
        description: "An ex-hit-man comes out of retirement to track down the gangsters that killed his dog and took everything from him.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=John+Wick",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    },
    {
        id: 15,
        title: "Mad Max: Fury Road",
        year: 2015,
        genre: "action",
        rating: 8.1,
        description: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.",
        poster: "https://via.placeholder.com/250x350/0a0a0a/e50914?text=Mad+Max",
        trailer: "https://www.w3schools.com/html/mov_bbb.mp4"
    }
];
