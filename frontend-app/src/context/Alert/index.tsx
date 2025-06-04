import { useLazyQuery, useMutation } from '@apollo/client';
import moment from 'moment';
import { createContext, useEffect, useState } from 'react';
import NotificationContent from '../../components/NotificationPopup';
import NotificationsMutations from '../../graphql/Mutations/NotificationsMutations';
import AlertQueries from '../../graphql/Queries/NotificationQueries';
import { useStimulusToast, useTimeout, useUser } from '../../hooks';
import { notificationListMapper } from '../../utils/dataMapper';
const { POLLING_ALERTS_GQL } = AlertQueries;
const { READ_NOTIFICATION_GQL } = NotificationsMutations;
// tslint:disable-next-line: no-object-literal-type-assertion
export const AlertsContext = createContext({ newAlerts: [] });
interface Notification {
  id: number;
  read: boolean;
  event: {
    id: number;
    code: string;
    entityId: string;
    entityType: string;
    meta: string;
  };
}

export const AlertsPollingProvider = (props: { children: any }) => {
  const {
    user: { sub: currentUserId },
  } = useUser();
  const [timestamp, setTimestamp] = useState(moment.utc());
  const { enqueueSnackbar } = useStimulusToast();
  const [newAlerts, setNewAlerts] = useState([]);
  const [markNotificationAsRead] = useMutation(READ_NOTIFICATION_GQL);

  const [getNotifications, { client, loading, data, error }] = useLazyQuery(POLLING_ALERTS_GQL, {
    fetchPolicy: 'cache-first',
  });
  const notifications = data?.notifications?.results;
  const newTenantEvents = data?.searchEvents?.count;
  const cancelTimeout = useTimeout({
    active: true,
    timeout: 50000,
    callback: () => {
      getNotifications({ variables: { timestamp, notUserId: currentUserId } });
    },
  });

  useEffect(() => () => cancelTimeout && cancelTimeout(), [cancelTimeout]);

  useEffect(() => {
    if (notifications?.length) {
      // in case of updating the cache, we need to filter by last value
      const filteredNotifications = notifications.filter(
        (notification: Notification) =>
          !notification.read && !newAlerts.find((item: any) => item.id === notification.id)
      );
      const notificationList = notificationListMapper(notifications) ?? [];

      notificationList.forEach((notificationList: any) => {
        if (notificationList.count > 1) {
          const message = `${notificationList.count} Companies were added to ${notificationList.listName}`;
          enqueueSnackbar(message, { status: 'success' });
        } else {
          const message = `${notificationList.companyNames[0]} was added to ${notificationList.listName}`;
          enqueueSnackbar(message, { status: 'success' });
        }
      });

      filteredNotifications
        .filter((notification: any) => notification.event.code !== 'ADD_TO_COMPANY_LIST')
        .forEach((notification: Notification, i: number) => {
          const message = (
            <NotificationContent
              onMouseEnter={() => {
                markNotificationAsRead({ variables: { id: notification.id } });
              }}
              alert={notification.event}
            />
          );
          enqueueSnackbar(message, { status: 'success' });
        });
      setNewAlerts([...notifications] as any);
    }
  }, [notifications]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && !error) {
      if (newTenantEvents) {
        client?.resetStore(); // reset store on new events
      }
      setTimestamp(moment.utc());
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AlertsContext.Provider value={{ newAlerts }}>{props.children}</AlertsContext.Provider>;
};
