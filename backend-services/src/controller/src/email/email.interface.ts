export interface ExternalUploadNotification {
  name: string;
  date: string;
  count: number;
  format: string;
}

export interface ExternalUploadNotificationSlack {
  customerName: string;
  fileName: string;
  fileUrl: string;
  date: string;
  count: number;
}

export interface MicroLoggingAlertonSlack {
  email: string;
  userAction: string;
}

export interface PendingInvitationNotification {
  listName: string;
  name: string;
  inviteUser: string;
  toEmail: string;
}

export interface EmailResponse {
  success: boolean;
  message?: string;
}
