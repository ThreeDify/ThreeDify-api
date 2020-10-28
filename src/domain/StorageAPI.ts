export interface StorageAPI {
  unlinkFile(filePath: string): Promise<void>;
  fileExists(filePath: string): Promise<boolean>;
  getFilePath(directory: string, fileName: string): Promise<string>;
  saveFile(
    tmpFilePath: string,
    filePath: string,
    mimeType: string
  ): Promise<void>;
}

export default StorageAPI;
