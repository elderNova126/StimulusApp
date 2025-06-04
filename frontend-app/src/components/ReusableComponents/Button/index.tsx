import { Button, ButtonProps } from '@chakra-ui/react';
import { ReactElement, forwardRef } from 'react';

interface StimButtonProps extends ButtonProps {
  size?: 'stimSmall' | 'stimMedium' | 'stimLarge';
  variant?: 'stimPrimary' | 'stimTextButton' | 'stimDestructive' | 'stimOutline' | 'stimWarning' | 'stimReset';
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  icon?: ReactElement;
}

const StimButton = forwardRef<HTMLButtonElement, StimButtonProps>(
  ({ size, variant, children, leftIcon, rightIcon, icon, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size || 'stimMedium'}
        variant={variant || 'stimPrimary'}
        leftIcon={icon ? undefined : leftIcon}
        rightIcon={icon ? undefined : rightIcon}
        {...props}
      >
        {icon ? icon : children}
      </Button>
    );
  }
);

export default StimButton;
