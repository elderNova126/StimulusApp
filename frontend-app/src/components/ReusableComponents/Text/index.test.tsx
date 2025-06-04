import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StimText from './index';

describe('StimText Component', () => {
  it('renders correctly with stimH1 variant', () => {
    render(<StimText variant="stimH1">Test H1</StimText>);
    const textElement = screen.getByText('Test H1');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass('chakra-text');
  });

  it('renders correctly with stimBody1 variant', () => {
    render(<StimText variant="stimBody1">Test Body1</StimText>);
    const textElement = screen.getByText('Test Body1');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass('chakra-text');
  });

  it('renders correctly with stimCaption variant', () => {
    render(<StimText variant="stimCaption">Test Caption</StimText>);
    const textElement = screen.getByText('Test Caption');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass('chakra-text');
  });
});
