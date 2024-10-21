import { v4 as uuidv4 } from 'uuid';

export interface SimulatedFile {
  id: string;
  name: string;
  content: string;
  size: number;
}

export interface SimulatedDirectory {
  id: string;
  name: string;
  files: SimulatedFile[];
  subdirectories: SimulatedDirectory[];
}

export function createSimulatedFileSystem(): SimulatedDirectory {
  return {
    id: uuidv4(),
    name: 'root',
    files: [
      { id: uuidv4(), name: 'file1.txt', content: 'Hello, world!', size: 13 },
      { id: uuidv4(), name: 'file2.txt', content: 'Hello, world!', size: 13 },
      { id: uuidv4(), name: 'file3.txt', content: 'Different content', size: 17 },
    ],
    subdirectories: [
      {
        id: uuidv4(),
        name: 'subdir1',
        files: [
          { id: uuidv4(), name: 'file4.txt', content: 'Hello, world!', size: 13 },
          { id: uuidv4(), name: 'file5.txt', content: 'Another file', size: 12 },
        ],
        subdirectories: [],
      },
      {
        id: uuidv4(),
        name: 'subdir2',
        files: [
          { id: uuidv4(), name: 'file6.txt', content: 'Hello, world!', size: 13 },
        ],
        subdirectories: [],
      },
    ],
  };
}

export function findDuplicates(directory: SimulatedDirectory, useHash: boolean): Record<string, string[]> {
  const duplicates: Record<string, string[]> = {};
  const fileMap: Record<string, string[]> = {};

  function traverseDirectory(dir: SimulatedDirectory, path: string) {
    for (const file of dir.files) {
      const key = useHash ? file.content : file.name;
      const fullPath = `${path}/${file.name}`;
      if (!fileMap[key]) {
        fileMap[key] = [];
      }
      fileMap[key].push(fullPath);
    }

    for (const subdir of dir.subdirectories) {
      traverseDirectory(subdir, `${path}/${subdir.name}`);
    }
  }

  traverseDirectory(directory, '');

  for (const [key, paths] of Object.entries(fileMap)) {
    if (paths.length > 1) {
      duplicates[key] = paths;
    }
  }

  return duplicates;
}