export type FileType = 'png' | 'jpg' | 'doc' | 'directory';

export interface FileItem {
  id: string;
  label: string;
  type: FileType;
  size?: string;
  children?: FileItem[];
}

const fileTypes: FileType[] = ['png', 'jpg', 'doc', 'directory'];

const generateRandomFileName = (type: FileType): string => {
  const prefix = type === 'directory' ? 'Folder' : 'File';
  const randomNumber = Math.floor(Math.random() * 100);
  return type === 'directory' ? `${prefix}_${randomNumber}` : `${prefix}_${randomNumber}.${type}`;
};

const generateRandomFileSize = (): string => {
  return `${Math.floor(Math.random() * 100) + 1}KB`;
};

export const loadChildren = async (parentId: string): Promise<FileItem[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const numberOfFiles = Math.floor(Math.random() * 5) + 1;
  const files: FileItem[] = [];

  for (let i = 0; i < numberOfFiles; i++) {
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const fileId = `${parentId}-${i}`;
    files.push({
      id: fileId,
      label: generateRandomFileName(fileType),
      type: fileType,
      size: fileType !== 'directory' ? generateRandomFileSize() : undefined,
      children: fileType === 'directory' ? [] : undefined,
    });
  }
  return files;
};
