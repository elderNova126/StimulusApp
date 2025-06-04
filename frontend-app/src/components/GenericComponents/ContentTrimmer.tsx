import { Stack, Text, Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContentTrimmer = (props: { body: string; fontSize?: string; id?: string; height?: string; width?: string }) => {
  const [showMore, setShowMore] = useState(false);
  const { body, fontSize, id, height, width } = props;
  const { t } = useTranslation();
  const isLargeValue = body?.length > 120;

  return (
    <Stack width={width ? width : '100%'} height={height ? height : '100%'}>
      <Text
        maxHeight="173px"
        overflowY="scroll"
        textStyle="body"
        fontSize={fontSize}
        id={id}
        className="content-trimmer"
      >
        {showMore ? body : isLargeValue ? body.slice(0, 120) + '...' : body}
      </Text>
      {isLargeValue && (
        <Button w="60px" variant="simple" onClick={() => setShowMore(!showMore)}>
          <Text fontSize="11px" textStyle="textLink" id={id}>
            {showMore ? t('Show Less') : t('Show More')}
          </Text>
        </Button>
      )}
    </Stack>
  );
};

export default ContentTrimmer;
