import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderList } from './Folder';

const Folders: React.FC = () => {
  const navigate = useNavigate();

  const handleFolderClick = (id: string) => {
    navigate(`/app/folders/${id}`);
  };

  const handleCreateFolder = () => {
    // This will be handled by FolderList component
  };

  return (
    <FolderList 
      onFolderClick={handleFolderClick}
      onCreateFolder={handleCreateFolder}
    />
  );
};

export default Folders;