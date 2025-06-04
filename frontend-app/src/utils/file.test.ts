import { AvatarResizer, uploadFileToBlob } from './file'; // Adjust the path as needed
import Resizer from 'react-image-file-resizer';
import { BlobServiceClient } from '@azure/storage-blob';

jest.mock('react-image-file-resizer', () => ({
  imageFileResizer: jest.fn(),
}));

// Mocking BlobServiceClient and its methods
const mockUploadData = jest.fn();
const mockGetBlockBlobClient = jest.fn(() => ({
  uploadData: mockUploadData,
  url: 'https://example.com/fake-url',
}));

const mockGetContainerClient = jest.fn(() => ({
  getBlockBlobClient: mockGetBlockBlobClient,
}));

jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: jest.fn(() => ({
      getContainerClient: mockGetContainerClient,
    })),
    ContainerClient: jest.fn(),
    BlockBlobClient: jest.fn(),
  };
});

describe('File Utilities', () => {
  describe('AvatarResizer', () => {
    it('should resize an image and return a new File object', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      const resizedImageData = 'data:image/png;base64,fake-base64-data';

      (Resizer.imageFileResizer as jest.Mock).mockImplementation(
        (file, maxWidth, maxHeight, format, quality, rotation, callback) => {
          callback(resizedImageData);
        }
      );

      const resizedFile = await AvatarResizer(mockFile);

      expect(Resizer.imageFileResizer).toHaveBeenCalledWith(
        mockFile,
        200,
        200,
        'PNG',
        100,
        0,
        expect.any(Function),
        'base64'
      );
      expect(resizedFile).toBeInstanceOf(File);
      expect((resizedFile as File).name).toBe(mockFile.name);
    });

    it('should return the original file if resizing fails', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      (Resizer.imageFileResizer as jest.Mock).mockImplementation(() => {
        throw new Error('Resize error');
      });

      const resizedFile = await AvatarResizer(mockFile);
      expect(resizedFile).toBe(mockFile);
    });
  });

  describe('uploadFileToBlob', () => {
    it('should upload a file to Azure Blob Storage and return the blob URL', async () => {
      const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const sasUri = 'https://example.com/container?sasToken=12345';
      const metadata = { customKey: 'customValue' };

      const result = await uploadFileToBlob(mockFile, sasUri, metadata);

      expect(BlobServiceClient).toHaveBeenCalledWith(sasUri);
      expect(mockGetContainerClient).toHaveBeenCalledWith('uploads');
      expect(mockGetBlockBlobClient).toHaveBeenCalled();
      expect(mockUploadData).toHaveBeenCalledWith(
        mockFile,
        expect.objectContaining({
          blobHTTPHeaders: { blobContentType: mockFile.type },
          metadata: expect.objectContaining({
            fileName: mockFile.name,
            customKey: metadata.customKey,
          }),
        })
      );
      expect(result).toEqual({ status: true, url: 'https://example.com/fake-url' });
    });

    it('should return an empty array if no file is provided', async () => {
      const result = await uploadFileToBlob(null, 'https://example.com/container?sasToken=12345', {});
      expect(result).toEqual([]);
    });
  });
});
