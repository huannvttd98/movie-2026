# Kiến Trúc Hệ Thống Website Xem Phim Trực Tuyến

## Yêu Cầu Hệ Thống
- Hỗ trợ 1000 người xem cùng lúc
- Khả năng mở rộng lên tới 10,000 người dùng
- Streaming video chất lượng cao
- Độ trễ thấp và hiệu suất cao

## Công Nghệ Sử Dụng

### 1. Frontend
- **Framework**: React 18+ với TypeScript
- **State Management**: Redux Toolkit hoặc Zustand
- **Video Player**: Video.js hoặc Plyr (hỗ trợ HLS/DASH)
- **UI Framework**: Material-UI hoặc Ant Design
- **Build Tool**: Vite hoặc Webpack 5

**Lý do**: React cung cấp hiệu suất cao với virtual DOM, dễ dàng tái sử dụng component, và có ecosystem phong phú.

### 2. Backend
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js hoặc NestJS
- **Language**: TypeScript
- **API Style**: RESTful API + WebSocket cho real-time features

**Lý do**: Node.js xử lý tốt I/O không đồng bộ, phù hợp cho streaming và nhiều kết nối đồng thời.

### 3. Database
- **Primary Database**: MongoDB (NoSQL)
  - Lưu trữ thông tin phim, người dùng, lịch sử xem
  - Dễ scale horizontally
  - Schema linh hoạt
  
- **Cache Layer**: Redis
  - Cache metadata phim
  - Session management
  - Rate limiting
  - Real-time analytics

**Lý do**: MongoDB scale tốt với dữ liệu lớn, Redis cung cấp tốc độ truy xuất cực nhanh cho cache.

### 4. Video Streaming
- **Streaming Protocol**: HLS (HTTP Live Streaming) và DASH
- **Video Processing**: FFmpeg
- **Transcoding**: Cloud-based (AWS MediaConvert, Google Transcoder API) hoặc self-hosted
- **Adaptive Bitrate**: Multiple quality levels (360p, 480p, 720p, 1080p, 4K)

**Lý do**: HLS/DASH hỗ trợ adaptive bitrate streaming, tối ưu băng thông cho từng người dùng.

### 5. Content Delivery Network (CDN)
- **CDN**: Cloudflare, AWS CloudFront, hoặc Akamai
- **Storage**: Amazon S3, Google Cloud Storage, hoặc MinIO (self-hosted)

**Lý do**: CDN giảm độ trễ bằng cách phân phối nội dung từ server gần người dùng nhất.

### 6. Load Balancing & Scaling
- **Load Balancer**: Nginx hoặc HAProxy
- **Container Orchestration**: Kubernetes hoặc Docker Swarm
- **Auto-scaling**: Horizontal Pod Autoscaler (K8s)

**Lý do**: Load balancer phân phối traffic đều, Kubernetes tự động scale pods dựa trên CPU/memory usage.

### 7. Authentication & Security
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: Role-Based Access Control (RBAC)
- **Security**: 
  - HTTPS/TLS encryption
  - Rate limiting
  - DDoS protection (Cloudflare)
  - Content encryption (DRM nếu cần)

### 8. Monitoring & Analytics
- **Application Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana) hoặc Loki
- **Error Tracking**: Sentry
- **User Analytics**: Google Analytics hoặc Mixpanel

### 9. CI/CD
- **Version Control**: Git (GitHub/GitLab)
- **CI/CD**: GitHub Actions, GitLab CI, hoặc Jenkins
- **Testing**: Jest, Cypress, Playwright

## Kiến Trúc Hệ Thống

```
┌─────────────┐
│   Users     │
│ (1K-10K)    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│          CDN (Cloudflare)           │
│   - Static Assets                   │
│   - Video Content Cache             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Load Balancer (Nginx)          │
└──────┬──────────────────────────────┘
       │
       ├────────────┬────────────┐
       ▼            ▼            ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│  Web      │ │  Web      │ │  Web      │
│  Server 1 │ │  Server 2 │ │  Server N │
│ (Node.js) │ │ (Node.js) │ │ (Node.js) │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │
      └─────────────┼─────────────┘
                    │
      ┌─────────────┼─────────────┐
      │             │             │
      ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Redis   │  │ MongoDB  │  │  Video   │
│  Cache   │  │ Cluster  │  │ Storage  │
│          │  │          │  │  (S3)    │
└──────────┘  └──────────┘  └──────────┘
```

## Tính Toán Capacity

### Băng Thông
- 1000 người xem đồng thời
- Giả sử chất lượng trung bình: 3 Mbps/người
- Tổng băng thông: 1000 × 3 Mbps = 3 Gbps
- Với CDN, chỉ cần origin bandwidth: ~500 Mbps - 1 Gbps

### Server Resources (cho 1000 concurrent users)
- **API Servers**: 3-5 instances
  - CPU: 4-8 cores/instance
  - RAM: 8-16 GB/instance
  - Network: 1-10 Gbps

- **Database**:
  - MongoDB: 3-node replica set
  - CPU: 8-16 cores/node
  - RAM: 16-32 GB/node
  - Storage: 1-5 TB SSD

- **Redis Cache**:
  - 1 master + 2 replicas
  - RAM: 8-16 GB/instance

### Scaling to 10,000 Users
- Nhân tài nguyên lên 10x
- API Servers: 10-15 instances
- Sử dụng Kubernetes auto-scaling
- Tăng CDN bandwidth allocation
- MongoDB sharding cho database scaling

## Best Practices

1. **Video Optimization**
   - Sử dụng adaptive bitrate streaming
   - Compress video với codec hiện đại (H.265/HEVC, AV1)
   - Generate thumbnails và preview

2. **Caching Strategy**
   - Cache popular content ở CDN edge
   - Cache metadata trong Redis
   - Browser caching cho static assets

3. **Performance**
   - Lazy loading cho images và video
   - Code splitting cho frontend
   - Database indexing
   - Connection pooling

4. **Reliability**
   - Multiple availability zones
   - Database replication
   - Regular backups
   - Health checks và auto-recovery

5. **Security**
   - Input validation
   - Rate limiting
   - SQL/NoSQL injection prevention
   - XSS protection
   - CORS configuration

## Estimated Costs (Monthly)

### Option 1: Cloud-based (AWS/GCP)
- **Compute**: $500-1000
- **Storage (1 TB video)**: $23-50
- **CDN Bandwidth (10 TB)**: $500-800
- **Database**: $300-500
- **Total**: ~$1500-2500/month

### Option 2: Hybrid (Self-hosted + CDN)
- **VPS/Dedicated Servers**: $200-500
- **CDN**: $300-600
- **Storage**: $100-200
- **Total**: ~$600-1300/month

## Deployment Strategy

1. **Development Environment**: Docker Compose
2. **Staging Environment**: Small Kubernetes cluster
3. **Production Environment**: Full Kubernetes cluster với multiple nodes
4. **CI/CD Pipeline**: Automated testing → Build → Deploy

## Tổng Kết

Stack này được thiết kế để:
- ✅ Xử lý 1000 concurrent users hiệu quả
- ✅ Dễ dàng scale lên 10,000 users
- ✅ Chi phí hợp lý
- ✅ Hiệu suất cao và độ trễ thấp
- ✅ Dễ maintain và mở rộng
