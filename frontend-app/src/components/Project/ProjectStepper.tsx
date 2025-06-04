import React, { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { PartialProject } from '../../graphql/dto.interface';
import { ProjectStatus } from './index';
import ActiveStep from './ActiveStep';
import { CheckCircleIcon, Icon } from '@chakra-ui/icons';
import { BsCircle } from 'react-icons/bs';

export const projectStatusMapper: any = {
  NEW: 'New',
  OPEN: 'Open',
  INPROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  INREVIEW: 'Review',
  CANCELED: 'Canceled',
};

interface ProjectStepperProps {
  project: PartialProject;
  activeStep: number;
  steps: ProjectStatus[];
  evaluations: any;
}

const ProjectStepper: FC<ProjectStepperProps> = ({ project, activeStep, steps, evaluations }) => {
  return (
    <Flex direction="row">
      {steps.map((label, index) => {
        const isCurrent = index === activeStep;
        const isCompleted = index < activeStep;
        const isLastStep = index === steps.length - 1;
        return (
          <Flex key={index} flexDirection="column" position="relative" height="40px" width="69px" marginRight="25px">
            <Flex flexDirection="row" margin="auto" paddingLeft="25px">
              {isCurrent ? (
                <ActiveStep project={project} evaluations={!!evaluations[0]?.evaluations} />
              ) : (
                <Icon
                  width="14px"
                  height="14px"
                  color={isCompleted ? 'green.600' : 'inherit'}
                  as={isCompleted ? CheckCircleIcon : BsCircle}
                />
              )}
              <Box
                position="relative"
                bottom="4px"
                width={isCurrent ? '64px' : '69px'}
                height="2px"
                backgroundColor={isLastStep ? 'transparent' : isCompleted ? 'green.600' : '#E4E4E4'}
                margin="11px 5px 0px 5px"
              />
            </Flex>
            <Box margin="auto">
              <Text as="sub" fontWeight="bold" color={isCompleted ? 'green.600' : 'black'} textStyle="subtitle1">
                {projectStatusMapper[label]}
              </Text>
            </Box>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default ProjectStepper;
