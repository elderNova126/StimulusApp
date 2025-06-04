import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Skeleton, Text, Textarea } from '@chakra-ui/react';

interface Props {
  labelText: string;
  onChange: (newValue: string) => void;
  isMultiline?: boolean;
  inputValue: string | number | undefined;
  isNumber?: boolean;
  isLoading: boolean;
  isInvalid?: boolean;
  id?: string;
}

const DEFAULT_INPUT_PROPS = {
  type: 'text',
  size: 'sm',
  borderRadius: '4px',
  flex: '1',
  border: '1px solid #848484',
};

const CreateProjectInput: FC<Props> = ({
  labelText,
  onChange,
  isMultiline = false,
  inputValue,
  isNumber = false,
  isLoading,
  isInvalid = false,
  id = labelText,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Text mt="1.5rem" as="h4" textStyle="h4">
        {t(labelText)}
      </Text>
      {isLoading ? (
        <Skeleton height="40px" startColor="green.100" endColor="green.400" />
      ) : isMultiline ? (
        <Textarea
          {...DEFAULT_INPUT_PROPS}
          id={id}
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          isInvalid={isInvalid}
        />
      ) : (
        <Input
          {...DEFAULT_INPUT_PROPS}
          id={id}
          type={isNumber ? 'number' : 'text'}
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          isInvalid={isInvalid}
        />
      )}
    </>
  );
};

export default CreateProjectInput;
