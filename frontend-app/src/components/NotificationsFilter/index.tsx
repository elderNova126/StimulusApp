import { useTranslation } from 'react-i18next';
import { Box, Divider, Stack, Text } from '@chakra-ui/layout';
import { Radio, RadioGroup } from '@chakra-ui/radio';
import { EventCategoryType } from '../../graphql/enums';

const NotificationFilter = (props: { categoryHook: any; projectFilterHook: any }) => {
  const [category, setCategory] = props.categoryHook;
  const { t } = useTranslation();

  return (
    <Box>
      <Stack>
        <Text as="h4" textStyle="h4">
          {t('Filter by category')}
        </Text>
        <Divider />
        <RadioGroup
          onChange={(value: string) => {
            setCategory(value);
          }}
          colorScheme="blackAlpha"
          value={category ?? ''}
        >
          <Stack direction="column">
            <Radio value="">
              <Text textStyle="body">{t('All')}</Text>
            </Radio>
            <Radio value={EventCategoryType.COMPANY}>
              <Text textStyle="body">{t('Companies Only')}</Text>
            </Radio>
            <Radio value={EventCategoryType.PROJECT}>
              <Text textStyle="body">{t('Projects Only')}</Text>
            </Radio>
          </Stack>
        </RadioGroup>
      </Stack>
    </Box>
  );
};

export default NotificationFilter;
