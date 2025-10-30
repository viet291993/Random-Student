# Random Gọi Tên (Quay Vòng Quay Chọn Học Sinh)

## Giới thiệu
Random Gọi Tên là một ứng dụng web giúp giáo viên hoặc người tổ chức quay số ngẫu nhiên để gọi tên học sinh dựa trên danh sách ảnh. Giao diện hiện đại, hiệu ứng đẹp, dễ sử dụng cho thuyết trình lớp học, bốc thăm, quay thưởng, hoặc tổ chức trò chơi.

## Tính năng
- Chọn ngẫu nhiên học sinh bằng hình ảnh, tên.
- 2 chế độ giao diện: Vòng tròn (Circle) hoặc Lưới (Grid).
- Tùy chỉnh danh sách sinh viên (nhập/xuất file hoặc nhập trực tiếp).
- Cài đặt thời gian quay, tốc độ, âm thanh hiệu ứng tick/chiến thắng.
- Loại khỏi vòng tiếp theo sau mỗi lần được chọn (có thể cấu hình).
- Hỗ trợ phím tắt thao tác nhanh, trình chiếu toàn màn hình dễ dàng.
- Tự động lưu cấu hình, danh sách và trạng thái loại trừ qua LocalStorage.
- Đọc tên học sinh bằng tiếng Việt (Text-to-Speech).
- Hiệu ứng confetti chúc mừng khi học sinh được chọn.

## Hướng dẫn sử dụng
1. **Cài đặt, mở ứng dụng:**
   - Không cần cài đặt, chỉ cần mở file `index.html` trên trình duyệt hiện đại (Chrome, Edge, Firefox...)

2. **Thêm/Xuất/Xóa danh sách ảnh:**
   - Nhấn *"Danh sách ảnh"* để chỉnh sửa danh sách: nhập tên file theo từng dòng hoặc nhập từ file (.txt hoặc .json)
   - Ảnh cần đặt tại thư mục `images/` cùng thư mục với mã nguồn, tên trùng với danh sách
   - Có thể xuất danh sách ảnh hiện tại về máy tính

3. **Các nút chức năng chính:**
   - **Bắt đầu/Dừng (Space):** Quay chọn tên/hình ngẫu nhiên
   - **Hoàn tác (U):** Quay lại học sinh vừa loại trừ
   - **Đặt lại (R):** Đặt lại tất cả học sinh
   - **Toàn màn hình (F):** Chế độ toàn màn hình
   - **Cấu hình (C):** Mở phần cài đặt thời gian, tốc độ, hiệu ứng, giao diện...
   - **Phím tắt (Xem thêm trong mục "Phím tắt")**

4. **Cài đặt & Giao diện:**
   - Chọn kiểu vòng tròn hoặc lưới, chỉnh avatar-size, tốc độ quay, loại bỏ khỏi vòng sau khi được chọn...
   - Có thể khôi phục mặc định dễ dàng

5. **Âm thanh & Đọc tên:**
   - Hỗ trợ âm tick, âm thắng, lẫn đọc tên học sinh bằng tiếng Việt (máy tính cần có tính năng Text-to-Speech)

6. **Lưu ý:**
   - Ảnh học sinh cần đúng tên, định dạng (`jpg`, `png`, `jpeg`...) và đặt ở thư mục `images/`
   - Hệ thống tự động ghi nhớ cấu hình và danh sách khi bạn sử dụng trình duyệt trên cùng máy tính.

## Cấu trúc thư mục
- `index.html`     : Trang web chính
- `css/`           : Thư mục chứa style giao diện
- `js/`            : Các file JS xử lý logic, hiệu ứng, lưu trữ...
- `images/`        : Chứa ảnh học sinh dùng cho vòng quay
- `styles.css`     : CSS tổng hợp dự phòng

## Đóng góp & Phát triển
- Dự án thuần HTML, CSS, JS - không phụ thuộc framework
- Có thể chỉnh sửa, thay đổi tùy ý phục vụ mục đích cá nhân/giảng dạy
- Vui lòng giữ lại credit nếu chia sẻ lại!

---
**Tác giả:** viet291993@gmail.com, 2025
