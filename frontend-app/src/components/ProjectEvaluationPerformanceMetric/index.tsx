import {
  Box,
  Center,
  Divider,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscDebugBreakpointData } from 'react-icons/vsc';
import { MetricModel } from '../ProjectEvaluation/evaluation.interface';

export const PerformanceMetricSlider = (props: {
  value: number;
  isDisabled: boolean;
  onMetricChange: (value: number) => void;
}) => {
  const [showValueLabel, setShowValueLabel] = useState(false);
  const { value = 0, isDisabled, onMetricChange } = props;
  const { t } = useTranslation();

  const getLabelMessageByLabel = (value: number) => {
    let message = '';
    if (value < -6) {
      message = t('Did not meet expectations');
    } else if (value < -2) {
      message = t('Met some but not all expectations');
    } else if (value < 2) {
      message = t('Met expectations');
    } else if (value < 6) {
      message = t('Exceeded some expectations');
    } else {
      message = t('Exceeded all expectations');
    }

    return message;
  };
  const color = value < -3 ? 'red' : value < 4 ? 'blue.200' : 'green.600';
  return (
    <Box
      minHeight="55"
      onMouseEnter={() => setShowValueLabel(true)}
      onMouseLeave={() => setShowValueLabel(false)}
      data-testid="metricSlider"
    >
      <Slider
        aria-label="slider-ex-4"
        onChange={(...p) => {
          if (!isDisabled) {
            onMetricChange(...p);
          }
        }}
        value={value}
        min={-10}
        max={10}
        step={1}
      >
        <SliderTrack bg="red.100">
          <SliderFilledTrack bg={color} />
        </SliderTrack>
        <SliderThumb boxSize={isDisabled ? 1.5 : 4}>
          <Box color={color} as={VscDebugBreakpointData} />
        </SliderThumb>
      </Slider>
      {showValueLabel && (
        <Center>
          <Text color={color} textStyle="h6">
            {getLabelMessageByLabel(value)}
          </Text>
        </Center>
      )}
    </Box>
  );
};

const ProjectEvaluationPerformanceMetric = (props: {
  metric: MetricModel;
  metricValue: number;
  onMetricChange: (metricCategory: string, value: number) => void;
  isDisabled: boolean;
}) => {
  const { metric, metricValue, onMetricChange, isDisabled } = props;

  const onChange = (value: number) => {
    onMetricChange(metric.keyId, value);
  };

  return (
    <Stack>
      <Flex m=".5rem 0" justifyContent="space-between" data-testid="performanceMetric-container">
        <Stack w="100%">
          <Text as="h4" color="#000" textStyle="h4">
            {metric.category.toUpperCase()}:
          </Text>
          <Text textStyle="h3" color="#000">{`${metric.question}?`}</Text>
        </Stack>
        <Box w="400px">
          <PerformanceMetricSlider value={metricValue} isDisabled={isDisabled} onMetricChange={onChange} />
        </Box>
      </Flex>
      <Divider />
    </Stack>
  );
};

export default ProjectEvaluationPerformanceMetric;
