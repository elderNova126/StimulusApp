import { Box, Center, Divider, Stack, Text } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

const mdTheme = {
  p: (props: any) => {
    const { children } = props;
    return (
      <Text mb={2} textStyle="body">
        {children}
      </Text>
    );
  },
};

const ChangeLog = (props: RouteComponentProps) => {
  const { t } = useTranslation();
  const [markdown, setMarkdown] = useState<any>();

  useEffect(() => {
    fetch('CHANGELOG.md')
      .then((response) => response.text())
      .then(setMarkdown);
  }, [setMarkdown]);

  return (
    <Box p="6rem">
      <Stack spacing={2}>
        <Center>
          <Text as="h2" textStyle="h2">
            {t('Version History')}
          </Text>
        </Center>
        <Divider />
        <Box data-testid="react-md">
          <ReactMarkdown components={ChakraUIRenderer(mdTheme)} children={markdown} skipHtml />;
        </Box>
      </Stack>
    </Box>
  );
};

export default ChangeLog;
