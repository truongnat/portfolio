# Báo Cáo Đánh Giá Bảo Mật và Đề Xuất Tính Năng - Astro Portfolio

## Tóm tắt nhanh (Overall Security Score)
- **Điểm đánh giá**: Tốt (Medium-High Security)
- **Tình trạng chung**: Dự án tuân thủ khá tốt các best practice bảo mật (không log PII, validate bằng Zod, cấu hình Nginx tốt, có CSP). Tuy nhiên, vẫn tồn tại một số điểm yếu ở dependency management, lỗ hổng lộ thông tin cấu hình cho môi trường preview, và chưa thực thi mạnh mẽ Content-Security-Policy cho inline-scripts/styles.

## Chi tiết lỗ hổng

### Mức độ: High
- **Thiếu kiểm soát Dependencies (Bun/NPM)**:
  - File `bun.lock` (khác với package-lock.json) có nhiều package đã có phiên bản mới hơn. Ví dụ `lucide-react`, `tailwindcss`, `eslint`...
  - Không có công cụ kiểm tra vulnerability tự động trong CI.
- **Rủi ro API Endpoint Mock (Stripe & Terminal)**:
  - `src/pages/api/terminal/execute.ts` dùng cho mục đích Takeover / Terminal mock nhưng có rủi ro nếu có bug ở `stubUnavailableInProduction` trong tương lai sẽ bị RCE hoặc expose thông tin.
  - `src/pages/api/stripe/create-payment.ts` tuy đã block ở PROD nếu thiếu key nhưng logic fallback mock payment intent dễ gây rối ở các staging environment.

### Mức độ: Medium
- **Sử dụng `dangerouslySetInnerHTML` và `set:html`**:
  - `src/components/seo/Schema.astro` sử dụng `set:html={JSON.stringify(schema)}`. Dù `schema` là dữ liệu tĩnh hoặc kiểm soát từ config, nhưng nếu author name / description bị thay đổi thông qua một nguồn external nào đó thì sẽ gây XSS.
  - `.kiro/specs/markdown-blog-migration/design.md` và `.agents/skills/.../AGENTS.md` đề cập tới `dangerouslySetInnerHTML`. Cần audit kĩ các file frontend có liên quan khi parse Markdown/HTML.
- **Content-Security-Policy (CSP) lỏng lẻo**:
  - Trong `nginx.conf`: `add_header Content-Security-Policy "... default-src 'self' 'unsafe-inline' 'unsafe-eval' ..."`
  - `unsafe-inline` và `unsafe-eval` làm giảm sức mạnh phòng thủ của CSP khỏi XSS. Đặc biệt `unsafe-eval` rất nguy hiểm nếu ứng dụng không thực sự cần nó trên production (react hybrid có thể cần cho một số dev tools nhưng prod thì nên bỏ).
- **Hardcode Basic Auth Credentials Location**:
  - Trong preview server block (`nginx.conf`): `auth_basic_user_file /etc/nginx/.htpasswd-preview;`. File này nếu không setup quyền kĩ sẽ bị đọc (dù đã set external server file system). Cần đảm bảo quyền file là `600` hoặc `400`.

### Mức độ: Low
- **Lộ Secret Environment (`process.env` và `import.meta.env`)**:
  - API Contact dùng `process.env.TELEGRAM_BOT_TOKEN`, được bọc sau `POST /api/contact` rất tốt.
  - API Stripe Webhook lấy `STRIPE_WEBHOOK_SECRET` an toàn.
  - *Tuy nhiên* biến `import.meta.env.CERTIFICATE_SIGNING_SECRET` không rõ có được handle an toàn nếu có bug expose env trong Astro build hay không (đôi khi Astro có thể leak biến `import.meta.env` vào client bundle nếu không cẩn thận).
- **Rò rỉ phiên bản phần mềm**:
  - `nginx.conf` đã có `server_tokens off;` (Tốt).
  - Tuy nhiên `import.meta.env.APP_VERSION` và `APP_HASH` được expose ra `portfolio.md.ts` và có thể bị bot đọc được.

