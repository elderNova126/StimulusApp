import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { navigate } from '@reach/router';
import StimButton from '../Button';
import { BsArrowLeft } from 'react-icons/bs';

interface ErrorPageTemplateProps extends RouteComponentProps {
  title: string;
  message: string;
}

const ErrorPageTemplate = ({ title, message }: ErrorPageTemplateProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        justifyContent="center"
        alignItems="center"
        position="relative"
        data-testid="loading-screen"
        border="none"
        spacing="80px"
        mb="6rem"
      >
        <Box>
          <Text textStyle="stimH2" textAlign="center">
            {t(title)}
          </Text>
          <Text textStyle="stimBody1" textAlign="center" maxW="400px">
            {t(message)}
          </Text>
        </Box>
        <Box position="relative" display="flex" justifyContent="center" alignItems="center">
          <Image
            justifyContent="center"
            alignItems="center"
            h="17.12rem"
            w="22.31rem"
            bgImage="url('/icons/error-background.svg')"
            bgSize="cover"
            bgPosition="center"
          ></Image>
          <Image
            h="15rem"
            src="https://stimulusmetricsdev.blob.core.windows.net/images/human.png"
            position="absolute"
            bottom="-0.1"
            left="12"
            alt="human"
          />
        </Box>
        <StimButton
          onClick={() => navigate('/')}
          variant="stimTextButton"
          leftIcon={<BsArrowLeft color="stimPrimary.base" />}
        >
          <Text textStyle="stimSubtitle1" color="stimPrimary.base">
            {t('Go to Home')}
          </Text>
        </StimButton>
      </VStack>
    </Box>
  );
};

export default ErrorPageTemplate;
