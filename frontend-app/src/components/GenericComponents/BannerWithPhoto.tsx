import { Box, Center, Image, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface Props {
  width?: string;
  height?: string;
  title?: string;
  image?: string;
  bgcolor?: string;
  text?: string;
}

const BannerWithPhoto = (props: Props) => {
  const { t } = useTranslation();

  const BoxStyle = {
    backgroundColor: '#e9f8ed',
    borderRadius: '5px',
    margin: '10px',
    width: props.width || '90%',
    minHeight: props.height || '200px',
    display: 'flex',
    flexDirection: 'row',
    color: props.bgcolor || '#4caf50',
  };

  return (
    <Box sx={BoxStyle}>
      <Box width={'33%'} marginLeft={'5%'}>
        <Text as="h2" textStyle="h2" pb="1rem" marginTop={'10%'}>
          {t(props.title ? props.title : '')}
        </Text>
        <Center>
          <Text as="h3" textStyle="h3" pb="2rem">
            {t(props.text ? props.text : '')}
          </Text>
        </Center>
      </Box>
      <Box marginLeft={'10%'} width={'40%'}>
        {props.image ? (
          <Center>
            <Image src={props.image} />
          </Center>
        ) : null}
      </Box>
    </Box>
  );
};

export default BannerWithPhoto;
