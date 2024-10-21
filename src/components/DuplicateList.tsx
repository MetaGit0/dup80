import React, { useState } from 'react';
import { ChevronDown, ChevronRight, File } from 'lucide-react';

interface DuplicateListProps {
  duplicates: Record<string, string[]>;
}

const DuplicateList: React.FC<DuplicateListProps> = ({ duplicates }) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (hash: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(hash)) {
        newSet.delete(hash);
      } else {
        newSet.add(hash);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Duplicate Files Found:</h2>
      {Object.entries(duplicates).map(([hash, files]) => (
        <div key={hash} className="bg-white border border-gray-200 rounded-md shadow-sm">
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleGroup(hash)}
          >
            <div className="flex items-center">
              {expandedGroups.has(hash) ? (
                <ChevronDown size={20} className="text-gray-500 mr-2" />
              ) : (
                <ChevronRight size={20} className="text-gray-500 mr-2" />
              )}
              <span className="font-medium text-gray-700">Group: {files.length} duplicate(s)</span>
            </div>
            <span className="text-sm text-gray-500">Hash: {hash.slice(0, 8)}...</span>
          </div>
          {expandedGroups.has(hash) && (
            <ul className="border-t border-gray-200 divide-y divide-gray-200">
              {files.map((file, index) => (
                <li key={index} className="p-3 pl-10 text-sm text-gray-600 flex items-center">
                  <File size={16} className="mr-2 text-blue-500" />
                  {file}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default DuplicateList;