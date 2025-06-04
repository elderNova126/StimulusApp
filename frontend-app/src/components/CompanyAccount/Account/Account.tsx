import { Box, Flex, FormControl, FormLabel, IconButton, Input, Link, Stack, Text, Spinner } from '@chakra-ui/react';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import TwitterIcon from '@material-ui/icons/Twitter';
import { RouteComponentProps } from '@reach/router';
import { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TenantCompanyContext } from '../../../context/TenantCompany';
import { useLazyAssetUri } from '../../../hooks';
import { getCompanyName } from '../../../utils/dataMapper';
import { useSelector } from 'react-redux';
import { CompanyAvatar } from '../../GenericComponents';
import { useUploadImage, useRemovePhoto } from '../../../hooks/assets';
import AccountPlanInfo from './AccountPlanInfo';
import { AvatarResizer } from '../../../utils/file';
import StimButton from '../../ReusableComponents/Button';

const AccountCompany: FC<RouteComponentProps> = () => {
  const { t } = useTranslation();
  const loadingLogo = useSelector((state: any) => state.generalData.loadingLogo.company);
  const { tenantCompany } = useContext(TenantCompanyContext);
  const { industries, legalBusinessName, website, twitter, facebook, linkedin } = tenantCompany ?? {};
  const [getAsset, { assetUri, refetch, clearAsset }] = useLazyAssetUri();
  const { uploadProfileImage } = useUploadImage();
  const { deleteProfileimage } = useRemovePhoto();
  const [error, setError] = useState('');
  const companyId = tenantCompany?.id;
  useEffect(() => {
    if (tenantCompany?.id) {
      getAsset({ variables: { companyId: tenantCompany.id } });
    }
  }, [tenantCompany, getAsset]);

  const onChangeFile = ({
    target: {
      validity,
      files: [file],
    },
  }: any) => {
    const supportedFormats = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'];
    if (supportedFormats.includes(file?.type)) {
      AvatarResizer(file).then((file: any) => {
        const updatedFile = new File([file], file.name.replace(/[^\w\s]| /g, ''));
        file && validity.valid && uploadImage(updatedFile);
      });
    } else {
      setError(
        'Upload Failed: There was an issue processing your image. Please ensure the file format is supported (e.g., SVG, JPEG, PNG) and try again.'
      );
    }
  };

  const uploadImage = (file: File) => {
    uploadProfileImage(file, null, companyId, refetch, clearAsset);
    setError('');
  };

  const removePhoto = () => {
    if (assetUri) {
      deleteProfileimage(null, companyId, clearAsset);
      setError('');
    }
  };

  const mainIndustry = industries?.[0] ? `${industries[0]?.code} ${industries[0]?.title}` : null;

  return (
    <Stack justifyContent="center" data-testid="accountCompany" spacing={'38px'}>
      <Stack justifyContent="center" alignItems={'center'}>
        <Text>{legalBusinessName ?? 'Company'}</Text>
        {loadingLogo ? (
          <Spinner color="#15844b" borderRadius={'50%'} width="55px" height="55px" />
        ) : (
          <>
            {companyId && <CompanyAvatar border="1px solid gray" companyId={companyId ?? 'My Company'} bg="#D4D4D4" />}
          </>
        )}
        <Box>
          <FormControl>
            <FormLabel htmlFor="file">
              <Text textStyle="textLink" cursor="pointer">
                {t('Change Photo')}
              </Text>
            </FormLabel>
            <Input
              id="file"
              data-testid="choose-file-input"
              type="file"
              display="none"
              accept=".svg, .png, .jpg, .jpeg"
              onInput={onChangeFile}
              onClick={(e) => {
                (e.currentTarget.value as any) = null;
              }}
            />
            {/* <FormHelperText>.gif/.jpeg</FormHelperText> */}
          </FormControl>
        </Box>
        {!!error && (
          <Text textStyle="h6" color="secondary">
            {t(error)}
          </Text>
        )}
        <StimButton
          data-testid="remove-photo-button"
          size="stimSmall"
          disabled={!assetUri}
          variant="stimOutline"
          type="button"
          onClick={removePhoto}
        >
          {t('Remove Photo')}
        </StimButton>
      </Stack>
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} justifyContent="space-around" w="100%">
          <Box>
            <Text>{t('Company Name')}</Text>
            <Text>{getCompanyName(tenantCompany)}</Text>
          </Box>
          <Box>
            <Text>{t('Company Tax Id')}</Text>
            <Text>{tenantCompany?.taxIdNo}</Text>
          </Box>
          <Box>
            <Text>{t('Industry')}</Text>
            <Text>{mainIndustry ?? t('N/A')}</Text>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          {website && (
            <Box data-testid="website-details">
              <Text>{t('Website')}</Text>
              <Link href={website} target="_blank">
                {website}
              </Link>
            </Box>
          )}
          {(facebook || linkedin || twitter) && (
            <Flex data-testid="social-media">
              {linkedin && (
                <Link href={linkedin} target="_blank" data-testid="linkedin-link">
                  <IconButton aria-label="linkedIn">
                    <LinkedInIcon />
                  </IconButton>
                </Link>
              )}
              {twitter && (
                <Link href={twitter} target="_blank" data-testid="twitter-link">
                  <IconButton aria-label="twitter">
                    <TwitterIcon />
                  </IconButton>
                </Link>
              )}
              {facebook && (
                <Link href={facebook} target="_blank" data-testid="facebook-link">
                  <IconButton aria-label="facebook">
                    <FacebookIcon />
                  </IconButton>
                </Link>
              )}
            </Flex>
          )}
        </Stack>
      </Stack>
      <AccountPlanInfo />
    </Stack>
  );
};

export default AccountCompany;
