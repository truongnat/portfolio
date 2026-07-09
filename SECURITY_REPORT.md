# Báo Cáo Đánh Giá Bảo Mật và Đề Xuất Tính Năng

**Ngày đánh giá:** Hôm nay
**Dự án:** Portfolio - Dao Quang Truong (GitHub - truongnat/portfolio)
**Công nghệ chính:** Astro 5.x, React 19, TailwindCSS 4, Bun

---

## 1. Tóm Tắt Nhanh (Overall Security Score)
**Tình trạng chung:** ⚠️ **Cần Cải Thiện Đáng Kể (Needs Significant Improvement)**
Dự án có cấu hình cơ bản khá ổn trên Nginx và có kiến trúc tốt, tuy nhiên đang tồn tại **lỗ hổng bảo mật nghiêm trọng (Critical)** liên quan đến rò rỉ secret key ra môi trường Client. Ngoài ra, việc thiếu Rate Limiting và hệ thống CI/CD chưa có pipeline bảo mật cần được ưu tiên giải quyết sớm để đưa lên môi trường Production an toàn.

---

## 2. Chi Tiết Lỗ Hổng (Vulnerability Details)

### 🔴 Mức độ Critical (Nghiêm trọng)
1. **Rò rỉ Secret Key qua `import.meta.env` ra Client**
   - **Vị trí:** `src/lib/telegram.ts` và `src/components/ContactForm.client.tsx`.
   - **Chi tiết:** File `telegram.ts` có chứa hàm `sendContactMessage` đọc trực tiếp `import.meta.env.PUBLIC_TELEGRAM_BOT_TOKEN`. Khi file này được import vào một Client Component của React (`ContactForm.client.tsx`), các token này (dù có hay không có tiền tố `PUBLIC_`) sẽ bị expose toàn bộ dưới dạng plaintext trong JS bundle mà trình duyệt tải về. Kẻ tấn công có thể dễ dàng lấy bot token để spam hoặc chiếm quyền điều khiển bot.

### 🟠 Mức độ High (Cao)
1. **Dependency Vulnerabilities (Dependencies Lỗi Thời)**
   - **Vị trí:** `package.json` và `bun.lock`.
   - **Chi tiết:** Mặc dù không sử dụng `npm audit` được (do sử dụng Bun), qua quá trình kiểm tra với `bun x npm-check-updates -p bun` cho thấy hầu hết các dependencies của project đang khá cũ và đã có các bản nâng cấp quan trọng, ví dụ: `@astrojs/cloudflare`, `@astrojs/node`, `astro` đều có version mới để sửa lỗi. Việc giữ dependency cũ có thể phát sinh các CVE bảo mật.
2. **Thiếu Rate Limiting**
   - **Vị trí:** Các API endpoints `/api/contact.ts`, `/api/stripe/create-payment.ts`.
   - **Chi tiết:** Không có cơ chế Rate Limit nào trên Astro Server hay cấu hình Nginx để giới hạn tần suất gửi form hoặc gọi webhook/Stripe. Kẻ tấn công có thể spam API dẫn đến cạn kiệt tài nguyên Server (DDoS) hoặc chi phí phát sinh từ bên thứ 3.

### 🟡 Mức độ Medium (Trung bình)
1. **Rủi ro XSS tiềm ẩn trong Render HTML**
   - **Vị trí:** `src/components/seo/Schema.astro`.
   - **Chi tiết:** Có sử dụng đoạn `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`. Dù đang truyền dạng JSON object, việc sử dụng `set:html` luôn đi kèm rủi ro XSS nếu object `schema` có chứa chuỗi mã độc được lấy từ input bên ngoài mà không được sanitize trước.
2. **Xác thực Webhook lỏng lẻo (Development Code rò rỉ vào Production)**
   - **Vị trí:** `src/pages/api/stripe/webhook.ts`.
   - **Chi tiết:** Comment code xử lý signature webhook của Stripe (sử dụng thư viện chính thức) nhưng code thực tế lại dùng `JSON.parse(body)` trực tiếp không qua xác thực `STRIPE_WEBHOOK_SECRET`. Dù có note là "for development only", nhưng nếu deploy code này lên production thì kẻ xấu có thể làm giả webhook để update database dễ dàng.

### 🟢 Mức độ Low (Thấp)
1. **Cấu hình CSP (Content Security Policy) lỏng lẻo**
   - **Vị trí:** `nginx.conf`.
   - **Chi tiết:** Đang cấu hình CSP chứa `'unsafe-inline'` và `'unsafe-eval'`. Điều này sẽ làm giảm tác dụng của CSP trong việc ngăn chặn các cuộc tấn công XSS. Cần siết chặt dần dần và xoá bỏ các directive này.
2. **Thiếu Automation Testing/Security check trong CI/CD**
   - **Vị trí:** `.github/workflows/deploy.yml`.
   - **Chi tiết:** Pipeline hiện tại chỉ checkout, build và deploy thông qua PM2. Không có khâu quét SAST, DAST, hoặc check dependency vulnerability trước khi deploy.

---

## 3. Đề Xuất Khắc Phục Ngay (Quick Wins)

