# Báo cáo Phân tích Bảo mật Dự án Portfolio (truongnat/portfolio)

Dưới đây là báo cáo đánh giá chi tiết về tình trạng bảo mật hiện tại của dự án portfolio dựa trên mã nguồn, các tệp cấu hình và quy trình phát triển. Báo cáo bao gồm phân tích lỗ hổng, các đề xuất khắc phục ngay lập tức, cũng như các tính năng mới giúp nâng cao bảo mật.

---

## 1. Tóm tắt nhanh (Overall Security Score / Tình trạng chung)

**Đánh giá chung: Trung bình - Khá (6.5/10)**

Dự án thể hiện nền tảng kiến trúc ổn định với tech stack hiện đại (Astro, React, Zod). Đã có ý thức cơ bản về bảo mật trong một số khía cạnh:
- Việc kiểm tra đầu vào (input validation) được thực hiện khá tốt tại các API routes và forms sử dụng thư viện **Zod** (như tại `api/contact.ts` và `api/stripe/create-payment.ts`).
- Mã nguồn React và Astro mặc định có khả năng chống XSS ở mức cơ bản.
- Đã có proxy ẩn API bên ngoài (ẩn Telegram API).
- Cấu hình server cơ bản (Nginx) đã bật một số Security Headers tiêu chuẩn (`X-XSS-Protection`, `X-Content-Type-Options`).

Tuy nhiên, dự án vẫn còn tồn tại các vấn đề cần xử lý, đặc biệt liên quan đến cấu hình CSP không an toàn (cho phép `unsafe-inline`, `unsafe-eval`), rủi ro lộ credential thông qua `process.env` tại API routes và thiếu cơ chế phòng thủ nâng cao (Rate Limiting mạnh, quét bảo mật tự động).

---

## 2. Chi tiết lỗ hổng

### 🔴 Mức độ Critical (Nghiêm trọng)
*Hiện tại không phát hiện lỗ hổng nghiêm trọng trực tiếp có thể chiếm quyền điều khiển hệ thống, nhưng có các rủi ro cần xử lý.*

### 🟠 Mức độ High (Cao)
1. **Lộ lọt logic xác thực bảo mật và thông tin cấu hình nội bộ (Hardcoded/Server-side variables)**
   - API Telegram ở `src/pages/api/contact.ts` lấy trực tiếp cấu hình qua `process.env.TELEGRAM_BOT_TOKEN`. Mặc dù an toàn hơn việc phơi bày trên frontend, nhưng cách lưu trữ biến môi trường ở dạng raw và không có cơ chế quay vòng (rotation) có thể là một điểm yếu nếu máy chủ bị xâm nhập.
2. **Cấu hình CSP (Content Security Policy) nguy hiểm**
   - Trong tệp `nginx.conf`, cấu hình CSP đang cho phép: `default-src 'self' 'unsafe-inline' 'unsafe-eval' ...`. Điều này làm vô hiệu hóa khả năng chống XSS của CSP, cho phép attacker có thể chèn các đoạn script độc hại hoặc chạy script tùy ý qua thẻ style/script.

### 🟡 Mức độ Medium (Trung bình)
1. **Rủi ro XSS tiềm ẩn với `set:html` (Astro)**
   - Trong `src/components/seo/Schema.astro:85`, mã nguồn sử dụng: `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`. Việc không xử lý thay thế ký tự `<` thành `\u003c` có thể mở đường cho XSS nếu dữ liệu `schema` có chứa các đầu vào không được kiểm soát (như tiêu đề bài viết từ người dùng hoặc Markdown).
2. **Bypass Rate Limiting (Giới hạn truy cập API)**
   - Form liên hệ (`ContactForm.client.tsx`) và API Endpoint `/api/contact` hiện đang dựa vào bộ nhớ `localStorage` ở client-side để thực hiện rate-limiting. Bất kỳ người dùng (hoặc bot) nào có thể xóa localStorage hoặc bypass trình duyệt và gọi thẳng API bằng `curl`/`Postman` để gửi spam liên tục, tiêu tốn tài nguyên hoặc spam hộp thư Telegram.
3. **Quản lý Dependencies lỗi thời (Dependencies vulnerabilities)**
   - Khi chạy kiểm tra, nhiều package đang sử dụng đã cũ so với phiên bản hiện tại (ví dụ: `lucide-react` đang ở `^0.562.0` có thể bị lỗi icon nếu lên bản `1.x`, `eslint` đang ở `^10.0.3` có cảnh báo lỗi thời, v.v.).

### 🟢 Mức độ Low (Thấp)
1. **Quy trình CI/CD thiếu kiểm tra bảo mật tự động**
   - Workflow `.github/workflows/deploy.yml` chủ yếu thực hiện Build & Deploy. Không có bất kỳ steps nào chạy Dependency Audit (VD: `bun pm untrusted` hay `npm audit`) hoặc quét SAST (Static Application Security Testing).

---

## 3. Đề xuất khắc phục ngay (Quick Wins)

1. **Sửa cấu hình Content Security Policy (CSP)**
   - *Hành động:* Xóa `'unsafe-eval'` khỏi `default-src` và thêm nonce hoặc hash cho các script inline trong cấu hình Astro/Nginx.
