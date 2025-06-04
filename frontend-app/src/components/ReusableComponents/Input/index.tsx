import {
  Input,
  InputProps,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from '@chakra-ui/react';
import { ReactElement } from 'react';

interface StimInputProps extends InputProps {
  label?: string;
  errorMessage?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  size?: 'stimSmall' | 'stimMedium' | 'stimLarge';
}

const StimInput: React.FC<StimInputProps> = ({
  label,
  errorMessage,
  leftIcon,
  rightIcon,
  isDisabled,
  size,
  ...props
}) => {
  return (
    <FormControl isInvalid={!!errorMessage}>
      {label && <FormLabel>{label}</FormLabel>}
      <InputGroup>
        {leftIcon && <InputLeftElement pointerEvents="none" children={leftIcon} />}
        <Input variant="stimInput" {...props} isDisabled={isDisabled} size={size} />
        {rightIcon && <InputRightElement pointerEvents="none" children={rightIcon} />}
      </InputGroup>
      {errorMessage && <FormErrorMessage>{errorMessage}</FormErrorMessage>}
    </FormControl>
  );
};

export default StimInput;
