import Resizer from 'react-image-file-resizer';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

const dataURIToBlob = (dataURI: any) => {
  const splitDataURI = dataURI.split(',');
  const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: mimeString });
};

export const AvatarResizer = (file: File) => {
  return new Promise((resolve) =>
    Resizer.imageFileResizer(
      file,
      200,
      200,
      'PNG',
      100,
      0,
      (uri: any) => resolve(new File([dataURIToBlob(uri)], file.name)),
      'base64'
    )
  ).catch((err) => file);
};

export const exportCsv = (data: any[]) => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  const headers = ['id', 'entity', 'entityId', 'created', 'code', 'body', 'userId'];

  csvContent += headers.join(',\t') + '\n';
  const rows = data.map((event) => [
    event.id,
    event.entityType,
    event.entityId,
    event.created,
    event.code,
    event.body.split(',').join(','),
    event.userId,
  ]);

  rows.forEach((rowArray) => {
    const row = rowArray.join(',');
    csvContent += row + '\r\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'activity_log.csv');
  document.body.appendChild(link);

  link.click();
};

export const uploadFileToBlob = async (file: File | null, sasUri: string, metadata: { [key: string]: string }) => {
  if (!file) return [];

  // get BlobService = notice `?` is pulled out of sasToken - if created in Azure portal
  const blobService = new BlobServiceClient(sasUri);

  // get Container - full public read access
  const containerClient: ContainerClient = blobService.getContainerClient('uploads');

  // create blobClient for container
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const companyName = metadata.companyName?.replace(/[^a-zA-Z0-9-_]/g, '_') || 'unknown';
  const filename = file.name.split('.').join(`_${new Date().getTime()}.`);
  const blobPath = `${year}/${month}/${companyName}/${filename}`;
  const blobClient = containerClient.getBlockBlobClient(blobPath);

  const options = {
    blobHTTPHeaders: { blobContentType: file.type },
    metadata: {
      ...metadata,
      fileName: file.name,
    },
  };

  // upload file
  await blobClient.uploadData(file, options);

  return { status: true, url: blobClient.url };
};
