import config from '../config/environment.config';

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

export async function sendExternalUploadNotification(data: ExternalUploadNotification): Promise<any> {
  try {
    const response: any = await fetch(`${config.REST_URI}/email/external-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.log('error while fetching address', error);
  }
}
export async function sendExternalUploadNotificationSlack(data: ExternalUploadNotificationSlack): Promise<any> {
  try {
    const response: any = await fetch(`${config.REST_URI}/email/external-upload-slack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.log('error while fetching address');
  }
}
export async function sendMicroLoggingAlertOnSlack(data: MicroLoggingAlertonSlack): Promise<any> {
  try {
    const response: any = await fetch(`${config.REST_URI}/email/logging-slack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.log('error while fetching address');
  }
}
