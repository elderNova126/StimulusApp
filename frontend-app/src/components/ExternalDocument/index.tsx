import React, { FC, useState } from 'react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Textarea,
  Text,
  Grid,
  Spinner,
  Input,
  Container,
  Image,
  Flex,
  GridItem,
  Center,
} from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import useStyles from './style';
import { useTranslation } from 'react-i18next';
import { uploadFileToBlob } from '../../utils/file';
import { useExternalUploadLink } from '../../hooks';
import { sendExternalUploadNotification, sendExternalUploadNotificationSlack } from '../../utils/email';

const ExternalDocument: FC<RouteComponentProps> = (props) => {
  const [file, setFile] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const classes = useStyles();
  const { t } = useTranslation();
  const crypto = window.crypto;
  const link = useExternalUploadLink();
  // UI/form management
  const [currentState, setCurrentState] = useState<'init' | 'upload' | 'success' | 'failed'>('init');
  const [inputKey, setInputKey] = useState(crypto.getRandomValues(new Uint32Array(1)).toString());
  const acceptableFileTypes = ['.zip', '.csv', '.xlsx', '.xls'];

  const submitForm = async (e: any) => {
    e.preventDefault();
    !isSubmitted && setIsSubmitted(true);
    if (
      name &&
      companyName &&
      email &&
      file &&
      acceptableFileTypes.some((ext) => file.name.toLowerCase().endsWith(ext))
    ) {
      setCurrentState('upload');
      // *** UPLOAD TO AZURE STORAGE ***
      const res: any = await uploadFileToBlob(file, link.replace('/uploads', ''), { name, companyName, email, notes });
      if (res?.status) {
        setCurrentState('success');

        await sendExternalUploadNotificationSlack({
          customerName: name,
          fileName: file.name.split('.').slice(0, -1).join('.'),
          fileUrl: res.url,
          date: new Date().toLocaleDateString('en-US'),
          count: 1,
        });
        await sendExternalUploadNotification({
          name: name,
          date: new Date().toLocaleDateString('en-US'),
          count: 1,
          format: file.name.split('.').pop(),
        });
      } else {
        setCurrentState('failed');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setCompanyName('');
    setEmail('');
    setNotes('');
    setFile(null);
    setCurrentState('init');
    setIsSubmitted(false);
    setInputKey(crypto.getRandomValues(new Uint32Array(1)).toString());
  };

  const onChangeFile = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => validity.valid && setFile(file);

  const getContent = () => {
    switch (currentState) {
      case 'init':
        return (
          <form onSubmit={submitForm}>
            <Grid templateColumns="1fr">
              <GridItem colSpan={12}>
                <Text className={classes.title}>Upload external document | only .zip, .csv, .xlsx, .xls accepted</Text>
              </GridItem>
              <GridItem colSpan={12} className={classes.formControl}>
                <Text className={classes.label}>{t('Your name *')}</Text>
                <Input
                  data-testid="Your name"
                  isFullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                />
                <span
                  style={{ visibility: isSubmitted && !name ? 'visible' : 'hidden' }}
                  data-testid="name-field-errors"
                  role="alert"
                  className={classes.errorMessage}
                >
                  {t('This is required')}
                </span>
              </GridItem>
              <GridItem colSpan={12} className={classes.formControl}>
                <Text className={classes.label}>{t('Email *')}</Text>
                <Input
                  data-testid="Email"
                  isFullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
                {isSubmitted && !email && (
                  <span data-testid="email-field-errors" role="alert" className={classes.errorMessage}>
                    {t('This is required')}
                  </span>
                )}
              </GridItem>
              <GridItem colSpan={12} className={classes.formControl}>
                <Text className={classes.label}>{t('Company name *')}</Text>
                <Input
                  data-testid="Company name"
                  isFullWidth
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  name="companyName"
                />
                {isSubmitted && !companyName && (
                  <span data-testid="companyName-field-errors" role="alert" className={classes.errorMessage}>
                    {t('This is required')}
                  </span>
                )}
              </GridItem>
              <GridItem colSpan={12} className={classes.formControl}>
                <Text className={classes.label}>{t('Notes')}</Text>
                <Textarea
                  minH="10rem"
                  aria-label="notes textarea"
                  style={{ width: '100%', resize: 'vertical' }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </GridItem>
              <GridItem colSpan={12} className={classes.formControl}>
                <input
                  accept=".zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  type="file"
                  key={inputKey ?? ''}
                  onChange={onChangeFile}
                  data-testid="fileInput"
                />
                {isSubmitted && !file && (
                  <span data-testid="file-field-errors" role="alert" className={classes.errorMessage}>
                    {t('This is required')}
                  </span>
                )}
                {file && !acceptableFileTypes.some((ext) => file.name.endsWith(ext)) && (
                  <span data-testid="file-field-errors" role="alert" className={classes.errorMessage}>
                    {t('Only .zip, .csv, .xlsx, .xls supported')}
                  </span>
                )}
              </GridItem>
              <GridItem colSpan={12} className={classes.formControl}>
                <Button
                  isDisabled={!acceptableFileTypes.some((ext) => file?.name.endsWith(ext))}
                  data-testid="submit button"
                  type="submit"
                  colorScheme="green"
                >
                  {t('Submit')}
                </Button>
              </GridItem>
            </Grid>
          </form>
        );
      case 'upload':
        return <Spinner />;
      case 'success':
        return (
          <>
            <GridItem colSpan={12}>
              <CheckIcon className={classes.icon} />
            </GridItem>
            <GridItem colSpan={12}>
              <Text variant="subtitle1">
                {t(
                  'Thank you for uploading the data file. The Stimulus team will reach out to you once it is processed.'
                )}
              </Text>
            </GridItem>
            <GridItem colSpan={12}>
              <Button className={classes.button} variant="outline" onClick={() => resetForm()}>
                {t('upload again')}
              </Button>
            </GridItem>
          </>
        );
      case 'failed':
        return (
          <>
            <GridItem colSpan={12}>
              <CloseIcon className={classes.icon} />
            </GridItem>
            <GridItem colSpan={12}>
              <Text variant="subtitle1">{t('Upload failed.')}</Text>
            </GridItem>
            <GridItem colSpan={12}>
              <Button className={classes.button} variant="outline" onClick={() => resetForm()}>
                {t('upload again')}
              </Button>
            </GridItem>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        w="100%"
        mb={5}
        p={5}
        bg={['primary.500', 'primary.500', 'transparent', 'transparent']}
        color={['white', 'white', 'primary.700', 'primary.700']}
        boxShadow="xl"
      >
        <Box
          onClick={() => {
            window.location.href = '/';
          }}
          className={classes.logo}
        >
          <Image className={classes.logoImg} src="/stimuluslogo.png" alt="STIMULUS" />
        </Box>
      </Flex>
      <Grid style={{ minHeight: '90vh' }}>
        <Center>
          <Container borderRadius="md" boxShadow="2xl">
            <Box p="2rem" display="flex" alignItems="center" flexDirection="column">
              {getContent()}
            </Box>
          </Container>
        </Center>
      </Grid>
    </>
  );
};

export default ExternalDocument;
