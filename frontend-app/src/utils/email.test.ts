import config from '../config/environment.config';
import {
  sendExternalUploadNotification,
  sendExternalUploadNotificationSlack,
  sendMicroLoggingAlertOnSlack,
} from './email';

jest.mock('node-fetch', () => jest.fn());

describe('Notification Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendExternalUploadNotification', () => {
    it('should send notification data and return response', async () => {
      const mockResponse = { success: true };

      global.fetch = jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            ok: true,
            json: () => {
              return mockResponse;
            },
          });
        });
      }) as jest.Mock;

      const data = {
        name: 'Test User',
        date: '2024-10-24',
        count: 1,
        format: 'zip',
      };

      const result = await sendExternalUploadNotification(data);

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${config.REST_URI}/email/external-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sendExternalUploadNotificationSlack', () => {
    it('should send Slack notification data and return response', async () => {
      const mockResponse = { success: true };

      global.fetch = jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            ok: true,
            json: () => {
              return mockResponse;
            },
          });
        });
      }) as jest.Mock;

      const data = {
        customerName: 'Test User',
        fileName: 'test-file.zip',
        fileUrl: 'https://test-file-path',
        date: '2024-10-24',
        count: 1,
      };

      const result = await sendExternalUploadNotificationSlack(data);

      // Verify that fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${config.REST_URI}/email/external-upload-slack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Verify the response
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sendMicroLoggingAlertOnSlack', () => {
    it('should send Slack notification data and return response', async () => {
      const mockResponse = { success: true };

      global.fetch = jest.fn(() => {
        return new Promise((resolve, reject) => {
          resolve({
            ok: true,
            json: () => {
              return mockResponse;
            },
          });
        });
      }) as jest.Mock;

      const data = {
        email: 'justin@stimulus',
        userAction: 'Sign On',
      };

      const result = await sendMicroLoggingAlertOnSlack(data);

      // Verify that fetch was called correctly
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(`${config.REST_URI}/email/logging-slack`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Verify the response
      expect(result).toEqual(mockResponse);
    });
  });
});
