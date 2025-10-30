// Nếu chạy bằng file:/// sẽ KHÔNG load được ảnh local trong images do chính sách trình duyệt!
// Chỉ sử dụng STUDENT_IMAGES khi demo, còn lại nên yêu cầu người dùng nhập danh sách thủ công, hoặc chạy qua server nội bộ để load ảnh.
// window.STUDENT_IMAGES = [
//   "Lê Đức Việt.jpg",
//   "Lê Hồng Phong.jpg",
//   "Nguyễn Ngọc Băng Giang.jpg",
//   "Hoàng Quốc Việt.jpg"
// ];

// Get student image filenames (uses override from storage if exists)
window.getStudentFilenames = function () {
  const override = loadStudentsOverride();
  // Nếu có override thì dùng, không thì trả mảng rỗng (không load file mặc định khi chạy local)
  if (override && override.length > 0) return override;
  // return STUDENT_IMAGES || []; // Nếu muốn dùng fallback demo thì bỏ comment này
  return [];
};

// Build student objects with id, name, url for display
window.buildStudents = function () {
  const files = getStudentFilenames();
  return files.map((file) => ({
    id: file,
    name: getDisplayNameFromFile(file),
    url: `images/${file}`,
  }));
};
