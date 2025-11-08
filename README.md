# Game Collection - Random Student

## Giới thiệu

Dự án này là một bộ sưu tập các trò chơi tương tác, bắt đầu với **Random Gọi Tên** - ứng dụng quay chọn học sinh ngẫu nhiên bằng hình ảnh và tên.

## Cấu trúc dự án

```
Random-Student/
├── index.html              # Menu chính để chọn trò chơi
├── config/
│   └── games.js           # Cấu hình danh sách trò chơi (dễ mở rộng)
├── css/
│   ├── menu.css           # Style cho menu chính
│   └── theme-ui.css       # Style cho theme selector
├── js/
│   ├── menu.js            # Logic cho menu chính
│   ├── theme.js           # Logic quản lý theme
│   └── theme-ui.js        # UI cho theme selector
├── games/
│   ├── random-student/    # Trò chơi Random Gọi Tên
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   ├── images/
│   │   └── student.txt
│   └── mushroom-game/     # Trò chơi Cây Nấm
│       ├── index.html
│       ├── css/
│       ├── js/
│       └── images/
└── README.md
```

## Tính năng

### Menu chính
- Giao diện menu hiện đại với hiệu ứng glassmorphism
- Tự động load danh sách trò chơi từ config
- Dễ dàng thêm trò chơi mới
- Hệ thống theme toàn cục:
  - Nhiều theme mặc định: Tối, Sáng, Xanh dương, Xanh lá, Tím, Cam, Hồng
  - Theme tùy chỉnh: Tự tạo theme với màu sắc riêng
  - Theme áp dụng cho menu và tất cả games
  - Tự động lưu theme đã chọn qua LocalStorage
  - Chọn theme từ menu hoặc trong game

### Random Gọi Tên
- Chọn ngẫu nhiên học sinh bằng hình ảnh, tên
- 2 chế độ giao diện: Vòng tròn (Circle) hoặc Lưới (Grid)
- Tùy chỉnh danh sách sinh viên (nhập/xuất file hoặc nhập trực tiếp)
- Cài đặt thời gian quay, tốc độ, âm thanh hiệu ứng tick/chiến thắng
- Loại khỏi vòng tiếp theo sau mỗi lần được chọn (có thể cấu hình)
- Hỗ trợ phím tắt thao tác nhanh, trình chiếu toàn màn hình dễ dàng
- Tự động lưu cấu hình, danh sách và trạng thái loại trừ qua LocalStorage
- Đọc tên học sinh bằng tiếng Việt (Text-to-Speech)
- Hiệu ứng confetti chúc mừng khi học sinh được chọn
- Nút quay lại menu (phím tắt: M)

### Trò Chơi Cây Nấm
- Trò chơi giáo dục giúp học sinh nhận biết vần trong tiếng Việt
- Chọn các cây nấm có từ chứa vần cần tìm (ví dụ: ôn/ôt, an/at, en/et)
- Giao diện đẹp mắt với hình ảnh cây nấm và hiệu ứng glassmorphism
- Cài đặt linh hoạt:
  - Tùy chỉnh vần cần tìm
  - Danh sách từ đúng/sai có thể chỉnh sửa
  - Điều chỉnh cỡ chữ trên nấm
  - Xáo trộn từ khi bắt đầu
  - Bật/tắt âm thanh
- Hiệu ứng phản hồi:
  - Animation khi chọn đúng (nấm nở hoa)
  - Animation khi chọn sai (nấm lắc đầu)
  - Thông báo kết quả real-time
  - Hiệu ứng pháo hoa khi hoàn thành
- Theo dõi tiến độ:
  - Hiển thị số nấm đã chọn, đúng, sai
  - Trò chơi kết thúc khi tìm đủ tất cả nấm đúng
  - Modal hoàn thành với thống kê và điểm số
- Tính điểm thông minh:
  - Điểm cơ bản dựa trên số nấm đúng tìm được
  - Trừ điểm cho mỗi nấm sai đã chọn
