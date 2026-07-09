# Báo Cáo Kiểm Tra Bảo Mật & Đề Xuất Tính Năng (Security Audit Report)

## Tóm Tắt Nhanh (Overall Security Score)

**Trạng thái chung**: **Trung bình - Khá (B)**.
Dự án sử dụng tech stack hiện đại (Astro, React, Bun) có mức độ bảo mật mặc định tốt, giảm thiểu nhiều rủi ro phổ biến như XSS (nhờ cơ chế escape mặc định của React và Astro). Tuy nhiên, với vai trò là một portfolio có chứa các tính năng tương tác (form liên hệ, tích hợp Stripe, webhook), ứng dụng vẫn còn thiếu sót về rate limiting ở phía server, thiết lập Content Security Policy (CSP) chưa đủ nghiêm ngặt, và chưa tích hợp tự động hóa quét bảo mật trong quy trình CI/CD.

---

## Chi Tiết Lỗ Hổng (Vulnerability Details)

### Mức độ: High (Cao)
*   **Rate Limiting ở Client-side (Bypass dễ dàng):** Form liên hệ tại `src/components/ContactForm.client.tsx` dựa vào `localStorage` để giới hạn số lần gửi form (60 giây/lần). Kẻ tấn công có thể dễ dàng xóa cache hoặc gọi trực tiếp API `/api/contact` để thực hiện Spam/DDoS.
*   **Stripe Metadata Parsing (Đã được phát hiện trong memory):** Tại `src/pages/api/stripe/create-payment.ts`, API endpoint đang chuyển đổi metadata thành chuỗi JSON thay vì định dạng `metadata[key]` chuẩn của Stripe khi sử dụng `URLSearchParams`. Điều này có thể dẫn đến lỗi xử lý thanh toán.

### Mức độ: Medium (Trung Bình)
*   **Content-Security-Policy (CSP) lỏng lẻo:** Nginx config (`nginx.conf`) sử dụng `'unsafe-inline'` và `'unsafe-eval'`. Điều này mở ra rủi ro cho các cuộc tấn công Cross-Site Scripting (XSS), đặc biệt nếu mã nguồn hoặc bên thứ ba thêm script độc hại.
*   **Thiếu bảo mật cho API nội bộ (Search API):** Endpoint `/api/search` không có rate limit, việc gọi API liên tục có thể lợi dụng tài nguyên server (Vector Search/LanceDB).
*   **Thiếu quét bảo mật ở CI/CD Pipeline:** File `.github/workflows/deploy.yml` chỉ chạy `lint`, `check` và `build` nhưng không có bước quét mã nguồn (SAST) hoặc kiểm tra lỗ hổng dependency.

### Mức độ: Low (Thấp)
*   **Dependency Management:** Việc sử dụng Bun lockfile không cho phép chạy `npm audit` truyền thống. Cần một công cụ thay thế (như `bun pm untrusted`) để theo dõi các dependency lỗi thời, ví dụ như gói `lucide-react` (hiện tại phiên bản 0.562.0) có các thay đổi breaking khi cập nhật, cần được quản lý chặt chẽ.
*   **Rủi ro từ các thư viện AI / Phụ thuộc Data Local:** Project tích hợp `@xenova/transformers` và `@lancedb/lancedb`. Dữ liệu tĩnh, nếu bị ghi đè không được xác thực, có thể dẫn đến Data Poisoning.

---

## Đề Xuất Khắc Phục Ngay (Quick Wins)

1.  **Sửa lỗi Rate Limiting:**
    *   Di chuyển logic rate limiting từ `ContactForm.client.tsx` sang server. Có thể thiết lập cấu hình giới hạn số lượng request theo IP tại Nginx. Thêm block sau vào file `nginx.conf`:
        ```nginx
        limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/m;
        # Trong location /api/contact/
        limit_req zone=api_limit burst=10 nodelay;
        ```
2.  **Sửa lỗi API Stripe (`src/pages/api/stripe/create-payment.ts`):**
    *   Thay vì `metadata: JSON.stringify({...})`, phải lặp qua các cặp key-value để thêm `metadata[keyId]=value` vào `URLSearchParams`.
