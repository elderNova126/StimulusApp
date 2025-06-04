import { Box, Divider, Flex, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { PartialProject } from '../../graphql/dto.interface';
import NoResultsProjects from './NoResults/NoResultsProjects';

const RecentProjects = (props: { projects: PartialProject[]; loading: boolean; count: number }) => {
  const { t } = useTranslation();
  const { projects, loading, count } = props;

  return (
    <Stack w="1090px" border="1px solid #E4E4E4" rounded="4px" {...(count > 0 && { p: '5px' })} h="343px">
      <Text fontSize="16px" mt="10px" fontWeight="600" pl="7">
        {t('Recent Projects')}
      </Text>
      {loading ? (
        <Spinner placeSelf={'center'} thickness="4px" speed="0.65s" emptyColor="gray.300" color="green.400" size="xl" />
      ) : count > 0 ? (
        projects.map((result: PartialProject) => (
          <Box key={result.id}>
            <Divider />
            <Stack
              mt="11px"
              px="7"
              _hover={{ bg: '#F6F6F6' }}
              display="flex"
              flexDir="column"
              w="100%"
              as="button"
              onClick={() => navigate(`/project/${result.id}`)}
            >
              <Flex>
                <Box mr="15px" mt="8px">
                  {<Image w="20px" src="/icons/suitcase_log.svg" />}
                </Box>
                <Stack>
                  <Text fontSize="14px" textAlign={'left'} my="-4px">
                    {result.title}
                  </Text>
                  <Text fontSize="11px" color="#000" textAlign={'left'}>
                    {result.status === 'INPROGRESS' && 'In-Progress'}
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Box>
        ))
      ) : (
        <NoResultsProjects />
      )}
    </Stack>
  );
};

export default RecentProjects;
