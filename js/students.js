// Inline default list; user can override in UI
window.STUDENT_IMAGES = [
  "Lê Đức Việt.jpg",
  "Lê Hồng Phong.jpg",
  "Nguyễn Ngọc Băng Giang.jpg",
  "Hoàng Quốc Việt.jpg"
];

// Get student image filenames (uses override from storage if exists)
window.getStudentFilenames = function () {
  const override = loadStudentsOverride();
  if (override && override.length > 0) return override;
  return STUDENT_IMAGES;
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