3.  **Làm chặt CSP trong Nginx:**
    *   Thử loại bỏ `'unsafe-inline'` và `'unsafe-eval'`. Nếu Astro/React thực sự cần inline script cho hydration, hãy cấu hình sử dụng Nonce (tạo một nonce mỗi request) hoặc hash thay vì cấp phép diện rộng.

---

## Khoảng Trống Bảo Mật Cần Lưu Ý (Security Gaps)

1.  **Thiếu Công cụ Tự động Quét (Automation Security):**
    *   Không có công cụ SAST (Static Application Security Testing) phân tích code tĩnh như SonarQube hoặc GitHub CodeQL trong `.github/workflows/deploy.yml`.
    *   Thiếu công cụ DAST / Dependency checker (Snyk, Dependabot).
2.  **Thiếu Header An Ninh Mở Rộng:**
    *   Mặc dù có `X-XSS-Protection` và `X-Content-Type-Options`, vẫn thiếu các header như `Strict-Transport-Security` (HSTS) và `Referrer-Policy`.
3.  **Quản Lý Secret:**
    *   Hiện tại hệ thống dựa vào `.env` không commit. Tuy nhiên, việc deploy lên VPS self-hosted thông qua GitHub Action (PM2/Nginx) đòi hỏi một giải pháp quản lý cấu hình environment tốt hơn, ví dụ: Github Secrets bơm vào lúc build hoặc AWS Systems Manager Parameter Store thay vì để hardcode.

---

## Ý Tưởng Tính Năng Mới (Feature Suggestions)

Dựa trên bối cảnh của dự án (Portfolio, AI, Tech Radar, Web Terminal), sau đây là 4 tính năng bảo mật nổi bật có thể tăng giá trị cho Portfolio của bạn:

### 1. Dashboard "Security Status" Thời Gian Thực
*   **Lý do:** Khẳng định năng lực bảo mật và tính minh bạch của tác giả.
*   **Triển khai:** Xây dựng một trang `/security` hoặc một panel trong Admin Dashboard. Hiển thị điểm số bảo mật (từ SSL Labs, Security Headers API), thời gian uptime, chứng chỉ SSL và số lượng block từ Rate Limit. Có thể dùng dữ liệu giả lập nếu chưa có server thật, nhưng nếu tích hợp thật qua API thì càng ấn tượng.

### 2. Tích hợp Tự động hóa Bảo mật vào GitHub Actions (SAST)
*   **Lý do:** Hiện thực hóa quy trình DevSecOps, gây ấn tượng mạnh với nhà tuyển dụng (đặc biệt cho vị trí Product Manager / Kỹ sư).
*   **Triển khai:** Thêm bước `github/codeql-action` hoặc `snyk/actions` vào file `.github/workflows/deploy.yml`. Tích hợp Bot cập nhật Dependencies (như RenovateBot tương thích với Bun).

### 3. Nhật ký "Security Changelog" trong Journal
*   **Lý do:** Đã có hệ thống Journal / Blog rất tốt, việc thêm một tag #Security và ghi chú lịch sử phát hiện, vá lỗi chứng tỏ bạn liên tục quan tâm đến mã nguồn của mình.
*   **Triển khai:** Cập nhật `AI_AGENT_INSTRUCTIONS.md` để thêm loại nội dung "Security Postmortem". Viết một Blog Case Study (theo `TEMPLATES_BLOG.md`) phân tích việc bạn đã khắc phục lỗ hổng Rate Limiting và Stripe Metadata như thế nào.

### 4. Nâng Cấp "AI Assistant / Web Terminal" Để Hỏi Đáp Về Kiến Trúc Bảo Mật
*   **Lý do:** Tận dụng LanceDB và LLM (`@xenova/transformers`) có sẵn trong project.
*   **Triển khai:** Thêm một vector nhúng (embedding) mới cho các file như `nginx.conf`, `INFRASTRUCTURE_REPORT.md` hoặc `SECURITY_AUDIT_REPORT.md` (file này). Khi khách truy cập gõ lệnh `analyze security` trong Terminal Takeover hoặc hỏi AI Assistant: "Dự án này được bảo mật thế nào?", hệ thống sẽ truy xuất tài liệu và trả về câu trả lời chuyên sâu.
