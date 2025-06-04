import { Box, HStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { totalNumberSidebar } from '../../utils/number';
import StimText from '../ReusableComponents/Text';

const CustomMenuItem = (props: {
  active: boolean;
  title: string;
  onClick?: any;
  leftIcon?: any;
  rightIcon?: any;
  total?: any;
  dataCy?: string;
}) => {
  const { active, title, onClick, leftIcon, rightIcon, total, dataCy } = props;
  const { t } = useTranslation();
  return (
    <Box
      className="chakra-box"
      {...(active && { bg: 'stimPrimary.base', color: 'stimNeutral.white' })}
      {...(!rightIcon && { _hover: { bg: 'stimSecondary.accent1', color: 'stimNeutral.white' } })}
      p={`.5rem ${leftIcon ? '0' : '0.5'}rem`}
      m={`.1rem 0`}
      cursor="pointer"
      borderRadius="4px"
      onClick={onClick}
      display="flex"
    >
      {leftIcon}
      <HStack justifyContent="space-between" w="100%">
        <StimText variant="stimBody1" color="inherit" {...(active && { color: 'stimNeutral.white' })} data-cy={dataCy}>
          {t(title)}
        </StimText>
        <StimText
          variant="stimOverline"
          color={active ? 'stimNeutral.white' : 'stimSecondary.accent1'}
          sx={{
            '.chakra-box:hover &': {
              color: 'stimNeutral.white',
            },
          }}
        >
          {totalNumberSidebar(total as number)}
        </StimText>
        {rightIcon}
      </HStack>
    </Box>
  );
};

export default CustomMenuItem;
