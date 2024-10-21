async function getFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function* getFilesRecursively(dirHandle: FileSystemDirectoryHandle): AsyncGenerator<[string, File]> {
  const entries = dirHandle.values();
  for await (const entry of entries) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      yield [entry.name, file];
    } else if (entry.kind === 'directory') {
      yield* getFilesRecursively(entry);
    }
  }
}

export async function findDuplicates(
  dirHandle: FileSystemDirectoryHandle,
  useHash: boolean
): Promise<Record<string, string[]>> {
  const duplicates: Record<string, string[]> = {};
  const fileMap: Record<string, string[]> = {};

  for await (const [path, file] of getFilesRecursively(dirHandle)) {
    const key = useHash ? await getFileHash(file) : file.name;
    if (!fileMap[key]) {
      fileMap[key] = [];
    }
    fileMap[key].push(path);
  }

  for (const [key, paths] of Object.entries(fileMap)) {
    if (paths.length > 1) {
      duplicates[key] = paths;
    }
  }

  return duplicates;
}