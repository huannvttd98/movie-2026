// MongoDB initialization script
db = db.getSiblingDB('movie-platform');

// Create collections
db.createCollection('movies');
db.createCollection('users');

// Create indexes
db.movies.createIndex({ title: 1 });
db.movies.createIndex({ releaseYear: 1 });
db.movies.createIndex({ genres: 1 });
db.movies.createIndex({ viewCount: -1 });
db.movies.createIndex({ rating: -1 });
db.movies.createIndex({ featured: 1 });
db.movies.createIndex({ trending: 1 });
db.movies.createIndex({ status: 1 });
db.movies.createIndex({ title: 'text', description: 'text' });

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

print('MongoDB initialized successfully');
