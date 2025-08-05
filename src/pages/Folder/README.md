# Folder Components

Thư mục này chứa các component được tổ chức lại cho chức năng Folder, giúp dễ dàng maintain và mở rộng.

## Cấu trúc thư mục

```
src/pages/Folder/
├── index.tsx              # Export tất cả components
├── FolderList.tsx         # Danh sách thư mục
├── FolderHeader.tsx       # Header của thư mục chi tiết
├── FolderStats.tsx        # Thống kê thư mục
├── FolderToolbar.tsx      # Thanh công cụ
├── StudySetList.tsx       # Danh sách bộ học trong thư mục
├── AddStudySetModal.tsx   # Modal thêm bộ học
├── RemoveConfirmModal.tsx # Modal xác nhận xóa
└── README.md             # Tài liệu này
```

## Components

### FolderList.tsx
Component chính để hiển thị danh sách thư mục với các tính năng:
- Tìm kiếm và lọc thư mục
- Chuyển đổi chế độ xem (grid/list)
- Tạo thư mục mới
- Context menu cho các thao tác
- Toast thông báo

**Props:**
```typescript
interface FolderListProps {
  onFolderClick: (id: string) => void;
  onCreateFolder: () => void;
}
```

### FolderHeader.tsx
Header của trang chi tiết thư mục với:
- Breadcrumb navigation
- Thông tin thư mục (tên, mô tả, trạng thái)
- Các nút thao tác (edit, share, download, delete, settings)

**Props:**
```typescript
interface FolderHeaderProps {
  folder: Folder;
  onTogglePublic: (isPublic: boolean) => void;
  onEdit: () => void;
  onShare: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onSettings: () => void;
}
```

### FolderStats.tsx
Hiển thị thống kê chi tiết của thư mục:
- Số lượng bộ học, thuật ngữ, thời gian học
- Tiến độ trung bình, lượt xem, đánh giá
- Tổng quan tiến độ (hoàn thành, đang học, chưa học)
- Hoạt động gần đây

**Props:**
```typescript
interface FolderStatsProps {
  studySets: QuizSet[];
}
```

### FolderToolbar.tsx
Thanh công cụ với các chức năng:
- Thêm bộ học, tạo thư mục con, di chuyển
- Tìm kiếm trong thư mục
- Sắp xếp theo nhiều tiêu chí
- Chuyển đổi chế độ xem

**Props:**
```typescript
interface FolderToolbarProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  sortBy: string;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSearchChange: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  onAddStudySet: () => void;
  onCreateSubFolder: () => void;
  onMove: () => void;
}
```

### StudySetList.tsx
Hiển thị danh sách bộ học trong thư mục:
- Chế độ xem grid và list
- Thông tin chi tiết bộ học
- Các nút thao tác (flashcards, learn, delete)
- Animation và loading states

**Props:**
```typescript
interface StudySetListProps {
  studySets: QuizSet[];
  viewMode: 'grid' | 'list';
  onRemoveStudySet: (setId: string, setName: string) => void;
  removingSetId: string | null;
}
```

### AddStudySetModal.tsx
Modal để thêm bộ học vào thư mục:
- Danh sách bộ học có sẵn
- Thông tin chi tiết bộ học
- Nút tạo bộ học mới nếu chưa có

**Props:**
```typescript
interface AddStudySetModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStudySets: QuizSet[];
  onAddStudySet: (studySetId: string) => void;
}
```

### RemoveConfirmModal.tsx
Modal xác nhận xóa bộ học:
- Thông báo xác nhận
- Loading state khi đang xóa
- Nút hủy và xác nhận

**Props:**
```typescript
interface RemoveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studySetName: string;
  isRemoving: boolean;
}
```

## Cách sử dụng

### Trong Folders.tsx (Danh sách thư mục)
```typescript
import { FolderList } from './Folder';

const Folders: React.FC = () => {
  const handleFolderClick = (id: string) => {
    navigate(`/app/folders/${id}`);
  };

  return (
    <FolderList 
      onFolderClick={handleFolderClick}
      onCreateFolder={() => {}}
    />
  );
};
```

### Trong FolderDetail.tsx (Chi tiết thư mục)
```typescript
import { 
  FolderHeader, 
  FolderStats, 
  FolderToolbar, 
  StudySetList, 
  AddStudySetModal, 
  RemoveConfirmModal 
} from './Folder';

const FolderDetail: React.FC = () => {
  // State và handlers...

  return (
    <div>
      <FolderHeader folder={folder} {...headerHandlers} />
      <FolderStats studySets={studySets} />
      <FolderToolbar {...toolbarProps} />
      <StudySetList {...studySetProps} />
      <AddStudySetModal {...modalProps} />
      <RemoveConfirmModal {...confirmProps} />
    </div>
  );
};
```

## Lợi ích của cấu trúc mới

1. **Tách biệt trách nhiệm**: Mỗi component có một nhiệm vụ cụ thể
2. **Dễ maintain**: Code ngắn gọn, dễ đọc và sửa đổi
3. **Tái sử dụng**: Các component có thể được sử dụng ở nhiều nơi
4. **Dễ test**: Mỗi component có thể được test độc lập
5. **Mở rộng dễ dàng**: Thêm tính năng mới không ảnh hưởng đến code cũ
6. **Performance**: Chỉ re-render component cần thiết

## Ghi chú

- Tất cả components đều hỗ trợ dark mode
- Sử dụng Framer Motion cho animations
- Responsive design với Tailwind CSS
- TypeScript để type safety
- Consistent với design system của ứng dụng 