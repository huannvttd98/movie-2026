# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All responses follow this structure:
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Authentication

#### Register
```http
POST /api/users/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "fullName": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  }
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Movies

#### Get All Movies
```http
GET /api/movies?page=1&limit=20
```

Query Parameters:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

#### Get Movie by ID
```http
GET /api/movies/:id
```

#### Search Movies
```http
GET /api/movies/search?q=keyword&genre=action&year=2024
```

Query Parameters:
- `q`: Search keyword
- `genre`: Filter by genre
- `year`: Filter by release year

#### Get Featured Movies
```http
GET /api/movies/featured
```

#### Get Trending Movies
```http
GET /api/movies/trending
```

#### Create Movie (Admin)
```http
POST /api/movies
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Movie Title",
  "description": "Movie description",
  "duration": 120,
  "releaseYear": 2024,
  "genres": ["Action", "Thriller"],
  "director": "Director Name",
  "cast": ["Actor 1", "Actor 2"],
  "rating": 8.5,
  "thumbnail": "https://cdn.example.com/thumb.jpg",
  "poster": "https://cdn.example.com/poster.jpg",
  "videoSources": [
    {
      "quality": "720p",
      "url": "https://cdn.example.com/video_720p.m3u8",
      "format": "HLS",
      "bitrate": 2500
    }
  ]
}
```

#### Like Movie
```http
POST /api/movies/:id/like
Authorization: Bearer <token>
```

#### Increment View Count
```http
POST /api/movies/:id/view
```

### Streaming

#### Get Stream Manifest
```http
GET /api/stream/:movieId/manifest
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "movieId": "movie_id",
    "title": "Movie Title",
    "sources": [
      {
        "quality": "720p",
        "url": "https://cdn.example.com/video_720p.m3u8",
        "format": "HLS",
        "bitrate": 2500
      }
    ],
    "subtitles": [
      {
        "language": "en",
        "url": "https://cdn.example.com/en.vtt"
      }
    ]
  }
}
```

#### Get Stream by Quality
```http
GET /api/stream/:movieId/quality/:quality
Authorization: Bearer <token>
```

#### Get Subtitle
```http
GET /api/stream/:movieId/subtitle/:language
```

#### Track Stream Analytics
```http
POST /api/stream/:movieId/analytics
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "play",
  "timestamp": 1234567890,
  "quality": "720p",
  "buffering": false
}
```

#### Get Current Viewers
```http
GET /api/stream/:movieId/viewers
```

### User Profile

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "avatar": "https://example.com/avatar.jpg",
  "preferredQuality": "1080p",
  "autoPlay": true
}
```

#### Add to Watchlist
```http
POST /api/users/watchlist/:movieId
Authorization: Bearer <token>
```

#### Remove from Watchlist
```http
DELETE /api/users/watchlist/:movieId
Authorization: Bearer <token>
```

#### Add to Favorites
```http
POST /api/users/favorites/:movieId
Authorization: Bearer <token>
```

#### Remove from Favorites
```http
DELETE /api/users/favorites/:movieId
Authorization: Bearer <token>
```

#### Get Watch History
```http
GET /api/users/watch-history
Authorization: Bearer <token>
```

#### Update Watch Progress
```http
POST /api/users/watch-history/:movieId
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": 45,
  "completed": false
}
```

## Rate Limiting

API endpoints are rate-limited:
- General API: 100 requests per 15 minutes per IP
- Streaming: 1000 requests per hour per IP

When rate limit is exceeded:
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

## WebSocket Events

### Connect
```javascript
const socket = io('http://localhost:3000');
```

### Events

#### Watching a Movie
```javascript
socket.emit('watching', movieId);
```

Server response:
```javascript
socket.on('viewer-count', (count) => {
  console.log(`Current viewers: ${count}`);
});
```

#### Stop Watching
```javascript
socket.emit('stop-watching', movieId);
```

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Examples

### Complete Flow: User Registration to Streaming

1. Register user
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

2. Login and get token
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. Get movies list
```bash
curl http://localhost:3000/api/movies
```

4. Get stream manifest
```bash
curl http://localhost:3000/api/stream/MOVIE_ID/manifest \
  -H "Authorization: Bearer YOUR_TOKEN"
```

5. Track viewing
```bash
curl -X POST http://localhost:3000/api/movies/MOVIE_ID/view
```

## Notes

- All timestamps are in Unix timestamp format (milliseconds)
- All responses are in JSON format
- File uploads are not yet implemented in this version
- Maximum request body size: 100MB
