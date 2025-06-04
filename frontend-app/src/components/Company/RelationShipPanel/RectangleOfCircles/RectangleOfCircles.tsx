import { SkeletonCircle } from '@chakra-ui/react';

type Option = {
  color: string;
  percentage: number;
};

type RectangleOfCirclesProps = {
  circlesPerLine: number;
  numLines: number;
  options?: Option[];
};

const RectangleOfCircles = ({ circlesPerLine, numLines, options }: RectangleOfCirclesProps) => {
  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < numLines; i++) {
      lines.push(renderLine(i));
    }
    return lines;
  };

  const renderLine = (lineIndex: number) => {
    const circles = [];
    for (let i = 0; i < circlesPerLine; i++) {
      const circleIndex = lineIndex * circlesPerLine + i + 1;
      const circleColor = getCircleColor(circleIndex);
      circles.push(
        <SkeletonCircle
          id={`circle-${circleColor}`} // Fix string interpolation
          key={i}
          size="2"
          margin={1}
          startColor={circleColor}
          endColor={circleColor}
          data-testid={`circle-${circleColor}`} // Correct test ID
        />
      );
    }
    return (
      <div
        key={lineIndex}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        {circles}
      </div>
    );
  };

  const getCircleColor = (circleIndex: number) => {
    if (options) {
      const totalCircles = circlesPerLine * numLines;
      let coloredCircles = 0;

      for (const { color, percentage } of options) {
        const numCircles = Math.round((percentage / 100) * totalCircles);
        if (circleIndex <= coloredCircles + numCircles) {
          return color;
        }
        coloredCircles += numCircles;
      }
    }

    return '#dbe2e9';
  };

  return <>{renderLines()}</>;
};

export default RectangleOfCircles;
