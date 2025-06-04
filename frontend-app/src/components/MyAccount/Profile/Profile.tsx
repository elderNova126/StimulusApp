import { useQuery } from '@apollo/client';
import { Divider, Flex, Stack, Text } from '@chakra-ui/react';
import { RouteComponentProps } from '@reach/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import UserQueries from '../../../graphql/Queries/UserQueries';
import ImageContainer from './ImageContainer';
import ProfileUpdate from './ProfileUpdate';
import LoadingScreen from '../../LoadingScreen';
const { USER_PROFILE_GQL } = UserQueries;

const Profile: FC<RouteComponentProps> = (props) => {
  const { t } = useTranslation();
  const { loading, data } = useQuery(USER_PROFILE_GQL, { fetchPolicy: 'cache-first' });

  return (
    <Stack w="95%">
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Text as="h1" textStyle="h1">
          {t('Profile')}
        </Text>
        {/* <Button variant='simple' size='sm'><Text textStyle='textLink'>{t('Public View')}</Text></Button> */}
      </Flex>
      <Divider />
      {loading ? (
        <LoadingScreen />
      ) : (
        <Flex pt="2rem">
          <ImageContainer />
          <ProfileUpdate userProfile={data?.userProfile} flex="1" px="5rem" />
        </Flex>
      )}
    </Stack>
  );
};

export default Profile;
