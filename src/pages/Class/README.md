# Class Module - Cấu trúc tổ chức

## Tổng quan
Module Class được tổ chức lại để dễ mở rộng và maintain. Cấu trúc được chia thành các component nhỏ, mỗi component có trách nhiệm riêng biệt.

## Cấu trúc thư mục

```
src/pages/Class/
├── index.tsx                 # Trang danh sách lớp học
├── ClassDetail.tsx           # Trang chi tiết lớp học (container)
├── ClassHeader.tsx           # Component header của lớp học
├── ClassTabs.tsx            # Component navigation tabs
├── tabs/                    # Thư mục chứa các tab components
│   ├── OverviewTab.tsx      # Tab tổng quan
│   ├── FoldersTab.tsx       # Tab thư mục
│   ├── MembersTab.tsx       # Tab thành viên
│   ├── AssignmentsTab.tsx   # Tab bài tập
│   └── ProgressTab.tsx      # Tab tiến độ
└── README.md               # Tài liệu này
```

## Mô tả các component

### 1. index.tsx (Classes)
- **Chức năng**: Trang danh sách lớp học
- **Responsibility**: 
  - Hiển thị danh sách lớp học
  - Tìm kiếm lớp học
  - Tạo lớp học mới
  - Tham gia lớp học
- **Props**: Không có
- **State**: 
  - `searchQuery`: Từ khóa tìm kiếm
  - `showCreateModal`: Hiển thị modal tạo lớp
  - `showJoinModal`: Hiển thị modal tham gia lớp

### 2. ClassDetail.tsx
- **Chức năng**: Container chính cho trang chi tiết lớp học
- **Responsibility**:
  - Quản lý state của toàn bộ trang
  - Fetch dữ liệu lớp học
  - Điều hướng giữa các tab
  - Xử lý các action chung
- **Props**: Không có (sử dụng useParams)
- **State**:
  - `activeTab`: Tab hiện tại đang active
  - `classData`: Dữ liệu lớp học
  - `assignments`: Danh sách bài tập

### 3. ClassHeader.tsx
- **Chức năng**: Header của trang chi tiết lớp học
- **Responsibility**:
  - Hiển thị thông tin lớp học
  - Nút quay lại
  - Mã tham gia lớp
  - Nút cài đặt
- **Props**:
  - `classData`: Dữ liệu lớp học
  - `onBack`: Callback khi click nút quay lại
  - `onCopyJoinCode`: Callback khi copy mã lớp

### 4. ClassTabs.tsx
- **Chức năng**: Navigation tabs
- **Responsibility**:
  - Hiển thị các tab navigation
  - Xử lý chuyển đổi tab
- **Props**:
  - `activeTab`: Tab hiện tại
  - `onTabChange`: Callback khi thay đổi tab

### 5. tabs/OverviewTab.tsx
- **Chức năng**: Tab tổng quan
- **Responsibility**:
  - Hiển thị hoạt động gần đây
  - Bài tập sắp hết hạn
  - Hành động nhanh
  - Thống kê nhanh
- **Props**:
  - `classData`: Dữ liệu lớp học
  - `assignments`: Danh sách bài tập

### 6. tabs/FoldersTab.tsx
- **Chức năng**: Tab thư mục
- **Responsibility**:
  - Hiển thị danh sách thư mục
  - Tìm kiếm thư mục
  - Chuyển đổi view mode (grid/list)
  - Các action tạo thư mục
- **Props**:
  - `onCreateFolder`: Callback khi tạo thư mục

### 7. tabs/MembersTab.tsx
- **Chức năng**: Tab thành viên
- **Responsibility**:
  - Hiển thị danh sách thành viên
  - Tìm kiếm thành viên
  - Lọc theo vai trò
  - Thống kê thành viên
- **Props**:
  - `classData`: Dữ liệu lớp học

### 8. tabs/AssignmentsTab.tsx
- **Chức năng**: Tab bài tập
- **Responsibility**:
  - Hiển thị danh sách bài tập
  - Tìm kiếm bài tập
  - Lọc theo trạng thái
  - Thống kê tiến độ bài tập
- **Props**:
  - `assignments`: Danh sách bài tập

### 9. tabs/ProgressTab.tsx
- **Chức năng**: Tab tiến độ
- **Responsibility**:
  - Hiển thị thống kê tổng quan
  - Biểu đồ tiến độ theo thời gian
  - Top học sinh
  - Hoạt động gần đây
- **Props**:
  - `classData`: Dữ liệu lớp học

## Lợi ích của cấu trúc mới

### 1. Dễ maintain
- Mỗi component có trách nhiệm rõ ràng
- Code được chia nhỏ, dễ đọc và sửa
- Tách biệt logic giữa các tab

### 2. Dễ mở rộng
- Thêm tab mới chỉ cần tạo component mới trong thư mục `tabs/`
- Có thể tái sử dụng các component
- Dễ dàng thêm tính năng mới

### 3. Performance
- Chỉ render tab đang active
- Lazy loading có thể được áp dụng dễ dàng
- Tối ưu re-render

### 4. Reusability
- Các component có thể được tái sử dụng ở nơi khác
- Props interface rõ ràng
- Dễ test từng component riêng biệt

## Cách thêm tính năng mới

### Thêm tab mới:
1. Tạo component mới trong thư mục `tabs/`
2. Thêm tab vào `ClassTabs.tsx`
3. Thêm case trong `renderTabContent()` của `ClassDetail.tsx`

### Thêm tính năng vào tab hiện có:
1. Chỉnh sửa component tab tương ứng
2. Thêm state và logic cần thiết
3. Cập nhật UI

## Lưu ý khi phát triển

1. **Consistent styling**: Sử dụng `useThemeStore` cho dark mode
2. **Animation**: Sử dụng Framer Motion cho smooth transitions
3. **Responsive**: Đảm bảo responsive trên mobile
4. **Error handling**: Xử lý lỗi gracefully
5. **Loading states**: Hiển thị loading khi cần thiết
6. **Accessibility**: Đảm bảo accessibility cho người dùng khuyết tật 