# Báo Cáo Bảo Mật & Đề Xuất Tính Năng - Portfolio

## 1. Tóm Tắt Nhanh (Overall Security Score)
**Đánh giá:** 🟢 **Trung bình - Khá (Medium-High)**

Dự án được xây dựng khá an toàn với các practice hiện đại. Việc áp dụng `zod` để kiểm tra đầu vào (input validation) trên tất cả các API route và sử dụng Astro ở chế độ server (hybrid/standalone) giúp hạn chế rất nhiều rủi ro. Các biến môi trường nhạy cảm như `STRIPE_SECRET_KEY` hay `TELEGRAM_BOT_TOKEN` được bảo vệ tốt ở phía server. Tuy nhiên, dự án vẫn thiếu một số cấu hình bảo mật ở cấp độ mạng (network level), server-side rate limiting và bảo mật CI/CD.

## 2. Chi Tiết Lỗ Hổng (Vulnerabilities Details)

### 🔴 Mức độ: High (Nghiêm trọng)
*   **Thiếu Server-Side Rate Limiting:** Form liên hệ (`/api/contact`) và các API công khai khác (như Stripe Payment) hoàn toàn không có giới hạn tỷ lệ (Rate Limiting) ở phía Server. Hiện tại, giới hạn 60 giây chỉ được thực hiện ở **Client-side** (`localStorage.getItem('lastContactSubmission')` trong `ContactForm.client.tsx`). Kẻ tấn công có thể dễ dàng bỏ qua bằng cách sử dụng curl, Postman hoặc xóa localStorage để spam Telegram Bot hoặc làm cạn kiệt tài nguyên Server.
*   **Thiếu Cấu Hình HTTPS / TLS trong Nginx:** File `nginx.conf` hiện tại chỉ lắng nghe ở port 80 (HTTP) và không có cấu hình block cho port 443 (HTTPS), cũng như thiếu cơ chế tự động chuyển hướng từ HTTP sang HTTPS (Force HTTPS). Việc truyền tải dữ liệu không mã hóa có thể dẫn đến Man-in-the-Middle (MitM) attacks.

### 🟠 Mức độ: Medium (Trung bình)
*   **Content-Security-Policy (CSP) Yếu:** CSP trong `nginx.conf` đang cho phép `'unsafe-inline'` và `'unsafe-eval'`. Điều này làm giảm đáng kể hiệu quả của CSP trong việc ngăn chặn tấn công Cross-Site Scripting (XSS).
*   **Thiếu CSRF Protection:** Các API Route xử lý state thay đổi (như `/api/contact` hoặc `/api/stripe/create-payment.ts`) chưa có cơ chế phòng chống Cross-Site Request Forgery (CSRF). Dù framework Astro tự động giảm thiểu rủi ro, nhưng một custom API endpoint vẫn có thể bị tấn công.

### 🟡 Mức độ: Low (Thấp)
*   **Rủi ro từ Workflow CI/CD:** Trong file `.github/workflows/deploy.yml`, lệnh triển khai đang sử dụng `sudo` (`sudo cp -r`, `sudo chown`, `sudo systemctl`) trực tiếp trên self-hosted runner. Nếu kho lưu trữ bị xâm nhập, kẻ tấn công có thể thay đổi workflow và chiếm quyền root của VPS.
*   **Thiếu Security Headers Nâng Cao:** Thiếu các headers như `Strict-Transport-Security` (HSTS), `X-Frame-Options` (chống Clickjacking) và `Referrer-Policy`.

