import { Readable } from "stream";
import { drive } from "../config/googleDrive.js";

const RESUME_FOLDER_NAME = "Job-Merket-Resumes";

let cachedFolderId = null;

export async function getResumeFolderId() {
  if (cachedFolderId) {
    return cachedFolderId;
  }

  const response = await drive.files.list({
    q: `name='${RESUME_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: "drive",
    fields: "files(id, name)",
    pageSize: 10,
  });

  const existingFolder = response.data.files?.[0];

  if (existingFolder) {
    cachedFolderId = existingFolder.id;
    return cachedFolderId;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: RESUME_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  cachedFolderId = folder.data.id;

  return cachedFolderId;
}

export async function uploadResumeToDrive(
  file,
  firebaseUid,
  existingFileId = "",
) {
  const folderId = await getResumeFolderId();

  const extension = file.originalname.includes(".")
    ? `.${file.originalname.split(".").pop()}`
    : "";

  const fileName = `${firebaseUid}-resume${extension}`;

  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };

  if (existingFileId) {
    try {
      const updatedFile = await drive.files.update({
        fileId: existingFileId,
        requestBody: {
          name: fileName,
        },
        media,
        fields: "id,name,mimeType",
      });

      return updatedFile.data;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }
  }

  const createdFile = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media,
    fields: "id,name,mimeType",
  });

  return createdFile.data;
}

export async function getResumeFromDrive(fileId) {
  const metadata = await drive.files.get({
    fileId,
    fields: "id,name,mimeType",
  });

  const file = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    {
      responseType: "stream",
    },
  );

  return {
    metadata: metadata.data,
    stream: file.data,
  };
}
const APPLICATION_FOLDER_NAME = "Job-Merket-Applications";

let cachedApplicationFolderId = null;

export async function getApplicationFolderId() {
  if (cachedApplicationFolderId) {
    return cachedApplicationFolderId;
  }

  const response = await drive.files.list({
    q: `name='${APPLICATION_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: "drive",
    fields: "files(id, name)",
    pageSize: 10,
  });

  const existingFolder = response.data.files?.[0];

  if (existingFolder) {
    cachedApplicationFolderId = existingFolder.id;
    return cachedApplicationFolderId;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: APPLICATION_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  cachedApplicationFolderId = folder.data.id;

  return cachedApplicationFolderId;
}

export async function copyResumeForApplication(
  resumeFileId,
  candidateId,
  jobId,
) {
  const folderId = await getApplicationFolderId();

  const originalFile = await drive.files.get({
    fileId: resumeFileId,
    fields: "name,mimeType",
  });

  const extension = originalFile.data.name?.includes(".")
    ? `.${originalFile.data.name.split(".").pop()}`
    : "";

  const copiedFile = await drive.files.copy({
    fileId: resumeFileId,

    requestBody: {
      name: `${candidateId}-${jobId}-resume${extension}`,
      parents: [folderId],
    },

    fields: "id,name,mimeType",
  });

  return copiedFile.data;
}

const COMPANY_LOGO_FOLDER_NAME = "Job-Merket-Company-Logos";

let cachedCompanyLogoFolderId = null;

export async function getCompanyLogoFolderId() {
  if (cachedCompanyLogoFolderId) {
    return cachedCompanyLogoFolderId;
  }

  const response = await drive.files.list({
    q: `name='${COMPANY_LOGO_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    spaces: "drive",
    fields: "files(id, name)",
    pageSize: 10,
  });

  const existingFolder = response.data.files?.[0];

  if (existingFolder) {
    cachedCompanyLogoFolderId = existingFolder.id;
    return cachedCompanyLogoFolderId;
  }

  const folder = await drive.files.create({
    requestBody: {
      name: COMPANY_LOGO_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  cachedCompanyLogoFolderId = folder.data.id;

  return cachedCompanyLogoFolderId;
}

export async function uploadCompanyLogoToDrive(
  file,
  companyId,
  existingFileId = "",
) {
  const folderId = await getCompanyLogoFolderId();

  const extension = file.originalname.includes(".")
    ? `.${file.originalname.split(".").pop()}`
    : "";

  const fileName = `${companyId}-logo${extension}`;

  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.buffer),
  };

  if (existingFileId) {
    try {
      const updatedFile = await drive.files.update({
        fileId: existingFileId,

        requestBody: {
          name: fileName,
        },

        media,

        fields: "id,name,mimeType",
      });

      return updatedFile.data;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }
  }

  const createdFile = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },

    media,

    fields: "id,name,mimeType",
  });

  return createdFile.data;
}

export async function getCompanyLogoFromDrive(fileId) {
  const metadata = await drive.files.get({
    fileId,
    fields: "id,name,mimeType",
  });

  const file = await drive.files.get(
    {
      fileId,
      alt: "media",
    },
    {
      responseType: "stream",
    },
  );

  return {
    metadata: metadata.data,
    stream: file.data,
  };
}
