import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { uploadFileToBlob } from '../../utils/file';
import {
  sendExternalUploadNotification,
  sendExternalUploadNotificationSlack,
  sendMicroLoggingAlertOnSlack,
} from '../../utils/email';
import ExternalDocument from '.';

// Mock utility functions
jest.mock('../../utils/file', () => ({
  uploadFileToBlob: jest.fn(),
}));

jest.mock('../../utils/email', () => ({
  sendExternalUploadNotification: jest.fn(),
  sendExternalUploadNotificationSlack: jest.fn(),
  sendMicroLoggingAlertOnSlack: jest.fn(),
}));

beforeAll(() => {
  global.fetch = jest.fn(() => {
    return new Promise((resolve, reject) => {
      resolve({
        ok: true,
        json: () => {
          return { status: true };
        },
      });
    });
  }) as jest.Mock;

  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: (arr: Uint32Array) => {
        // Fill the array with pseudo-random values
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 65536);
        }
        return arr;
      },
    },
  });
});

describe('ExternalDocument Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<ExternalDocument />);

    expect(screen.getByText(/Upload external document/i)).toBeInTheDocument();
    expect(screen.getByText(/Your name/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Company name/i)).toBeInTheDocument();
    expect(screen.getByText(/Notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    render(<ExternalDocument />);

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    expect(await screen.findByText(/This is required/i)).toBeInTheDocument();
  });

  it('validates file upload and shows error for invalid file types', async () => {
    render(<ExternalDocument />);

    const fileInput = screen.getByTestId('fileInput');
    const invalidFile = new File(['dummy content'], 'invalid.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(await screen.findByText(/Only .zip, .csv, .xlsx, .xls supported/i)).toBeInTheDocument();
  });

  it('uploads file and transitions to success state on valid submission', async () => {
    (uploadFileToBlob as jest.Mock).mockResolvedValue({ status: true });
    (sendExternalUploadNotification as jest.Mock).mockResolvedValue({});
    (sendExternalUploadNotificationSlack as jest.Mock).mockResolvedValue({});
    (sendMicroLoggingAlertOnSlack as jest.Mock).mockResolvedValue({});

    render(<ExternalDocument />);

    fireEvent.change(screen.getByTestId('Your name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByTestId('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId('Company name'), { target: { value: 'Test Company' } });

    const fileInput = screen.getByTestId('fileInput');
    const validFile = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Thank you for uploading the data file/i)).toBeInTheDocument();
    });

    expect(uploadFileToBlob).toHaveBeenCalledWith(
      validFile,
      expect.any(String),
      expect.objectContaining({
        name: 'Test User',
        companyName: 'Test Company',
        email: 'test@example.com',
      })
    );
    expect(sendExternalUploadNotification).toHaveBeenCalled();
    expect(sendExternalUploadNotificationSlack).toHaveBeenCalled();
  });
});
