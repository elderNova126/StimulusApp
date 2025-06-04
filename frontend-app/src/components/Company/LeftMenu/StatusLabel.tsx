import { Box, Text, Tooltip } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../../utils/dataMapper';

const StatusLabel = (props: { status: string; type: string }) => {
  const { status, type } = props;
  const { t } = useTranslation();
  const label = type === 'external' ? type : status;
  const { bg, color, fill, border } = useMemo(() => {
    switch (label) {
      case 'active':
        return { bg: '#E7F7EF', fill: '#13AC5A', color: '#007A39' };
      case 'inactive':
        return { bg: '#FCF4F5', fill: '#E6949E', color: '#C62F40' };
      case 'external':
        return { bg: 'white', border: '.5px solid #2A2A28', fill: 'transparent', color: 'primary' };
      case 'archived':
      default:
        return { bg: '#F1F1F1', fill: '#717171', color: '#717171' };
    }
  }, [label]);
  return (
    <Tooltip
      label={type === 'external' ? t('Add to Internal') : status === 'inactive' ? t('Archive Company') : null}
      bg="#fff"
      border="1px solid #E4E4E4"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
      boxSizing="border-box"
      color="#2A2A28"
    >
      <Box
        bg={bg}
        display="inline-block"
        borderRadius="4px"
        width="auto"
        paddingRight="1"
        paddingLeft="1"
        marginLeft="-10%"
        marginTop="5%"
      >
        <Box
          p="1"
          {...(border && { border })}
          borderRadius="50%"
          mr="1"
          display="inline-block"
          bg={fill}
          width="auto"
        />
        <Text color={color} display="inline-block" fontSize="14" lineHeight="21px">
          {capitalizeFirstLetter(label)}
        </Text>
      </Box>
    </Tooltip>
  );
};
export default StatusLabel;