2. **Thêm Rate Limiting thực sự ở Server-side**
   - *Hành động:* Cập nhật API Endpoint `/api/contact` và các API khác để sử dụng một cơ chế rate limiter ở memory (VD: dùng `Map` lưu trữ IP client thông qua Header `X-Real-IP` truyền từ Nginx) hoặc Redis để chặn spam thật sự.
3. **Vá lỗi XSS ở JSON-LD**
   - *Hành động:* Sửa đổi `src/components/seo/Schema.astro` thành:
     `<script type="application/ld+json" set:html={JSON.stringify(schema).replace(/</g, '\\u003c')} />`
     để vô hiệu hóa các ký hiệu chèn script độc hại trong payload JSON.
4. **Cập nhật Dependencies**
   - *Hành động:* Chạy các công cụ quét phụ thuộc (`npm-check-updates` hoặc `bun x npm-check-updates`) để review và cập nhật các gói lên phiên bản không có lỗ hổng.

---

## 4. Khoảng trống bảo mật cần lưu ý

- **Không có cơ chế ngăn chặn DDoS (DDOS Protection/WAF):** Hệ thống được tự host trên Nginx và triển khai trực tiếp, hiện chưa thấy lớp WAF (Web Application Firewall) như Cloudflare bảo vệ. Nếu có người thực hiện Flood Request, máy chủ sẽ sập (Out of memory).
- **Trình trạng CI/CD không an toàn 100%:** Việc chạy `bun install` và deploy thực thi trực tiếp trên Self-hosted Runner với user có quyền `sudo` (như ở đoạn `sudo cp`, `sudo systemctl`) là một rủi ro leo thang đặc quyền lớn nếu dự án dính mã độc từ một library bên ngoài.
- **Dependency Audit:** Do dùng `bun`, `npm audit` mặc định sẽ không chạy được. Dự án thiếu một pipeline chuyên biệt kiểm tra dependency cho Bun environment.

---

## 5. Ý tưởng tính năng mới (Feature Suggestions)

Dựa trên cấu trúc dự án và stack (Astro, AI, React, CI/CD), dưới đây là các tính năng giá trị nên thêm vào portfolio:

### 1. Tích hợp Quét bảo mật tự động & Bot cảnh báo Telegram
- **Lý do:** Cho thấy khả năng quản lý DevSecOps của bạn, áp dụng thực tế bảo mật vào hạ tầng tự host (Self-hosted).
- **Triển khai:** Viết một script chạy bằng cronjob hoặc GitHub Actions. Mỗi ngày tự động chạy rà quét (Ví dụ: `bun pm untrusted` + phân tích log lỗi Nginx qua terminal api). Nếu phát hiện điểm bất thường hoặc thư viện lỗi thời, tự động gửi cảnh báo về Telegram bot thông qua biến môi trường đã cấu hình sẵn của hệ thống (`TELEGRAM_BOT_TOKEN`).

### 2. Dashboard trạng thái bảo mật của hệ thống (Security Posture Dashboard)
- **Lý do:** Tăng độ uy tín của Portfolio khi khách truy cập có thể xem tình trạng health/security của dự án trong thời gian thực.
- **Triển khai:** Thêm một trang `/security` (hoặc nhúng vào `/tech-radar`). Bảng điều khiển này (sử dụng component React) gọi tới một API giả lập (hoặc thực) hiển thị điểm đánh giá Security Headers, kết quả Audit Dependencies gần nhất (đọc từ file JSON sinh ra bởi CI/CD), và trạng thái WAF.

### 3. Nhật ký "Security Changelog" minh bạch
- **Lý do:** Rất nhiều công ty đánh giá cao ứng viên chủ động vá lỗi và minh bạch với cộng đồng.
- **Triển khai:** Thêm một tệp `SECURITY.md` và viết một chuyên mục riêng trong trang Blog (VD: Security Advisories). Dùng Astro Content Collections để render ra giao diện đẹp mắt các lỗ hổng đã được vá trong hệ thống.

### 4. Sơ đồ mô hình luồng dữ liệu bảo mật (Bằng Mermaid.js)
- **Lý do:** Codebase đã có tích hợp Mermaid. Cung cấp tài liệu trực quan giúp nhà tuyển dụng/khách hiểu ngay kiến trúc hệ thống bạn xây dựng.
- **Triển khai:** Sử dụng Mermaid để vẽ các sơ đồ luồng dữ liệu (Data Flow Diagram - DFD) về quá trình gửi form liên hệ qua API tới Telegram, luồng thanh toán Stripe, chỉ ra các vùng Trust Boundary (vùng tin cậy) trong tệp `README.md` hoặc một bài viết trên Blog để giải thích về bảo mật.

### 5. Cải tiến AI Assistant (Security Context)
- **Lý do:** Portfolio có hệ thống Agent/AI. Cho phép AI trả lời câu hỏi về chính bảo mật của dự án là một tính năng cực kỳ ấn tượng.
- **Triển khai:** Cập nhật file `AI_AGENT_INSTRUCTIONS.md` (hoặc RAG database LanceDB đang dùng) bằng cách nhúng các báo cáo bảo mật và kiến trúc của hệ thống. Khi người dùng hỏi: *"Dự án này bảo vệ form liên hệ như thế nào?"*, AI có thể đọc Vector Database và trả lời bằng cách viện dẫn Zod Validation và Nginx.