- Hỗ trợ phím tắt: F (toàn màn hình), M (quay lại menu)
- Tự động lưu cấu hình qua LocalStorage

## Hướng dẫn sử dụng

1. **Mở ứng dụng:**
   - Mở file `index.html` trên trình duyệt hiện đại (Chrome, Edge, Firefox...)
   - Menu chính sẽ hiển thị danh sách các trò chơi có sẵn

2. **Chọn trò chơi:**
   - Click vào card trò chơi để bắt đầu
   - Hoặc sử dụng phím tắt nếu có

3. **Thay đổi theme:**
   - Click vào nút theme (biểu tượng palette) ở menu hoặc trong game
   - Chọn theme có sẵn hoặc tùy chỉnh theme riêng
   - Theme sẽ tự động áp dụng cho toàn bộ ứng dụng

4. **Quay lại menu:**
   - Trong game, nhấn nút "Quay lại menu" hoặc phím **M**

## Thêm trò chơi mới

Để thêm trò chơi mới, thực hiện các bước sau:

1. **Tạo folder trò chơi:**
   ```
   games/your-game-name/
   ```

2. **Thêm cấu hình vào `config/games.js`:**
   ```javascript
   {
     id: "your-game-name",
     name: "Tên Trò Chơi",
     description: "Mô tả trò chơi",
     icon: "casino", // Material Icons name
     path: "games/your-game-name/index.html",
     color: "#38bdf8", // Màu chủ đạo
   }
   ```

3. **Tạo file `index.html` trong folder trò chơi:**
   - Có thể tham khảo cấu trúc của `games/random-student/`

4. **Thêm nút quay lại menu (tùy chọn):**
   ```html
   <button id="btnBackToMenu" class="toolbar-btn" title="Quay lại menu (M)">
     <span class="material-icons-round">home</span>
   </button>
   ```
   ```javascript
   document.getElementById("btnBackToMenu").addEventListener("click", () => {
     window.location.href = "../../index.html";
   });
   ```

## Phím tắt

### Menu chính
- Click vào card để chọn trò chơi
- Click vào nút theme để thay đổi giao diện

### Random Gọi Tên
- **Space**: Bắt đầu/Dừng
- **U**: Hoàn tác
- **R**: Đặt lại
- **F**: Toàn màn hình
- **C**: Mở Cấu hình
- **D**: Mở Danh sách
- **M**: Quay lại menu
- **T**: Mở Theme selector

### Trò Chơi Cây Nấm
- **F**: Toàn màn hình
- **M**: Quay lại menu
- **C**: Mở Cài đặt
- **T**: Mở Theme selector
- **Esc**: Đóng cài đặt/theme

## Công nghệ

- Thuần HTML, CSS, JavaScript (không phụ thuộc framework)
- Giao diện glassmorphism hiện đại
- Material Icons
- LocalStorage để lưu trữ
- Text-to-Speech API
- CSS Variables và color-mix() cho hệ thống theme động

## Đóng góp & Phát triển

- Dự án thuần HTML, CSS, JS - không phụ thuộc framework
- Có thể chỉnh sửa, thay đổi tùy ý phục vụ mục đích cá nhân/giảng dạy
- Vui lòng giữ lại credit nếu chia sẻ lại!

## Cấu trúc mở rộng

Dự án được thiết kế để dễ dàng mở rộng:
- Mỗi trò chơi nằm trong folder riêng trong `games/`
- Cấu hình trò chơi tập trung trong `config/games.js`
- Menu tự động load từ config, không cần chỉnh sửa HTML
- Mỗi trò chơi độc lập, có thể chia sẻ riêng
- Hệ thống theme toàn cục: Theme được áp dụng tự động cho menu và tất cả games
- Sử dụng CSS Variables để dễ dàng tùy chỉnh màu sắc

---
**Tác giả:** viet291993@gmail.com, 2025
