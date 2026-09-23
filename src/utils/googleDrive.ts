/**
 * Google Drive Workspace Integration Service
 * Configured with OAuth Scopes:
 * - https://www.googleapis.com/auth/drive
 * - https://www.googleapis.com/auth/drive.file
 * - https://www.googleapis.com/auth/drive.readonly
 */

export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly'
];

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  webViewLink?: string;
  category: 'invoice' | 'proposal' | 'contract' | 'toolkit' | 'certificate' | 'student_id';
}

const STORAGE_KEY = 'hrn_google_drive_files';

export const getStoredDriveFiles = (): GoogleDriveFile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading Google Drive files', e);
  }
  return [
    {
      id: 'gdrive-hrn-001',
      name: 'Contract-HR-Consulting-Services-Template.pdf',
      mimeType: 'application/pdf',
      size: '1.8 MB',
      createdTime: new Date(Date.now() - 86400000 * 3).toISOString(),
      webViewLink: 'https://drive.google.com',
      category: 'contract'
    },
    {
      id: 'gdrive-hrn-002',
      name: 'Standard-Corporate-NDA-Agreement.pdf',
      mimeType: 'application/pdf',
      size: '1.1 MB',
      createdTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      webViewLink: 'https://drive.google.com',
      category: 'contract'
    },
    {
      id: 'gdrive-hrn-003',
      name: 'Invoice-Template-ZATCA-E-Billing.pdf',
      mimeType: 'application/pdf',
      size: '950 KB',
      createdTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      webViewLink: 'https://drive.google.com',
      category: 'invoice'
    },
    {
      id: 'gdrive-hrn-004',
      name: 'HR-Navigator-Company-Profile-2025.pdf',
      mimeType: 'application/pdf',
      size: '2.4 MB',
      createdTime: new Date(Date.now() - 86400000).toISOString(),
      webViewLink: 'https://drive.google.com',
      category: 'proposal'
    },
    {
      id: 'gdrive-hrn-005',
      name: 'Diagnostic-HR-Audit-Checklist.xlsx',
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      size: '850 KB',
      createdTime: new Date(Date.now() - 3600000 * 12).toISOString(),
      webViewLink: 'https://drive.google.com',
      category: 'toolkit'
    }
  ];
};

export const saveFileToGoogleDrive = async (
  name: string,
  category: GoogleDriveFile['category'],
  contentDataUrl?: string
): Promise<GoogleDriveFile> => {
  // Simulate network upload to Google Drive folder 'HR Navigator Consultations'
  await new Promise(r => setTimeout(r, 800));

  const newFile: GoogleDriveFile = {
    id: `gdrive-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    mimeType: name.endsWith('.pdf') ? 'application/pdf' : name.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'image/jpeg',
    size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
    createdTime: new Date().toISOString(),
    webViewLink: 'https://drive.google.com',
    category
  };

  const existing = getStoredDriveFiles();
  const updated = [newFile, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newFile;
};
