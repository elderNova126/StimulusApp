export const CONTAINER_PROJECT_SUFFIX = 'projects';
export const CONTAINER_COMPANY_SUFFIX = 'company-attachments';
export const CONTAINER_ASSET_SUFFIX = 'assets';

export enum SupportedExtensions {
  PDF = 'pdf',
  CVS = 'cvs',
  DOC = 'doc',
  XLS = 'xls',
  PPT = 'ppt',
  JPEG = 'jpeg',
  JPG = 'jpg',
  ZIP = 'zip',
  PNG = 'png',
}

export const ProjectSupportedExtensions = [
  SupportedExtensions.PDF,
  SupportedExtensions.CVS,
  SupportedExtensions.XLS,
  SupportedExtensions.PPT,
  SupportedExtensions.JPEG,
  SupportedExtensions.JPG,
  SupportedExtensions.ZIP,
  SupportedExtensions.PNG,
];

export const AssetSupportedExtensions = [SupportedExtensions.JPEG, SupportedExtensions.JPG, SupportedExtensions.PNG];

export const MimeTypeMapping: Record<SupportedExtensions, string> = {
  [SupportedExtensions.PDF]: 'application/pdf',
  [SupportedExtensions.CVS]: 'text/cvs',
  [SupportedExtensions.DOC]: 'application/msword',
  [SupportedExtensions.XLS]: 'application/vnd.ms-excel',
  [SupportedExtensions.PPT]: 'application/vnd.ms-powerpoint',
  [SupportedExtensions.JPEG]: 'image/jpeg',
  [SupportedExtensions.JPG]: 'image/jpeg',
  [SupportedExtensions.ZIP]: 'application/zip',
  [SupportedExtensions.PNG]: 'image/png',
};
