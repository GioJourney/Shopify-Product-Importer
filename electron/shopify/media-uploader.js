const fs = require('fs');
const path = require('path');
const { ERROR_CODES, codedError } = require('../shared/error-codes');

const STAGED_UPLOADS_CREATE = `
mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets {
      url
      resourceUrl
      parameters { name value }
    }
    userErrors { field message }
  }
}`;

function contentTypeFromExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  return 'image/jpeg';
}

async function uploadLocalImage(client, filePath) {
  const filename = path.basename(filePath);
  const mimeType = contentTypeFromExtension(filePath);
  const fileSize = fs.statSync(filePath).size.toString();

  const staged = await client.request(STAGED_UPLOADS_CREATE, {
    input: [
      {
        filename,
        mimeType,
        resource: 'IMAGE',
        httpMethod: 'POST',
        fileSize,
      },
    ],
  });

  const uploadResponse = staged.stagedUploadsCreate;
  if (uploadResponse.userErrors?.length) {
    throw new Error(uploadResponse.userErrors.map((error) => error.message).join(', '));
  }

  const target = uploadResponse.stagedTargets[0];
  const formData = new FormData();
  for (const parameter of target.parameters) {
    formData.append(parameter.name, parameter.value);
  }

  const buffer = fs.readFileSync(filePath);
  formData.append('file', new Blob([buffer], { type: mimeType }), filename);

  const response = await fetch(target.url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw codedError(ERROR_CODES.IMAGE_UPLOAD_FAILED, `Upload immagine fallito: ${filename}`, {
      file: filename,
    });
  }

  return target.resourceUrl;
}

module.exports = { uploadLocalImage };
