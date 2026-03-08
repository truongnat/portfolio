---
title: "Mastering Row Level Security (RLS) in Databases"
date: 2026-03-08
type: "day"
summary: "Deep dive into RLS for granular data access control and multi-tenant security architecture."
tags: ["Database", "Security", "PostgreSQL", "RLS"]
---

Hôm nay mình dành thời gian nghiên cứu sâu về **Row Level Security (RLS)** - một tính năng cực kỳ quan trọng để bảo mật dữ liệu ở tầng Database, thay vì chỉ dựa vào Logic ở tầng Application.

### Những gì mình đã học được:

1.  **Khái niệm cơ bản:** RLS cho phép kiểm soát quyền truy cập đến từng dòng (row) cụ thể trong bảng dựa trên user đang đăng nhập. Điều này giúp ngăn chặn triệt để việc truy cập trái phép dữ liệu của người dùng khác (IdOR).
2.  **Cơ chế hoạt động:** 
    *   Sử dụng lệnh `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.
    *   Định nghĩa các **Policies** (chính sách) bằng ngôn ngữ SQL để quyết định dòng nào user được phép `SELECT`, `INSERT`, `UPDATE`, hay `DELETE`.
3.  **Ứng dụng trong Multi-tenancy:** RLS là "vũ khí" tối thượng khi xây dựng ứng dụng SaaS. Thay vì phải thêm điều kiện `WHERE user_id = ...` ở mọi câu query trong code, mình có thể cấu hình RLS để Database tự động lọc dữ liệu.

### Ví dụ thực tế (PostgreSQL):
```sql
-- Kích hoạt RLS cho bảng profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách: User chỉ được xem profile của chính mình
CREATE POLICY user_sel_own_profile ON profiles
    FOR SELECT
    USING (auth.uid() = user_id);
```

### Cảm nhận:
Việc đưa bảo mật xuống tầng Database giúp hệ thống trở nên "Robust" hơn rất nhiều. Ngay cả khi code Application có bug, dữ liệu của User vẫn được bảo vệ bởi lớp "giáp" cuối cùng này.

### Mục tiêu tiếp theo:
- Thử nghiệm RLS với Supabase auth.
- Đánh giá ảnh hưởng của RLS đến Performance khi bảng có hàng triệu record.