1. **Khắc phục rò rỉ Token (Critical)**
   - Xóa bỏ tiền tố `PUBLIC_` trong `.env` và `src/lib/telegram.ts` để chắc chắn biến môi trường chỉ chạy ở Server.
   - Component `ContactForm.client.tsx` KHÔNG ĐƯỢC CÓ import logic gửi Telegram. Thay vào đó component Client này phải POST data về API backend `/api/contact.ts`. Tại endpoint `/api/contact.ts`, backend sẽ đọc `.env` an toàn và thực hiện fetch tới API Telegram.
2. **Fix Webhook Stripe**
   - Trong `src/pages/api/stripe/webhook.ts`, chuyển về trạng thái verify signature đúng chuẩn (`crypto.subtle` hoặc Stripe SDK) nếu đang chạy ở mode production (`import.meta.env.PROD`).
3. **Cập nhật Dependencies**
   - Chạy `bun update` hoặc `bun x npm-check-updates -u && bun install` để nâng cấp tất cả các gói package hiện tại nhằm patch các lỗi bảo mật mới.
4. **Cải thiện cấu hình Nginx**
   - Trong `nginx.conf`, thêm config limit zone: `limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;` và áp dụng `limit_req zone=api_limit burst=10;` vào location `/api/`.

---

## 4. Khoảng Trống Bảo Mật Cần Lưu Ý

- **Chưa có quy trình quét mã nguồn tĩnh (SAST)**: Cần công cụ rà soát source code tự động để bắt các lỗi tương tự rò rỉ secret hoặc dùng API `unsafe` như trên.
- **Rủi ro API không xác thực**: Các Admin API hoặc API nhạy cảm đang không có Middleware kiểm tra Auth JWT hay cookie.
- **Không có HTTPS Force**: Cấu hình Nginx hiện tại chỉ lắng nghe ở port 80. Chưa có redirect từ HTTP sang HTTPS (có thể project này dùng Cloudflare SSL Offload ở tầng trên nhưng về mặt Nginx nên có cấu hình chặn/điều hướng phù hợp).

---

## 5. Ý Tưởng Tính Năng Mới (Feature Suggestions)

Dựa trên công nghệ của project (Astro, AI SDK, Telegram integration, Mermaid.js), đây là 5 đề xuất tính năng gia tăng giá trị cho Portfolio:

### Tính năng 1: Tích hợp công cụ tự động quét bảo mật & Dependabot
- **Lý do:** Dự án đang chạy self-hosted và sử dụng Node/Bun, cần giám sát tự động để tránh lỗ hổng zero-day ở dependencies.
- **Triển khai:** Thêm file `.github/dependabot.yml` để Github tự tạo PR cập nhật khi có bản vá. Tích hợp thêm step chạy `TruffleHog` hoặc Snyk trong file `.github/workflows/deploy.yml` để quét mã độc/lộ token trước bước `Build`.

### Tính năng 2: Thêm trang `Bug Bounty` và `Security Status`
- **Lý do:** Thể hiện sự chuyên nghiệp của chủ nhân Portfolio - một kỹ sư quan tâm đến bảo mật và có trách nhiệm với code của mình.
- **Triển khai:** Tận dụng thư mục `src/pages/api/bug-bounty/` và template markdown `TEMPLATES_BLOG.md`. Sử dụng API để nhận các báo cáo qua Telegram và một trang `/security` hoặc `/bug-bounty` render bằng React để hiển thị chính sách (Security Policy).

### Tính năng 3: Xây dựng AI Assistant làm "Security Advisor"
- **Lý do:** Dự án đã có sẵn `@ai-sdk/react` và file `AI_AGENT_INSTRUCTIONS.md`. Tính năng này chứng minh năng lực kết hợp AI với Cybersecurity.
- **Triển khai:** Tạo một persona mới cho AI Assistant chuyên môn về bảo mật, nạp trước (pre-prompt) kiến trúc của dự án. Khách truy cập có thể hỏi bot về "Cách dự án này phòng chống XSS" hoặc "Kiến trúc hệ thống này an toàn như thế nào".

### Tính năng 4: Tự động gửi báo cáo "Health Check & Security" qua Telegram hàng ngày
- **Lý do:** Chủ động giám sát hệ thống server thay vì đợi sự cố.
- **Triển khai:** Tạo script cron job chạy bằng Bun (`scripts/daily-health-check.ts`). Script này sẽ kiểm tra response của website, xem error logs từ Nginx/PM2, và gọi Telegram Bot API (đã có sẵn code ở `src/lib/telegram.ts`) để gửi báo cáo mỗi buổi sáng.

### Tính năng 5: Dashboard kiến trúc bảo mật với Mermaid.js
- **Lý do:** Thể hiện trực quan tư duy hệ thống (System Design), giúp nhà tuyển dụng hoặc client dễ ấn tượng.
- **Triển khai:** Viết một bài blog theo template "Case Study" về thiết kế kiến trúc Self-hosted. Nhúng Mermaid.js component (`<Mermaid>`) vẽ biểu đồ C4 Model (Context, Container) cho dự án, đánh dấu rõ các luồng dữ liệu (Data Flow) và các firewall/proxy bảo mật.