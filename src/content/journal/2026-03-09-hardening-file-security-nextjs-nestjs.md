---
title: "Hardening File Security in Next.js & NestJS"
date: 2026-03-09
type: "day"
summary: "Designed and implemented a robust file-validation pipeline for Next.js and NestJS, covering DoS prevention, file spoofing, polyglot detection, and PDF script/action hardening."
tags: ["Security", "Next.js", "NestJS", "File Validation", "PDF", "Upload Pipeline"]
---

Hôm nay mình tập trung vào việc **hardening luồng upload file** cho cả **Next.js** và **NestJS**, với mục tiêu giảm rủi ro từ file độc hại ngay tại tầng validation.

## Những gì đã xử lý

1. **Chuẩn hóa security pipeline cho file upload** giữa Next.js và NestJS để cùng một bộ quy tắc bảo mật được áp dụng xuyên suốt.
2. **Nâng cấp validation engine** để kiểm tra cả metadata lẫn cấu trúc thực tế của file, thay vì chỉ dựa vào extension.

## Các lớp bảo vệ chính

### 1. DoS protection
- Áp dụng **giới hạn dung lượng file**.
- Thiết lập **ngưỡng kích thước ảnh / độ phân giải** để chặn file tiêu tốn tài nguyên bất thường.
- Bổ sung cơ chế phòng **decompression bomb**.

### 2. Path traversal prevention
- Thực hiện **basename sanitization** để loại bỏ khả năng chèn đường dẫn độc hại (`../`, absolute path...).

### 3. Spoofing detection
- Kiểm tra chéo **extension ↔ magic-byte** để phát hiện file giả mạo định dạng.
- Magic-byte được đối soát:
  - `PNG`: `89 50 4E 47 0D 0A 1A 0A`
  - `JPEG`: `FF D8 FF`
  - `WebP`: `RIFF????WEBP`
  - `PDF`: `%PDF-`

### 4. Polyglot detection
- Kiểm tra tính toàn vẹn đuôi file theo chuẩn định dạng:
  - `PNG`: xác minh marker `IEND`
  - `JPEG`: xác minh marker `EOI`
  - `WebP`: kiểm tra tính hợp lệ của `RIFF-size`

### 5. PDF hardening
- Kiểm tra **PDF version** và **EOF**.
- Quét các **dictionary key nguy hiểm** có thể kích hoạt hành vi nhúng script/action/file (ví dụ nhóm key liên quan JavaScript, action, embedded files).

### 6. Error transparency
- Lỗi hệ thống được **log đầy đủ** và **re-throw về 500** khi phù hợp.
- Tránh tình trạng nuốt lỗi kỹ thuật thành `400` gây nhiễu điều tra.

## Kết quả trong ngày

Pipeline validate hiện tại đã chuyển từ mô hình “check bề mặt” sang mô hình **defense-in-depth**, giúp giảm đáng kể rủi ro:
- Upload file giả mạo MIME/extension.
- File polyglot vượt qua parser.
- Payload ẩn trong PDF.
- Tấn công làm cạn tài nguyên qua file kích thước hoặc cấu trúc bất thường.

Ngày mai mình sẽ tiếp tục bổ sung test case theo từng nhóm tấn công để benchmark độ bao phủ và false-positive rate.
