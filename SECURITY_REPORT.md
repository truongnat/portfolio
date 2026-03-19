# Báo cáo Bảo mật & Đề xuất Tính năng (Security Scan & Feature Suggestions)

## 1. Tóm tắt nhanh (Overall Security Score)

**Đánh giá chung: Trung bình (Medium)**

Dự án có cấu trúc tốt, tách biệt frontend và backend APIs thông qua Astro hybrid rendering. Tuy nhiên, việc sử dụng các biến môi trường có tiền tố `PUBLIC_` cho thông tin nhạy cảm (Telegram Bot Token) là một rủi ro **Critical** cần khắc phục ngay. Ngoài ra, việc thiếu Rate Limiting và các header bảo mật nâng cao (CSP, HSTS) cũng tạo ra các bề mặt tấn công tiềm ẩn.

## 2. Chi tiết lỗ hổng

### 🚨 Critical
- **Lộ Token nhạy cảm ra Client (Credential Leakage)**:
  - **Vị trí**: `src/env.d.ts`, `src/lib/telegram.ts`.
  - **Mô tả**: Biến `PUBLIC_TELEGRAM_BOT_TOKEN` và `PUBLIC_TELEGRAM_CHAT_ID` được thiết kế để sử dụng ở client-side (vì có prefix `PUBLIC_` theo chuẩn của Vite/Astro). Điều này khiến ai cũng có thể đọc được mã thông báo bot, từ đó kiểm soát bot Telegram, spam tin nhắn hoặc đánh cắp thông tin.
  - **Tác động**: Mất kiểm soát kênh Telegram, nguy cơ bị lạm dụng bot.

### 🔴 High
- **Thiếu Rate Limiting ở API Server**:
  - **Vị trí**: `src/pages/api/contact.ts`, `src/pages/api/chat.ts`, `src/pages/api/bug-bounty/submit.ts`.
  - **Mô tả**: Dù client có check `localStorage` 60s (`ContactForm.client.tsx`), nhưng backend không có bất kỳ cơ chế nào ngăn chặn brute-force hoặc spam.
  - **Tác động**: Kẻ tấn công có thể spam hàng ngàn request trực tiếp vào API, làm cạn kiệt tài nguyên (Gemini API quota, Telegram rate limits).

### 🟠 Medium
- **Tiềm ẩn XSS qua thư viện bên thứ 3**:
  - **Vị trí**: `src/components/mdx/Mermaid.astro`.
  - **Mô tả**: Sử dụng `graph.innerHTML = svg;` để render trực tiếp kết quả từ `mermaid.render()`. Dù content hiện tại có thể chỉ lấy từ Markdown nội bộ, nhưng nếu mở rộng cho người dùng nhập liệu thì đây là một lỗ hổng XSS điển hình.
- **Tiềm ẩn SSRF / External Data Exposure**:
  - **Vị trí**: `src/pages/api/crypto/qr.ts`.
  - **Mô tả**: Dữ liệu do người dùng truyền vào `validatedData.data` được đưa trực tiếp vào URL `api.qrserver.com` mà không có giới hạn độ dài chặt chẽ. Kẻ tấn công có thể chèn các tham số độc hại nếu API thay đổi cấu trúc.

### 🟡 Low
- **Dependency Vulnerabilities**:
  - **Vị trí**: `package.json`, `bun.lock`.
  - **Mô tả**: Các thư viện như `@google/generative-ai`, `ai` thay đổi liên tục. Không có cơ chế tự động quét để cảnh báo phiên bản cũ / lỗi bảo mật.
- **Thiếu Security Headers**:
  - **Vị trí**: `nginx.conf`, `astro.config.mjs`.
  - **Mô tả**: Đã có XSS-Protection, nhưng thiếu Content Security Policy (CSP), Strict-Transport-Security (HSTS), và Referrer-Policy.
- **CI/CD Security**:
  - **Vị trí**: `.github/workflows/deploy.yml`.
  - **Mô tả**: Chạy trên `self-hosted` runner nhưng chạy lệnh `sudo` (ví dụ: `sudo rm -rf`, `sudo chown`). Cần cẩn trọng phân quyền cho user `runner` để không bị leo thang đặc quyền (Privilege Escalation).

