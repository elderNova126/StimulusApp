import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Box, HStack, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import CustomTab from '../GenericComponents/CustomTab';
import ProjectsList from '../ProjectsList';
import { navigate, RouteComponentProps } from '@reach/router';
import ProjectsPendingContainer from '../ProjectsPendingContainer';
import StimButton from '../ReusableComponents/Button';

const ProjectsView = (props: RouteComponentProps) => {
  const { t } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box w="95%" p="7rem 0 0 4rem">
      <Text as="h1" textStyle="h1" pb="2rem">
        {t('Projects')}
      </Text>
      <Tabs isLazy index={tabIndex} onChange={(index: number) => setTabIndex(index)}>
        <TabList borderBottom="1px solid #E9E9E9" borderColor="#E9E9E9">
          <HStack spacing="1rem" pl="1">
            <CustomTab p="1">
              <Text textStyle="horizontalTabs">{t('All Projects')}</Text>
            </CustomTab>
            <CustomTab p="1">
              <Text textStyle="horizontalTabs">{t('Pending Invites')}</Text>
            </CustomTab>
            <Box pb=".5rem" position="absolute" right="4rem">
              <StimButton onClick={() => navigate('/projects/create')} size="stimSmall">
                {t('+ New Project')}
              </StimButton>
            </Box>
          </HStack>
        </TabList>
        <TabPanels>
          <TabPanel pl="0">
            <ProjectsList />
          </TabPanel>
          <TabPanel>
            <ProjectsPendingContainer />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ProjectsView;
