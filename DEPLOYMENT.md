# Hướng Dẫn Triển Khai (Deployment Guide)

## Yêu Cầu Hệ Thống

### Phần Mềm
- Docker và Docker Compose
- Node.js 18+ (cho development)
- Git

### Tài Nguyên Tối Thiểu (cho 1000 concurrent users)
- **CPU**: 8 cores
- **RAM**: 16 GB
- **Storage**: 100 GB SSD
- **Bandwidth**: 1 Gbps

## Triển Khai Development

### 1. Clone Repository
```bash
git clone https://github.com/huannvttd98/movie-2026.git
cd movie-2026
```

### 2. Cài Đặt Dependencies
```bash
npm install
```

### 3. Cấu Hình Environment
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin của bạn
```

### 4. Chạy Với Docker Compose
```bash
docker-compose up -d
```

### 5. Kiểm Tra
```bash
# Kiểm tra health
curl http://localhost:3000/health

# Kiểm tra logs
docker-compose logs -f api
```

## Triển Khai Production

### Option 1: Cloud-based (AWS/GCP/Azure)

#### AWS Deployment
1. **Setup VPC và Security Groups**
   - Tạo VPC với public/private subnets
   - Configure security groups cho web, app, database tiers
   
2. **Database Setup**
   - MongoDB Atlas (managed service) hoặc EC2 với MongoDB
   - ElastiCache for Redis
   
3. **Application Servers**
   - ECS/EKS cho container orchestration
   - ALB (Application Load Balancer) cho load balancing
   - Auto Scaling Groups
   
4. **Storage**
   - S3 cho video storage
   - CloudFront CDN cho content delivery
   
5. **Monitoring**
   - CloudWatch cho logging
   - Prometheus + Grafana cho metrics

#### Kubernetes Deployment
```bash
# Build và push Docker image
docker build -t movie-platform:latest .
docker tag movie-platform:latest your-registry/movie-platform:latest
docker push your-registry/movie-platform:latest

# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/redis.yaml
kubectl apply -f k8s/api.yaml
kubectl apply -f k8s/nginx.yaml
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get pods -n movie-platform
kubectl get services -n movie-platform
```

### Option 2: Self-hosted (VPS)

#### 1. Server Setup (Ubuntu 22.04)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx (if not using Docker Nginx)
sudo apt install nginx -y
```

#### 2. Application Deployment
```bash
# Clone repository
git clone https://github.com/huannvttd98/movie-2026.git
cd movie-2026

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Run services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

#### 3. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Scaling Strategy

### Horizontal Scaling (1000 → 10000 users)

#### 1. API Servers
```bash
# Scale với Docker Compose
docker-compose up -d --scale api=5

# Scale với Kubernetes
kubectl scale deployment api --replicas=10 -n movie-platform
```

#### 2. Database Scaling
```yaml
# MongoDB Replica Set
- Primary: Write operations
- Secondary 1: Read operations
- Secondary 2: Read operations
- Arbiter: Voting only

# Sharding cho > 1TB data
- Shard 1: Movies A-M
- Shard 2: Movies N-Z
- Config servers: 3 nodes
- mongos routers: 2+ nodes
```

#### 3. Redis Cluster
```bash
# Setup Redis cluster với 6 nodes (3 master, 3 replica)
redis-cli --cluster create \
  node1:6379 node2:6379 node3:6379 \
  node4:6379 node5:6379 node6:6379 \
  --cluster-replicas 1
```

#### 4. CDN Configuration
```javascript
// Update CDN settings trong .env
CDN_URL=https://cdn.yourdomain.com
CDN_REGIONS=us-east-1,eu-west-1,ap-southeast-1

// Configure cache rules
- Video files: Cache for 1 year
- Thumbnails: Cache for 1 month
- API responses: Cache for 5 minutes
```

## Performance Optimization

### 1. Database Optimization
```javascript
// Connection pooling
mongoose.connect(uri, {
  maxPoolSize: 100,
  minPoolSize: 10
});

// Query optimization
- Use indexes
- Limit result sets
- Use projection
- Implement pagination
```

### 2. Caching Strategy
```javascript
// Redis caching layers
1. Application cache (5-15 minutes)
2. CDN cache (1 hour - 1 year)
3. Browser cache (varies by resource)

// Cache invalidation
- On content update
- Time-based expiration
- Manual purge via API
```

### 3. Video Optimization
```bash
# Transcode video với FFmpeg
ffmpeg -i input.mp4 \
  -c:v libx264 -crf 23 -preset medium \
  -c:a aac -b:a 128k \
  -vf scale=1920:1080 \
  -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "output_%03d.ts" \
  output.m3u8

# Multiple quality levels
360p: -vf scale=640:360 -b:v 800k
480p: -vf scale=854:480 -b:v 1200k
720p: -vf scale=1280:720 -b:v 2500k
1080p: -vf scale=1920:1080 -b:v 5000k
```

## Monitoring & Maintenance

### 1. Health Checks
```bash
# API health
curl http://your-domain/health

# Database connection
curl http://your-domain/health/db

# Redis connection
curl http://your-domain/health/redis
```

### 2. Logs
```bash
# Application logs
docker-compose logs -f api

# Nginx logs
tail -f /var/log/nginx/access.log

# System logs
journalctl -u docker -f
```

### 3. Metrics
- Access Grafana: http://your-domain:3001
- Access Prometheus: http://your-domain:9090
- Default credentials: admin/admin

### 4. Backup Strategy
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/movie-platform" --out=/backup/$(date +%Y%m%d)

# Redis backup
redis-cli BGSAVE

# Application code
git push origin main

# Automated backup script
0 2 * * * /scripts/backup.sh
```

## Troubleshooting

### High Memory Usage
```bash
# Check memory
docker stats

# Restart services
docker-compose restart api

# Increase memory limits in docker-compose.yml
```

### Slow Database Queries
```javascript
// Enable MongoDB profiling
db.setProfilingLevel(2)
db.system.profile.find().sort({ts:-1}).limit(5)

// Check slow queries
db.currentOp({ "active": true, "secs_running": { "$gt": 3 } })
```

### Connection Pool Exhausted
```javascript
// Increase pool size
maxPoolSize: 200

// Check active connections
db.serverStatus().connections
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Enable DDoS protection
- [ ] Backup encryption
- [ ] Database access control
- [ ] API authentication/authorization
- [ ] Security headers in Nginx

## Rollback Procedure

```bash
# Rollback với Docker
docker-compose down
git checkout <previous-commit>
docker-compose up -d

# Rollback với Kubernetes
kubectl rollout undo deployment/api -n movie-platform
kubectl rollout status deployment/api -n movie-platform
```

## Support

Để được hỗ trợ:
1. Kiểm tra logs
2. Xem documentation
3. Tạo issue trên GitHub
4. Liên hệ team qua email
