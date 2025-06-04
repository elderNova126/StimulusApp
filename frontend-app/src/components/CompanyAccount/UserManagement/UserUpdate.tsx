import { useMutation } from '@apollo/client';
import { Box, Divider, Flex, FormControl, IconButton, Input, Select, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoMdArrowBack } from 'react-icons/io';
import UserMutations from '../../../graphql/Mutations/UserMutations';
import { useStimulusToast } from '../../../hooks';
import UserQueries from '../../../graphql/Queries/UserQueries';
import StimButton from '../../ReusableComponents/Button';
const { UPDATE_USER_PROFILE } = UserMutations;
const { TENANT_USERS_GQL } = UserQueries;
const UserUpdate = (props: { user: any; onClose: () => void }) => {
  const { t } = useTranslation();
  const [updateUser] = useMutation(UPDATE_USER_PROFILE);
  const { user } = props;
  const [firstName, setFirstName] = useState(user.givenName);
  const [lastName, setLastName] = useState(user.surname);
  const [title, setTitle] = useState(user.jobTitle);
  const [phone, setPhone] = useState(user.mobilePhone);
  const [accountEnabled, setAccountEnabled] = useState<boolean>(!!user.accountEnabled);
  const { register, handleSubmit, errors } = useForm();
  const { enqueueSnackbar } = useStimulusToast();

  const handleUpdateUser = () => {
    updateUser({
      variables: {
        externalAuthSystemId: user.externalAuthSystemId,
        givenName: firstName,
        surname: lastName,
        jobTitle: title,
        // mail: email,
        mobilePhone: phone,
        accountEnabled,
      },
      update: (cache, { data }) => {
        if (data?.updateUserProfile?.id) {
          enqueueSnackbar('User Edited', { status: 'success' });
          props.onClose();
        }
      },
      refetchQueries: [{ query: TENANT_USERS_GQL }],
    });
  };
  return (
    <div>
      <Stack spacing={'2rem'} alignItems="center" data-testid="userManagementEdit-container">
        <Box alignSelf={'flex-start'} w="100%">
          <Flex alignItems="center">
            <IconButton onClick={props.onClose} aria-label="back" variant="simple" color={'green'} size="sm">
              <IoMdArrowBack />
            </IconButton>
            <Text>{t('Update User Information')}</Text>
          </Flex>
          <Divider />
        </Box>
        <Box w="400px">
          <form onSubmit={handleSubmit(handleUpdateUser)}>
            <Stack spacing={4}>
              <Box>
                <label>
                  <Text>{t('* First Name')}</Text>
                  <Input
                    ref={register({ required: t('This is required') as string })}
                    name="firstName"
                    value={firstName ?? ''}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                {errors.firstName && (
                  <span data-testid="first-name-field-error" role="alert">
                    {errors.firstName.message}
                  </span>
                )}
              </Box>
              <Box>
                <label>
                  <Text>{t('* Last Name')}</Text>
                  <Input
                    ref={register({ required: t('This is required') as string })}
                    name="lastName"
                    value={lastName ?? ''}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                {errors.lastName && (
                  <span data-testid="last-name-field-error" role="alert">
                    {errors.lastName.message}
                  </span>
                )}
              </Box>
              <Box>
                <label>
                  <Text>{t('* Title')}</Text>
                  <Input
                    ref={register({ required: t('This is required') as string })}
                    name="title"
                    value={title ?? ''}
                    onChange={(e) => setTitle(e.target.value)}
                    data-testid="title-Input"
                  />
                </label>
                {errors.title && (
                  <span data-testid="title-field-error" role="alert">
                    {errors.title.message}
                  </span>
                )}
              </Box>
              {/* <Box>
                <label>
                  <Text >{t('* Email')}</Text>
                  <Input
                    fullWidth
                    inputProps={{
                      ref: register({ required: t('This is required') as string }),
                    }}
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                  />
                </label>
                {errors.email && (
                  <span data-testid="email-field-error" role="alert" >
                    {errors.email.message}
                  </span>
                )}
              </Box> */}
              <Box>
                <label>
                  <Text>{t('Phone')}</Text>
                  <FormControl>
                    <Input name="phone" value={phone ?? ''} onChange={(e) => setPhone(e.target.value)} />
                  </FormControl>
                </label>
              </Box>
              <Box>
                <Text>{t('Company role')}</Text>
                <FormControl variant="outline">
                  <Select value={'admin'} isFullWidth>
                    <option value="admin">{t('Admin')}</option>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Text>{t('Status')}</Text>
                <FormControl variant="outlined">
                  <Select
                    value={accountEnabled ? 'active' : 'inactive'}
                    isFullWidth
                    onChange={(e) => setAccountEnabled(e.target.value === 'active' ? true : false)}
                  >
                    <option value="active">{t('Active')}</option>
                    <option value="inactive">{t('Inactive')}</option>
                  </Select>
                </FormControl>
              </Box>
              <Divider />
              <Flex direction="row-reverse">
                <StimButton data-testid="submit-button" type="submit" size="stimSmall">
                  {t('Update')}
                </StimButton>
              </Flex>
            </Stack>
          </form>
        </Box>
      </Stack>
    </div>
  );
};

export default UserUpdate;
