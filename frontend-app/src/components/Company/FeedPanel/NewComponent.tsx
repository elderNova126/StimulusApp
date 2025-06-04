import { Box, Flex, Image, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { formatStringDate } from '../../../utils/date';
import { GArticle } from '../company.types';
const NewComponent = (props: { article: GArticle }) => {
  const { article } = props;

  return (
    <Box minHeight="80px">
      <Flex>
        {article.image && <Image src={article.image} width={'20'} minW={'20'} />}
        <Flex marginX="1rem" flexDirection="column">
          <Text color="gray.200">{formatStringDate(article.publishedAt, 'MM/DD/YYYY')}</Text>
          <Tooltip label={article.title}>
            <Box
              onClick={() => window.open(article.url, '_blank')}
              fontWeight="bold"
              cursor="pointer"
              width="300px"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              {article.title}
            </Box>
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NewComponent;
