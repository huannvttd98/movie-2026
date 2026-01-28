# Movie Streaming Platform 2026

Nền tảng xem phim trực tuyến hỗ trợ 1000-10000 người dùng xem cùng lúc.

## 🎯 Tính Năng

- ✅ Streaming video chất lượng cao với HLS/DASH
- ✅ Hỗ trợ 1000 người xem đồng thời, mở rộng lên 10,000 người
- ✅ Adaptive bitrate streaming (360p - 4K)
- ✅ Real-time viewer tracking với WebSocket
- ✅ Caching thông minh với Redis
- ✅ Load balancing với Nginx
- ✅ Monitoring với Prometheus + Grafana
- ✅ RESTful API
- ✅ User authentication & authorization
- ✅ Watchlist & favorites
- ✅ Watch history tracking
- ✅ Multi-language subtitles

## 🚀 Công Nghệ Sử Dụng

### Backend
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **Redis** - Caching layer
- **Socket.io** - Real-time communication

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **Nginx** - Load balancer & reverse proxy
- **Prometheus + Grafana** - Monitoring
- **HLS/DASH** - Video streaming protocols

## 📋 Yêu Cầu Hệ Thống

### Development
- Node.js 18+
- Docker & Docker Compose
- 4GB RAM
- 10GB Storage

### Production (1000 concurrent users)
- 8+ CPU cores
- 16GB+ RAM
- 100GB+ SSD Storage
- 1 Gbps+ bandwidth

## 🔧 Cài Đặt

### Quick Start
```bash
# Clone repository
git clone https://github.com/huannvttd98/movie-2026.git
cd movie-2026

# Setup environment
cp .env.example .env
# Chỉnh sửa .env với cấu hình của bạn

# Chạy với Docker Compose
docker-compose up -d

# Kiểm tra health
curl http://localhost:3000/health
```

### Development Mode
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc hệ thống chi tiết
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Hướng dẫn triển khai

## 🏗️ Kiến Trúc

```
Users (1K-10K)
      ↓
   CDN (Cloudflare)
      ↓
Load Balancer (Nginx)
      ↓
  ┌────┴────┬────────┐
  ↓         ↓        ↓
API 1    API 2    API N
  └────┬────┴────────┘
       ↓
  ┌────┴────┬────────┐
  ↓         ↓        ↓
Redis   MongoDB   S3/CDN
```

## 📊 API Endpoints

### Movies
- `GET /api/movies` - Danh sách phim
- `GET /api/movies/:id` - Chi tiết phim
- `GET /api/movies/featured` - Phim nổi bật
- `GET /api/movies/trending` - Phim trending
- `GET /api/movies/search?q=keyword` - Tìm kiếm

### Streaming
- `GET /api/stream/:movieId/manifest` - Stream manifest
- `GET /api/stream/:movieId/quality/:quality` - Stream theo quality
- `GET /api/stream/:movieId/subtitle/:language` - Phụ đề

### Users
- `POST /api/users/register` - Đăng ký
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/profile` - Thông tin user
- `POST /api/users/watchlist/:movieId` - Thêm vào watchlist
- `GET /api/users/watch-history` - Lịch sử xem

## 🔒 Security

- JWT authentication
- Rate limiting
- HTTPS/TLS encryption
- Input validation
- SQL/NoSQL injection prevention
- XSS protection
- CORS configuration

## 📈 Scaling

Hệ thống được thiết kế để dễ dàng scale:

### Horizontal Scaling
```bash
# Scale API servers
docker-compose up -d --scale api=5

# Với Kubernetes
kubectl scale deployment api --replicas=10
```

### Database Scaling
- MongoDB replica sets
- MongoDB sharding
- Redis cluster

Chi tiết xem [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📊 Monitoring

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **API Health**: http://localhost:3000/health

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License

## 👥 Team

Created by huannvttd98

## 🔗 Links

- [GitHub Repository](https://github.com/huannvttd98/movie-2026)
- [Documentation](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
