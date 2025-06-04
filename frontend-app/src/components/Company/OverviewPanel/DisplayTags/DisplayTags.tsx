import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const CompanyTags = ({ tags }: { tags: { tag: string }[] }) => {
  const { t } = useTranslation();
  return (
    <Stack margin="0 1rem 1rem 1rem" spacing={1} alignItems="flex-start">
      <Text as="h5" textStyle="h5" mb="10px">
        {t('Tags')}
      </Text>
      {tags?.map((tag: any, index: number) => (
        <Flex my="5px" key={`${index}_${tag.id}`}>
          <Box bg={'#F1F1F1'} display="inline-block" borderRadius="4px" p="0 8px">
            <Text color={'#717171'} display="inline-block" fontSize="14" lineHeight="21px" id={tag?.tag}>
              {tag?.tag}
            </Text>
          </Box>
        </Flex>
      ))}
    </Stack>
  );
};
