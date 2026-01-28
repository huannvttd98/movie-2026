# Quick Start Guide

## 🚀 Bắt Đầu Nhanh

### 1. Chạy với Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/huannvttd98/movie-2026.git
cd movie-2026

# Setup environment
cp .env.example .env
nano .env  # Chỉnh sửa JWT_SECRET và các cấu hình khác

# Chạy tất cả services
docker-compose up -d

# Kiểm tra logs
docker-compose logs -f api

# Kiểm tra health
curl http://localhost:3000/health
```

### 2. Development Mode

```bash
# Cài đặt dependencies
npm install

# Setup environment
cp .env.example .env

# Chạy MongoDB và Redis (sử dụng Docker)
docker-compose up -d mongodb redis

# Chạy server
npm run server:dev
```

## 📖 Tài Liệu Chi Tiết

- **[README.md](./README.md)** - Tổng quan dự án
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Kiến trúc hệ thống và công nghệ
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Hướng dẫn triển khai
- **[API.md](./API.md)** - API Documentation
- **[SECURITY.md](./SECURITY.md)** - Phân tích bảo mật

## 🧪 Test API

### 1. Đăng ký user
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### 2. Đăng nhập
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Lấy danh sách phim
```bash
curl http://localhost:3000/api/movies
```

## 📊 Monitoring

- **Grafana**: http://localhost:3001 (admin/admin)
- **Prometheus**: http://localhost:9090
- **API Health**: http://localhost:3000/health

## 🔧 Cấu Hình Quan Trọng

### Environment Variables (.env)

```env
# Required
NODE_ENV=production
JWT_SECRET=your-super-secret-key-min-32-characters
MONGODB_URI=mongodb://mongodb:27017/movie-platform
REDIS_URL=redis://redis:6379

# Optional
CLIENT_URL=https://yourdomain.com
CDN_URL=https://cdn.yourdomain.com
```

### Scaling

```bash
# Scale API servers
docker-compose up -d --scale api=5

# Với Kubernetes
kubectl scale deployment api --replicas=10 -n movie-platform
```

## 🎯 Capacity Planning

### Cho 1000 Concurrent Users
- API Servers: 3-5 instances
- RAM: 16GB total
- CPU: 8 cores
- Bandwidth: 1 Gbps

### Cho 10,000 Concurrent Users
- API Servers: 10-15 instances
- RAM: 64GB+ total
- CPU: 32+ cores
- Bandwidth: 10 Gbps
- CDN: Required

## ⚡ Performance Tips

1. **Sử dụng CDN** cho video content
2. **Enable Redis caching** cho metadata
3. **Optimize video encoding** (H.265, multiple bitrates)
4. **Horizontal scaling** với Kubernetes
5. **Database indexing** đã được cấu hình sẵn

## 🔒 Security Checklist

- [ ] Set strong JWT_SECRET
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Set up firewall rules
- [ ] Enable Redis password
- [ ] Regular security updates
- [ ] Set up monitoring alerts

## 🐛 Troubleshooting

### Lỗi: Cannot connect to MongoDB
```bash
# Kiểm tra MongoDB đang chạy
docker-compose ps mongodb

# Xem logs
docker-compose logs mongodb
```

### Lỗi: JWT_SECRET not defined
```bash
# Thêm vào .env file
echo "JWT_SECRET=your-secret-key-here" >> .env

# Restart services
docker-compose restart
```

### High memory usage
```bash
# Check memory usage
docker stats

# Restart services
docker-compose restart api
```

## 📞 Support

- GitHub Issues: https://github.com/huannvttd98/movie-2026/issues
- Documentation: Xem các file MD trong repository

## 🎬 Next Steps

1. ✅ Setup cơ bản hoàn tất
2. 📝 Thêm movies vào database
3. 🎥 Upload video content lên S3/CDN
4. 🚀 Deploy lên production
5. 📊 Monitor performance
6. 🔧 Optimize và scale theo nhu cầu
