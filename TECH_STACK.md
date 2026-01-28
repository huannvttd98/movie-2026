# Kiến trúc và Công nghệ Dự án Movie Streaming 2026

Tài liệu này mô tả chi tiết các công nghệ được lựa chọn để xây dựng nền tảng xem phim trực tuyến với khả năng đáp ứng **1,000 người xem cùng lúc (CCU)** và kiến trúc sẵn sàng mở rộng lên **10,000 CCU**.

## 1. Backend (Xử lý nghiệp vụ & API)
*Lý do:* Cần sự ổn định, tốc độ phát triển nhanh và khả năng quản lý queue tốt.

*   **Framework:** **Laravel 10.x/11.x (PHP)**.
    *   Cung cấp hệ sinh thái mạnh mẽ (Eloquent ORM, Authentication, Authorization).
    *   **Laravel Horizon:** Quản lý hàng đợi (Queue) để xử lý các tác vụ nặng (như convert video) dưới nền (background) mà không làm chậm trải nghiệm người dùng.
    *   **Laravel Sanctum/Passport:** Xử lý xác thực API (Authentication) bảo mật cho Mobile App và Frontend.

## 2. Frontend (Giao diện người dùng)
*Lý do:* Cần trải nghiệm mượt mà, không load lại trang (SPA) khi chuyển tập phim, và tối ưu SEO.

*   **Framework:** **Next.js (React)** hoặc **Nuxt.js (Vue)**.
    *   Hỗ trợ **SSR (Server Side Rendering)** để tối ưu SEO cho các trang chi tiết phim (rất quan trọng với web phim).
    *   Trải nghiệm người dùng mượt mà giống như ứng dụng (App-like experience).
*   **Video Player:** **Video.js** hoặc **Plyr**.
    *   Hỗ trợ tốt giao thức HLS.
    *   Tự động điều chỉnh chất lượng (Auto quality switching) dựa trên băng thông mạng người xem.

## 3. Streaming Engine & Transcoding (Trái tim hệ thống)
*Lý do:* Để chịu tải 10,000 người, không thể dùng file MP4 thông thường.

*   **Giao thức:** **HLS (HTTP Live Streaming)**.
    *   Chia nhỏ video thành các file `.ts` (chunks) dài khoảng 10 giây.
    *   Tạo file playlist `.m3u8` để điều phối việc tải các chunks này.
*   **Transcoder:** **FFmpeg**.
    *   Tool dòng lệnh mạnh mẽ nhất để xử lý video.
    *   Chức năng: Chuyển đổi file MP4/MKV gốc sang HLS với nhiều độ phân giải (360p, 480p, 720p, 1080p) - kỹ thuật **ABR (Adaptive Bitrate Streaming)**.
*   **Lưu trữ (Storage):** **S3 Compatible Object Storage** (AWS S3, MinIO, DigitalOcean Spaces).
    *   Tách biệt hoàn toàn việc lưu trữ video khỏi Web Server. Web Server chỉ chứa code, Video nằm trên Storage server hoặc Cloud.

## 4. Cơ sở dữ liệu & Caching
*Lý do:* Giảm tải cho Database chính khi traffic tăng đột biến.

*   **Database chính:** **MySQL** hoặc **PostgreSQL**.
    *   Lưu trữ thông tin user, film metadata, comments, ratings.
*   **Caching & Queue:** **Redis**.
    *   **Cache:** Lưu kết quả các query phổ biến (Top views, Danh sách phim mới) để giảm tải MySQL.
    *   **Queue Driver:** Làm trung gian lưu trữ các job xử lý video cho Laravel Horizon.

## 5. Kiến trúc Hạ tầng (Infrastructure & Scalability)
*Lý do:* Đảm bảo hệ thống không sập khi đạt 10,000 người xem.

*   **Load Balancing:** **Nginx**.
    *   Phân phối traffic nếu cần chạy nhiều server backend.
*   **CDN (Content Delivery Network):** **Cloudflare**.
    *   Đây là yếu tố quan trọng nhất để đạt 10,000+ views.
    *   CDN sẽ cache các file video `.ts` tại các điểm server gần người dùng nhất. Server gốc (Origin) chỉ phục vụ traffic rất nhỏ ban đầu.
*   **Containerization:** **Docker**.
    *   Đóng gói ứng dụng để dễ dàng triển khai và mở rộng (Scale) trên nhiều server khác nhau.

## 6. Sơ đồ luồng dữ liệu xử lý Video
```mermaid
graph LR
    User[Admin Upload] -->|Upload MP4| API[Laravel API]
    API -->|Lưu file gốc| Storage[Temporary Storage]
    API -->|Push Job| Redis[Redis Queue]
    Worker[FFmpeg Worker] -->|Pull Job| Redis
    Worker -->|Đọc file gốc| Storage
    Worker -->|Convert HLS (.m3u8/.ts)| S3[S3 Object Storage/MinIO]
    Viewer[Người xem] -->|Request Phim| CDN[Cloudflare CDN]
    CDN -->|Fetch Video| S3
```
