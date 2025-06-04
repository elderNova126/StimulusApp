import React, { ReactNode } from 'react';
import { Text, TextProps } from '@chakra-ui/react';

interface StimTextProps extends TextProps {
  variant:
    | 'stimH1'
    | 'stimH2'
    | 'stimH3'
    | 'stimH4'
    | 'stimH5'
    | 'stimH6'
    | 'stimH7'
    | 'stimSubtitle1'
    | 'stimSubtitle2'
    | 'stimBody1'
    | 'stimBody2'
    | 'stimCaption'
    | 'stimSmallCaption'
    | 'stimOverline';
  children?: ReactNode;
}

const StimText: React.FC<StimTextProps> = ({ variant, children, ...rest }) => {
  return (
    <Text variant={variant} {...rest}>
      {children}
    </Text>
  );
};

export default StimText;
