import { FC } from 'react';
import { Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  children?: any;
  label?: string;
  placement?: 'top' | 'right' | 'bottom' | 'left';
}

export const StimTooltip: FC<Props> = ({ children, label, placement }) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      hasArrow
      label={t(label as string)}
      bg="stimSecondary.accent1"
      boxShadow="stimLight"
      boxSizing="border-box"
      color="stimNeutral.white"
      borderRadius="8px"
      placement={placement || 'top'}
      p="10px"
      textAlign="match-parent"
    >
      {children}
    </Tooltip>
  );
};
