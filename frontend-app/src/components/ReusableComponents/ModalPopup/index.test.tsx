import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StimModal from './index';

describe('StimModal', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      title: 'Test Modal',
      onAction: jest.fn(),
      children: <div>Modal Content</div>,
      trigger: <button>Open Modal</button>,
      ...props,
    };
    return render(<StimModal {...defaultProps} />);
  };

  it('should render trigger button', () => {
    renderComponent();
    expect(screen.getByText('Open Modal')).toBeInTheDocument();
  });

  it('should open modal on trigger click', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Open Modal'));
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should close modal on close button click', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('No, Cancel'));
    await waitFor(() => expect(screen.queryByText('Test Modal')).not.toBeInTheDocument());
  });

  it('should call onAction and close modal on action button click', async () => {
    const onAction = jest.fn();
    renderComponent({ onAction });
    fireEvent.click(screen.getByText('Open Modal'));
    fireEvent.click(screen.getByText('Action'));
    expect(onAction).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText('Test Modal')).not.toBeInTheDocument());
  });
});