## 3. Đề xuất khắc phục ngay (Quick Wins)

1. **Sửa lỗi lộ Secret Telegram**:
   - Xóa tiền tố `PUBLIC_` trong `src/env.d.ts` (thành `TELEGRAM_BOT_TOKEN`).
   - Sửa `src/lib/telegram.ts` để gọi API `/api/contact` thay vì gọi trực tiếp API Telegram từ client. API backend (`src/pages/api/contact.ts`) sẽ sử dụng `process.env.TELEGRAM_BOT_TOKEN` an toàn.
2. **Cập nhật Nginx Security Headers**:
   - Thêm HSTS (`add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;`).
   - Thêm CSP cơ bản (`add_header Content-Security-Policy "default-src 'self'; ..." always;`).
3. **Thêm cấu hình Dependabot**:
   - Tạo file `.github/dependabot.yml` cho NPM (hoặc Bun) để tự động tạo PR cập nhật dependencies.

## 4. Khoảng trống bảo mật cần lưu ý (Report Gaps)

- **Bot Protection**: Các form public (Contact, Bug Bounty, Auction) thiếu CAPTCHA hoặc các giải pháp bảo vệ vô hình như Cloudflare Turnstile.
- **Server-side Validation**: Zod được sử dụng tốt, nhưng không có giới hạn kích thước payload (Max Length cho mảng `messages` trong `chat.ts`), dễ bị DoS nếu nhận payload lớn.
- **Monitoring & Alerting**: Không có công cụ theo dõi lỗi tập trung (như Sentry). Lỗi chủ yếu được in ra qua `console.error`.

## 5. Ý tưởng tính năng mới (Feature Suggestions)

1. **Dashboard Trạng thái Bảo mật (Security Posture Dashboard)**
   - **Lý do**: Tăng sự tin tưởng của nhà tuyển dụng/khách hàng, thể hiện năng lực bảo mật của Fullstack Developer.
   - **Triển khai**: Tạo trang `/security` (hoặc `/trust`). Hiển thị PGP key, chính sách `security.txt`, bảng tóm tắt kết quả quét Snyk/Dependabot thông qua API, và danh sách Hall of Fame từ Bug Bounty.

2. **Tích hợp Cloudflare Turnstile cho Form**
   - **Lý do**: Ngăn chặn spam form (Contact, Bug Bounty) hiệu quả và thân thiện với người dùng hơn reCAPTCHA.
   - **Triển khai**: Thêm component `<Turnstile />` vào form, sau đó gửi token lên `/api/contact.ts` để verify thông qua API của Cloudflare trước khi xử lý logic.

3. **Cơ chế Rate Limiting toàn cục bằng Upstash Redis**
   - **Lý do**: Astro APIs hiện đang không có rate limit. Upstash Redis (Serverless) rất phù hợp với Edge/Serverless function.
   - **Triển khai**: Thêm `@upstash/ratelimit`. Viết một Astro Middleware (`src/middleware.ts`) chặn request theo IP. Ví dụ: giới hạn `/api/chat` ở mức 10 requests / phút.

4. **Bot tự động gửi báo cáo Security Scan hàng tuần**
   - **Lý do**: Đảm bảo dự án luôn được giám sát và cập nhật. Tận dụng Telegram bot sẵn có.
   - **Triển khai**: Thêm một job vào `weekly-summary.yml`. Chạy `bun audit`, phân tích kết quả, và gửi tin nhắn cảnh báo (nếu có High/Critical CVEs) qua Telegram.

5. **AI Security Assistant (Contextual RAG)**
   - **Lý do**: Làm nổi bật tính năng "Ask Truong.AI".
   - **Triển khai**: Cung cấp thêm tài liệu (như `SECURITY_REPORT.md` này, hoặc các file chính sách bảo mật) vào vector database. Cho phép AI trả lời các câu hỏi như: "How is this portfolio secured?" hoặc "What is Truong's approach to API security?".