## 3. Đề Xuất Khắc Phục Ngay (Quick Wins)
1.  **Triển khai Server-Side Rate Limiting:** Bổ sung middleware hoặc logic trong các route `/api/contact` và `/api/stripe/create-payment.ts` để giới hạn số lượng request theo IP. Có thể sử dụng cấu hình Rate Limit của Nginx (`limit_req_zone`) hoặc cài đặt thư viện caching như `lru-cache` trên Node.js.
2.  **Siết chặt cấu hình Nginx:**
    * Thêm khối `server` lắng nghe port 443 với chứng chỉ SSL (ví dụ: Let's Encrypt).
    * Thêm tính năng redirect HTTP -> HTTPS.
    * Thêm các headers: `add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;` và `add_header X-Frame-Options "SAMEORIGIN";`.
3.  **Refactor Content Security Policy (CSP):** Xóa bỏ `'unsafe-inline'` và `'unsafe-eval'` ra khỏi chỉ thị của CSP trong `nginx.conf`. Thay vào đó, sử dụng nonce hoặc hash cho các script nội bộ (nếu bắt buộc).

## 4. Khoảng Trống Bảo Mật Cần Lưu Ý (Security Gaps)
*   **Quản Lý Dependency:** Hiện tại sử dụng Bun nhưng không có quy trình quét lỗ hổng các package tự động trong CI/CD. Cần sử dụng công cụ tương thích như `bun pm untrusted` và kiểm tra lỗ hổng định kỳ (SAST/DAST).
*   **Kiểm thử bảo mật (DAST):** Quá trình build & deploy diễn ra mà không trải qua bất kỳ bước kiểm thử bảo mật tự động nào (ví dụ: quét bằng OWASP ZAP).
*   **Bảo vệ API Mở:** Endpoint tìm kiếm vector `api/search.ts` truy vấn trực tiếp vào LanceDB không có biện pháp chặn abuse query dài (DoS Database).

## 5. Ý Tưởng Tính Năng Mới (Feature Suggestions)

Dựa trên công nghệ của dự án (Astro, React, Mermaid, AI Agent, Telegram Bot), sau đây là **5 tính năng** giúp portfolio trở nên chuyên nghiệp và ấn tượng hơn về mặt bảo mật:

**1. Tích hợp tính năng "Security Changelog" (Trang Nhật ký Bảo mật)**
*   **Lý do:** Cho thấy chủ nhân portfolio là một Developer có tư duy bảo mật, minh bạch về các bản vá và theo chuẩn mực công nghiệp.
*   **Cách triển khai:** Tạo một Content Collection mới (`src/content/security/`) và hiển thị trên một route như `/security-log`. Các mục có thể sử dụng định dạng Markdown tương tự như `TEMPLATES_BLOG.md`.

**2. Gửi Báo Cáo Bảo Mật (Audit Report) Tự Động Qua Telegram**
*   **Lý do:** Tận dụng `TELEGRAM_BOT_TOKEN` đã có sẵn, bạn có thể nhận thông báo ngay lập tức nếu server gặp sự cố hoặc có dependencies lỗi thời.
*   **Cách triển khai:** Tạo một GitHub Action chạy định kỳ (cron job) sử dụng `bun x npm-check-updates` hoặc `bun pm untrusted`, sau đó trigger API tới Telegram Bot để báo cáo về tình trạng dependencies.

**3. Tích hợp Dependabot / Snyk vào GitHub Actions**
*   **Lý do:** Vá lỗ hổng quy trình phát triển. Hiện tại `.github/workflows` chỉ có lint và check build.
*   **Cách triển khai:** Bổ sung file `.github/dependabot.yml` để tự động tạo PR cập nhật dependencies. Thêm step cài đặt Snyk CLI trong `deploy.yml` để quét SAST trước khi build.

**4. Vẽ Sơ Đồ Luồng Dữ Liệu & Phân Tích Mối Đe Dọa bằng Mermaid.js**
*   **Lý do:** Thể hiện khả năng System Design và Security Analysis trên portfolio.
*   **Cách triển khai:** Thêm một tab hoặc section trong dự án hiển thị sơ đồ Threat Modeling (ví dụ: luồng dữ liệu Stripe Payment hoặc API Contact) sử dụng component `<Mermaid />` có sẵn, chú thích các điểm trust boundary.

**5. Huấn luyện AI Agent (Terminal Takeover) Trả Lời Về Bảo Mật Dự Án**
*   **Lý do:** Portfolio có tính năng AI Assistant / Terminal Takeover rất thú vị.
*   **Cách triển khai:** Cập nhật `AI_AGENT_INSTRUCTIONS.md` và `src/lib/terminal-takeover-data.ts` (hoặc vector search `LanceDB`) với các context về bảo mật (ví dụ: "Hệ thống chống XSS thế nào?", "Dữ liệu người dùng được lưu trữ ra sao?"). Khi người dùng hỏi AI về "security", AI có thể tự tin trình bày các phương pháp mã hóa và phòng thủ của portfolio.
