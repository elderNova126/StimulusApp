import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@chakra-ui/react';

interface Prop {
  errorMessage: string;
  id?: string;
}
const DEFAULTID = '-providerFrom';
const DEFAULT_BASEID = 'error-message-';
const FormErrorsMessage: FC<Prop> = ({ errorMessage, id = DEFAULTID }) => {
  const { t } = useTranslation();
  if (errorMessage) {
    return (
      <Text textStyle="h6" color="secondary" id={DEFAULT_BASEID + id}>
        {t(errorMessage)}
      </Text>
    );
  }
  return null;
};

export default FormErrorsMessage;