## Đề xuất khắc phục ngay (Quick Wins)
1. **Sửa đổi Nginx CSP**: Xóa `unsafe-eval` khỏi `nginx.conf` cho thẻ `default-src`. Thay vì `unsafe-inline`, hãy áp dụng nonce hoặc strict-dynamic cho Astro.
2. **Cập nhật Dependencies**: Chạy `bun x npm-check-updates -u` và `bun install` để đưa các package về bản patch/minor mới nhất nhằm vá lỗi bảo mật (cần cẩn thận với lucide-react do breaking changes).
3. **Setup snyk hoặc npm audit**: Thêm step quét security cho Bun vào Github Actions (`.github/workflows/deploy.yml`).
4. **Kiểm tra đầu vào (Input Validation)**: Dù đã có `Zod`, cần rate limit các API `POST /api/contact` và `/api/stripe/create-payment` (có thể config bằng Nginx zone rate limit).

## Khoảng trống bảo mật cần lưu ý
- **Thiếu Rate Limiting**: Frontend có track rate limit bằng `localStorage` cho form liên hệ, nhưng rất dễ bị bypass. Cần implement rate limiting ở Nginx backend (sử dụng `limit_req_zone`).
- **Thiếu công cụ bảo mật tự động**: CI workflow (`deploy.yml`) chỉ chạy `lint`, `check`, và `build`. Thiếu SAST (Static Application Security Testing) và SCA (Software Composition Analysis).

## Ý tưởng tính năng mới (Tính năng Đề xuất)

1. **Dashboard Trạng Thái Bảo Mật (Security Health Dashboard)**
   - **Lý do**: Khẳng định kĩ năng DevSecOps của chủ portfolio với các nhà tuyển dụng.
   - **Triển khai**: Tạo trang `/security` (hoặc tab trong `/admin`), gọi API backend lấy report từ Snyk/Dependabot/GitHub Security API hoặc tự động chạy `bun pm untrusted` và hiển thị kết quả. Dùng `lucide-react` để iconize status (Xanh/Đỏ/Vàng).

2. **Security Changelog (Ghi nhận Bản vá Bảo mật)**
   - **Lý do**: Minh bạch về cách maintain code và xử lý lỗ hổng, tăng độ trust.
   - **Triển khai**: Thêm Content Collection `security-log`. Tạo trang list các CVE đã patch (ví dụ: "Cập nhật dependency X để fix CVE-2024-XXX"). Sử dụng `<Mermaid>` để vẽ biểu đồ threat model cho mỗi lỗ hổng.

3. **Cải tiến AI Assistant bằng Security Knowledge (DevSecOps AI)**
   - **Lý do**: Biến Assistant không chỉ trả lời về kĩ năng cá nhân mà còn có thể trả lời các câu hỏi: "Kiến trúc dự án này có an toàn không?".
   - **Triển khai**: Cập nhật prompt ở `search.ts` và vector DB của `LanceDB`. Thêm documents về security practices của repository vào folder `data/` để AI có embedding.

4. **Automated Weekly Security Scan Report (Báo cáo Bot Telegram)**
   - **Lý do**: Dựa trên tích hợp Telegram đã có, gửi cảnh báo sớm khi có dependency cũ hoặc vulnerability mới.
   - **Triển khai**: Tạo Github Action Workflow chạy mỗi tuần (cron), sử dụng `bun pm untrusted` hoặc các script kiểm tra cấu hình. Nếu có cảnh báo, gọi `POST /api/contact` (với role/token đặc biệt) để bắn tin nhắn tới Telegram cá nhân.

5. **Security Bug Bounty "CTF" (Thử thách tìm lỗi)**
   - **Lý do**: Một tính năng cực kì thú vị cho 1 developer. Tạo 1 trang CTF nhỏ (ví dụ: `bug-bounty-data.ts` đã có sãn trong code base).
   - **Triển khai**: Dựng 1 page `/challenge` có cố ý chừa 1 lỗ hổng nhỏ (ví dụ XSS an toàn trên DOM ảo không ảnh hưởng database) và setup 1 webhook. Nếu ai khai thác thành công sẽ được vinh danh trên `Hall of Fame` bảng xếp hạng.
