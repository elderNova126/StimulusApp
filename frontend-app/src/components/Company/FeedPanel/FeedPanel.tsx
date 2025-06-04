import { Box, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Company, GArticle } from '../company.types';
import { CompanyProfileDivider } from '../shared';
import NewComponent from './NewComponent';
const LIMIT_ARTICLE = 15;

const FeedPanel = forwardRef((props: { company: Company; edit: boolean }, ref) => {
  const { company, edit } = props;
  const { t } = useTranslation();

  return (
    <Box id="feed">
      <Stack spacing={edit ? 0 : 5}>
        <Stack direction="column" spacing={4}>
          <Text as="h1" textStyle="h1_profile">
            {t('Feeds')}
          </Text>
          <CompanyProfileDivider />
        </Stack>
        <DisplayView company={company} />
      </Stack>
    </Box>
  );
});

const DisplayView = (props: { company: Company }) => {
  const { company } = props;
  let filteredArray = company.news ? [...company.news] : [];
  if (filteredArray.length > LIMIT_ARTICLE) {
    filteredArray = filteredArray.splice(0, LIMIT_ARTICLE);
  }
  return (
    <>
      <Stack spacing={5} maxHeight="270px" overflow="scroll" className="fade">
        <SimpleGrid columns={2} spacing={10}>
          {filteredArray.map((news: GArticle) => (
            <NewComponent key={news.title} article={news} />
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
};
export default FeedPanel;
