/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import RectangleOfCircles from './RectangleOfCircles';

describe('RectangleOfCircles component', () => {
  const options = [
    { color: 'red', percentage: 30 },
    { color: 'blue', percentage: 20 },
    { color: 'green', percentage: 50 },
  ];

  it('should render the component', () => {
    render(<RectangleOfCircles circlesPerLine={3} numLines={3} options={options} />);
    const circles = screen.getAllByTestId(/circle-/); // Matches any test ID that starts with "circle-"
    expect(circles.length).toBeGreaterThan(0);
  });

  it('should render the component with the correct number of circles', () => {
    const circlesPerLine = 3;
    const numLines = 3;

    render(<RectangleOfCircles circlesPerLine={circlesPerLine} numLines={numLines} options={options} />);

    const circles = screen.getAllByTestId(/circle-/);
    const expectedCircleCount = Math.round(
      ((options[0].percentage + options[1].percentage + options[2].percentage) / 100) * (circlesPerLine * numLines)
    );

    expect(circles.length).toBe(expectedCircleCount);
  });

  it('should render the component with the correct percentage of colors', () => {
    const circlesPerLine = 10;
    const numLines = 10;

    render(<RectangleOfCircles circlesPerLine={circlesPerLine} numLines={numLines} options={options} />);

    const redCircles = screen.getAllByTestId('circle-red');
    const expectedRedCircleCount = Math.round((options[0].percentage / 100) * (circlesPerLine * numLines));
    expect(redCircles.length).toBe(expectedRedCircleCount);

    const blueCircles = screen.getAllByTestId('circle-blue');
    const expectedBlueCircleCount = Math.round((options[1].percentage / 100) * (circlesPerLine * numLines));
    expect(blueCircles.length).toBe(expectedBlueCircleCount);

    const greenCircles = screen.getAllByTestId('circle-green');
    const expectedGreenCircleCount = Math.round((options[2].percentage / 100) * (circlesPerLine * numLines));
    expect(greenCircles.length).toBe(expectedGreenCircleCount);
  });
});
