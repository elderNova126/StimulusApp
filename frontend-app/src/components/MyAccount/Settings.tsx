import { useMutation, useQuery } from '@apollo/client';
import { Flex, List, ListItem, Stack, Text } from '@chakra-ui/layout';
import { Divider } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationsMutations from '../../graphql/Mutations/NotificationsMutations';
import AlertQueries from '../../graphql/Queries/NotificationQueries';
import { Checkbox } from '../GenericComponents';
import LoadingScreen from '../LoadingScreen';

enum NotificationCategory {
  GLOBAL = 'GLOBAL',
  PROJECTS = 'PROJECTS',
  PROJECT_COMPANIES = 'PROJECT_COMPANIES',
  FAVORITE_COMPANIES = 'FAVORITE_COMPANIES',
}

const { NOTIFICATIONS_PROFILE_LIST_GQL } = AlertQueries;
const { NOTIFICATION_SUBSCRIBE_CATEGORY_GQL, NOTIFICATION_UNSUBSCRIBE_CATEGORY_GQL } = NotificationsMutations;
const Settings: FC<RouteComponentProps> = (props) => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(NOTIFICATIONS_PROFILE_LIST_GQL, { fetchPolicy: 'cache-first' });
  const [subscribeToCategoryTopic] = useMutation(NOTIFICATION_SUBSCRIBE_CATEGORY_GQL);
  const [unsubscribeFromCategoryTopic] = useMutation(NOTIFICATION_UNSUBSCRIBE_CATEGORY_GQL);

  const userNotificationProfile = data?.userNotificationProfile;
  const isSubscribedToAnyProject = !!userNotificationProfile?.subscribedProjects?.length;
  const isSubscribedToAnyProjectCompany = !!userNotificationProfile?.subscribedProjectCompanies?.length;
  const isSubscribedToAnyFavoriteCompany = !!userNotificationProfile?.subscribedCompanies?.length;

  const subscribe = (data: { category?: string }) => {
    subscribeToCategoryTopic({ variables: data });
  };
  const unsubscribe = (data: { category?: string }) => {
    unsubscribeFromCategoryTopic({ variables: data });
  };

  return (
    <Stack w="95%" spacing={4}>
      <Flex justifyContent="space-between" alignItems="flex-end">
        <Text as="h1" textStyle="h1">
          {t('Settings')}
        </Text>
      </Flex>

      <Stack pt="2rem">
        <Text textStyle="h2" as="h2">
          {t('Notifications')}
        </Text>
        {loading ? (
          <LoadingScreen />
        ) : (
          <List m="1rem" spacing={4}>
            <ListItem display="flex" flexDirection="row-reverse">
              <Text as="h4" textStyle="h4">
                {t('Alerts')}
              </Text>
            </ListItem>
            <ListItem p="1rem" display="flex" justifyContent="space-between">
              <Text as="h4" textStyle="h4">
                {t('Global')}
              </Text>
              <Checkbox width="14px" height="14px" checked={true} />
            </ListItem>
            <Divider />
            <ListItem p="1rem" display="flex" justifyContent="space-between">
              <Text as="h4" textStyle="h4">
                {t('Project')}
              </Text>
              <Checkbox
                width="14px"
                height="14px"
                checked={isSubscribedToAnyProject}
                onClick={() =>
                  isSubscribedToAnyProject
                    ? unsubscribe({ category: NotificationCategory.PROJECTS })
                    : subscribe({ category: NotificationCategory.PROJECTS })
                }
              />
            </ListItem>
            <Divider />

            <ListItem p="1rem" display="flex" justifyContent="space-between">
              <Text as="h4" textStyle="h4">
                {t('Project Companies')}
              </Text>
              <Checkbox
                width="14px"
                height="14px"
                checked={isSubscribedToAnyProjectCompany}
                onClick={() =>
                  isSubscribedToAnyProjectCompany
                    ? unsubscribe({ category: NotificationCategory.PROJECT_COMPANIES })
                    : subscribe({ category: NotificationCategory.PROJECT_COMPANIES })
                }
              />
            </ListItem>
            <Divider />

            <ListItem p="1rem" display="flex" justifyContent="space-between">
              <Text as="h4" textStyle="h4">
                {t('Favorite Companies')}
              </Text>
              <Checkbox
                width="14px"
                height="14px"
                checked={isSubscribedToAnyFavoriteCompany}
                onClick={() =>
                  isSubscribedToAnyFavoriteCompany
                    ? unsubscribe({ category: NotificationCategory.FAVORITE_COMPANIES })
                    : subscribe({ category: NotificationCategory.FAVORITE_COMPANIES })
                }
              />
            </ListItem>
          </List>
        )}
      </Stack>
    </Stack>
  );
};

export default Settings;
