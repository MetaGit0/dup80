import React from 'react';
import { Folder, File } from 'lucide-react';
import { SimulatedDirectory, SimulatedFile } from '../utils/simulatedFileSystem';

interface FileListProps {
  directory: SimulatedDirectory | null;
}

const FileList: React.FC<FileListProps> = ({ directory }) => {
  if (!directory) {
    return (
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-gray-600">No directory selected</p>
      </div>
    );
  }

  const renderDirectory = (dir: SimulatedDirectory, path: string = '') => (
    <div key={dir.id} className="ml-4">
      <div className="flex items-center text-gray-700 mb-2">
        <Folder size={20} className="mr-2 text-blue-500" />
        <span className="font-semibold">{dir.name}</span>
      </div>
      {dir.files.map((file) => renderFile(file, `${path}/${dir.name}`))}
      {dir.subdirectories.map((subdir) => renderDirectory(subdir, `${path}/${dir.name}`))}
    </div>
  );

  const renderFile = (file: SimulatedFile, path: string) => (
    <div key={file.id} className="ml-8 flex items-center text-gray-600 mb-1">
      <File size={16} className="mr-2 text-gray-400" />
      <span>{`${path}/${file.name}`}</span>
    </div>
  );

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <div className="flex items-center text-gray-700 mb-2">
        <Folder size={24} className="mr-2 text-blue-500" />
        <span className="font-semibold">Current Directory: {directory.name}</span>
      </div>
      {renderDirectory(directory)}
    </div>
  );
};

export default FileList;