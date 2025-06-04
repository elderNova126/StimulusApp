import { Stack, Text, Image, Button, Box } from '@chakra-ui/react';
import { navigate } from '@reach/router';
import { useTranslation } from 'react-i18next';
const NoResultsReports = () => {
  const { t } = useTranslation();

  return (
    <Stack isInline h="330px" w="1092px" border="1px solid #E4E4E4" rounded="4px">
      <Stack w="330px">
        <Text pt="8" pl="5" fontSize="16px" fontWeight="bold" color="#2A2A28">
          Reporting
        </Text>
        <Text pl="5" fontSize="14px">
          {t(
            'Data about your company’s history of projects suppliers and  Finance will appear here once we have it in our system. Start by giving us access to your company data!'
          )}
        </Text>

        <Box p="1rem">
          <Button
            onClick={() => navigate('/companies/all/list/1')}
            w="86px"
            h="29px"
            fontSize="13px"
            colorScheme="green"
          >
            {t('Discover')}
          </Button>
          <Button
            variant={'simple'}
            onClick={() => navigate('/projects/create')}
            _hover={{
              bg: 'linear-gradient(179.97deg, rgba(176, 226, 187, 0.375) 0.03%, rgba(146, 214, 193, 0.375) 99.97%), #FFFFFF',
            }}
            borderRadius="28px"
            maxH="34px"
          >
            <Text textStyle="textLink" fontSize="14px">
              {t('Or Create a New Project')}
            </Text>
          </Button>
        </Box>
      </Stack>
      <Stack bg="#E9F8ED">
        <Image pl="60px" mt="30px" src="icons/no_reports_found.svg" h="300px" w="792px" />
      </Stack>
    </Stack>
  );
};

export default NoResultsReports;
