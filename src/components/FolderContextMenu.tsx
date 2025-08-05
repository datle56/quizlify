import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Share2, Copy, Palette, FolderOpen, Globe, Lock } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { Folder } from '../types';

interface FolderContextMenuProps {
  folder: Folder;
  x: number;
  y: number;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Folder>) => void;
  onDelete: (id: string) => void;
  onTogglePublic?: (folderId: string, isPublic: boolean) => void;
}

const FolderContextMenu: React.FC<FolderContextMenuProps> = ({
  folder,
  x,
  y,
  onClose,
  onUpdate,
  onDelete,
  onTogglePublic
}) => {
  const { isDarkMode } = useThemeStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    {
      icon: FolderOpen,
      label: 'Mở thư mục',
      action: () => {
        // Navigate to folder
        onClose();
      }
    },
    {
      icon: Edit,
      label: 'Đổi tên',
      action: () => {
        const newName = prompt('Tên mới:', folder.name);
        if (newName && newName.trim()) {
          onUpdate(folder.id, { name: newName.trim() });
        }
        onClose();
      }
    },
    {
      icon: Palette,
      label: 'Đổi màu',
      action: () => {
        // This would open a color picker
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];
        const currentIndex = colors.indexOf(folder.color);
        const nextColor = colors[(currentIndex + 1) % colors.length];
        onUpdate(folder.id, { color: nextColor });
        onClose();
      }
    },
    ...(onTogglePublic ? [{
      icon: folder.isPublic ? Lock : Globe,
      label: folder.isPublic ? 'Đặt thành riêng tư' : 'Đặt thành công khai',
      action: () => {
        onTogglePublic(folder.id, !folder.isPublic);
        onClose();
      }
    }] : []),
    {
      icon: Copy,
      label: 'Sao chép',
      action: () => {
        // This would duplicate the folder
        console.log('Duplicate folder:', folder.id);
        onClose();
      }
    },
    {
      icon: Share2,
      label: 'Chia sẻ',
      action: () => {
        // This would open share modal
        console.log('Share folder:', folder.id);
        onClose();
      }
    },
    {
      icon: Trash2,
      label: 'Xóa',
      action: () => {
        if (confirm(`Bạn có chắc muốn xóa thư mục "${folder.name}"?`)) {
          onDelete(folder.id);
        }
        onClose();
      },
      danger: true
    }
  ];

  const menuClasses = isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-white' 
    : 'bg-white border-gray-200 text-gray-900';

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className={`fixed z-50 min-w-48 rounded-lg shadow-lg border py-2 ${menuClasses}`}
        style={{
          left: x,
          top: y,
          transform: 'translate(-50%, -10px)'
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
              item.danger
                ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                : isDarkMode
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default FolderContextMenu;