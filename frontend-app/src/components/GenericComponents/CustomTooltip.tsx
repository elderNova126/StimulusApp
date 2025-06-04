import { FC } from 'react';
import { Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  children?: any;
  label?: string;
  arrow?: boolean;
}

export const CustomTooltip: FC<Props> = ({ children, label, arrow }) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      hasArrow={arrow ?? true}
      arrowShadowColor="#E0E0E0"
      label={t(label as string)}
      sx={{
        background: '#FFFFFF',
      }}
      border="1px solid #E4E4E4"
      boxShadow="0px 1px 2px rgba(0, 0, 0, 0.25)"
      color="#2A2A28"
      placement="top"
      p="10px"
      textAlign="match-parent"
    >
      {children}
    </Tooltip>
  );
};
