import fs from 'fs';
import path from 'path';
import { BlobServiceClient } from '@azure/storage-blob';

export async function uploadImage(buffer, originalName) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const containerName = process.env.AZURE_BLOB_CONTAINER;

  if (connectionString && containerName) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: 'blob' });

    const safeName = `${Date.now()}-${originalName.replace(/\s+/g, '-')}`;
    const blockBlobClient = containerClient.getBlockBlobClient(safeName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: 'image/jpeg'
      }
    });

    return blockBlobClient.url;
  }

  const uploadsDir = path.resolve('uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const safeName = `${Date.now()}-${originalName.replace(/\s+/g, '-')}`;
  const localPath = path.join(uploadsDir, safeName);
  fs.writeFileSync(localPath, buffer);
  return `/uploads/${safeName}`;
}
