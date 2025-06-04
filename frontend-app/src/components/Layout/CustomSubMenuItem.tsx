import { Box, HStack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { totalNumberSidebar } from '../../utils/number';

const CustomSubMenuItem = (props: { title: string; onClick?: any; leftIcon?: any; total?: number }) => {
  const { title, onClick, leftIcon, total } = props;
  const { t } = useTranslation();
  return (
    <Box
      p={`.2rem ${leftIcon ? '0' : '1'}rem`}
      m={`.1rem 0`}
      cursor="pointer"
      borderRadius="20"
      onClick={onClick}
      display="flex"
    >
      {leftIcon}
      <HStack ml={2}>
        <Text textStyle="sidenavParent">{t(title)}</Text>
        <Text fontSize="small" color="#2A2A28">
          {totalNumberSidebar(total as number)}
        </Text>
      </HStack>
    </Box>
  );
};

export default CustomSubMenuItem;
