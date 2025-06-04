import { useMutation } from '@apollo/client';
import { Box, BoxProps, Stack, Tooltip } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserMutations from '../../../graphql/Mutations/UserMutations';
import { useStimulusToast } from '../../../hooks';
import ProfileField from './ProfileField';
import StimButton from '../../ReusableComponents/Button';
const { UPDATE_MY_PROFILE } = UserMutations;

interface UserProfile {
  id: string;
  givenName: string;
  surname: string;
  jobTitle: string;
  mobilePhone: string;
}
const ProfileUpdate: FC<BoxProps & { userProfile: UserProfile }> = (props) => {
  const [updateUserProfile, { loading: updateLoading }] = useMutation(UPDATE_MY_PROFILE);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const { enqueueSnackbar } = useStimulusToast();
  const { t } = useTranslation();
  const { userProfile } = props;

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile?.givenName ?? '');
      setLastName(userProfile?.surname ?? '');
      setTitle(userProfile?.jobTitle ?? '');
      setPhone(userProfile?.mobilePhone ?? '');
    }
  }, [userProfile]);

  const handleUpdate = (e: any) => {
    e.preventDefault();
    if (!firstName || !lastName || !title) {
      return;
    }

    updateUserProfile({
      variables: {
        jobTitle: title,
        ...(phone && { mobilePhone: phone }),
        givenName: firstName,
        surname: lastName,
      },
    }).then(({ data }: any) => {
      if (data && data.updateMyProfile?.id) {
        enqueueSnackbar(t('Profile updated'), { status: 'success' });
      }
    });
  };
  const isSubmitButtonEnabled = firstName && lastName && title;

  const getButtonTooltipMessage = (): string => {
    const addMessageToArray = (condition: boolean, message: string, array: string[]) =>
      condition ? array.push(message) : null;

    const requiredFields: string[] = [];
    addMessageToArray(!firstName, ' First Name', requiredFields);
    addMessageToArray(!lastName, ' Last Name', requiredFields);
    addMessageToArray(!title, ' title', requiredFields);

    return requiredFields.length ? t('The following fields are required') + `:${requiredFields.join(',')}` : '';
  };

  return (
    <Box {...props}>
      <form onSubmit={handleUpdate}>
        <Stack spacing={4} width="80%">
          <ProfileField name={'firstName'} label={t('First Name *')} value={firstName} onChange={setFirstName} />
          <ProfileField name={'lastName'} label={t('Last Name *')} value={lastName} onChange={setLastName} />
          <ProfileField name={'title'} label={t('Title *')} value={title} onChange={setTitle} />
          <ProfileField name={'phone'} label={t('Phone')} value={phone} onChange={setPhone} />
          <Box>
            <Tooltip label={!isSubmitButtonEnabled && getButtonTooltipMessage()} placement="top">
              <StimButton
                {...(isSubmitButtonEnabled && { colorScheme: 'green' })}
                size="stimSmall"
                isLoading={updateLoading}
                type="submit"
              >
                {t('Save Changes')}
              </StimButton>
            </Tooltip>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default ProfileUpdate;
