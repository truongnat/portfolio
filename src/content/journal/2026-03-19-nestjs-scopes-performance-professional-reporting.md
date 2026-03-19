---
title: "NestJS Scopes Performance, Multi-tenancy Pitfalls, and the Art of Professional Reporting"
date: 2026-03-19
type: "day"
summary: "Day 3/100 of #100DaysArchitect focusing on NestJS injection scopes, the performance cost of Request Scope in multi-tenant apps, and professional reporting as a career accelerator."
tags: ["NestJS", "Architecture", "Performance", "MultiTenancy", "Communication", "CareerGrowth"]
---

Hôm nay tôi tập trung vào việc tối ưu hóa hiệu năng trong kiến trúc NestJS khi làm việc với Multi-tenancy và rèn luyện kỹ năng viết báo cáo chuyên nghiệp — một "vũ khí bí mật" để nâng tầm giá trị bản thân trong mắt đồng nghiệp và cấp trên.

## Những gì tôi đã làm

### 1. NestJS Injection Scopes: Tối ưu và Đánh đổi

Tôi đã đào sâu vào 3 loại Scope chính trong NestJS để hiểu rõ tại sao "Default" luôn là lựa chọn ưu tiên:

- **DEFAULT (Singleton)**: Instance được tạo một lần và dùng chung toàn ứng dụng. Đây là mức hiệu năng cao nhất, ít tốn bộ nhớ nhất.
- **TRANSIENT**: Một instance mới được tạo cho mỗi consumer (mỗi khi được inject). Ít dùng nhưng hữu ích cho các service không giữ trạng thái (stateless).
- **REQUEST**: Một instance mới được tạo cho **mỗi request** đến.

**Vấn đề với Request Scope trong Multi-tenant:**
Nhiều hệ thống Multi-tenant sử dụng Request Scope để lấy `tenant_id` từ header và cấu hình database connection/context. Tuy nhiên, cái giá phải trả rất đắt:
- **Hiệu năng giảm mạnh**: NestJS phải khởi tạo lại toàn bộ "dependency tree" của provider đó cho mỗi request. Nếu service A (Request Scope) phụ thuộc vào service B, C, D... thì cả cây đó phải được tái tạo.
- **Áp lực Garbage Collection (GC)**: Việc tạo hàng ngàn object ngắn hạn rồi xóa chúng liên tục khiến CPU phải làm việc vất vả để dọn dẹp bộ nhớ.
- **Tính lan truyền (Bubble-up)**: Nếu một Provider là Request Scope, thì bất kỳ Provider nào inject nó cũng tự động trở thành Request Scope.

**Giải pháp thay thế**: Sử dụng **AsyncLocalStorage (ALS)** của Node.js. Nó cho phép lưu trữ context (như tenant_id) xuyên suốt vòng đời request mà không cần biến toàn bộ service thành Request Scope, giữ được lợi ích hiệu năng của Singleton.

### 2. Nghệ thuật báo cáo: Viết chuẩn để được đánh giá cao

Tôi nhận ra rằng: **Làm tốt là điều kiện cần, nhưng báo cáo tốt mới là điều kiện đủ để người khác công nhận năng lực của bạn.**

Một bản báo cáo "chuẩn chỉ" không chỉ là liệt kê công việc, mà là một phương pháp xây dựng thương hiệu cá nhân:
- **Tín hiệu (Signal) > Tiếng ồn (Noise)**: Tập trung vào kết quả và tác động (impact), không sa đà vào kể lể quá trình vụn vặt.
- **Cấu trúc kim tự tháp**: Luôn bắt đầu bằng kết luận hoặc thành tựu quan trọng nhất, sau đó mới đến chi tiết.
- **Tính chủ động**: Không chỉ báo cáo vấn đề, hãy luôn đi kèm với giải pháp hoặc các bước tiếp theo (Next steps).
- **Ngôn ngữ chuyên nghiệp**: Sử dụng thuật ngữ chính xác, trình bày mạch lạc thể hiện tư duy logic của một kỹ sư trình độ cao.

**Bài học**: Khi bạn viết một báo cáo rõ ràng, người đọc (Manager/Client) sẽ cảm thấy tin tưởng vì họ thấy được sự kiểm soát (under control) và sự tôn trọng thời gian của họ từ phía bạn.

## Thách thức & Giải pháp

**Thách thức**: Quyết định khi nào nên chuyển từ Request Scope sang AsyncLocalStorage trong dự án hiện tại.
**Giải pháp**: Đo lường (Benchmark) thực tế. Nếu số lượng request cao và logic khởi tạo phức tạp, việc chuyển sang ALS là bắt buộc để duy trì độ trễ (latency) thấp.

## Kết quả

- Hiểu sâu về cơ chế khởi tạo và quản lý bộ nhớ của NestJS ✓
- Nắm vững chiến lược Multi-tenancy hiệu năng cao ✓
- Hoàn thiện tư duy viết báo cáo theo phong cách Senior/Lead ✓
- Action item: Review lại các service đang dùng `@Inject(REQUEST)` để xem xét thay thế bằng ALS.

---
"Performance is a feature, and professional communication is a multiplier for your career."
