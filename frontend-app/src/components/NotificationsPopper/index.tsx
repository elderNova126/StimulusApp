import { useMutation } from '@apollo/client';
import {
  Button,
  ClickAwayListener,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import { navigate } from '@reach/router';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EventCategoryType } from '../../graphql/enums';
import NotificationsMutations from '../../graphql/Mutations/NotificationsMutations';
import { EventCode, NotificationMessage } from '../NotificationPopup';
import useStyles from './style';

const { READ_NOTIFICATION_GQL } = NotificationsMutations;

function NotificationsPopper(props: { anchorEl: null | HTMLElement; notifications: any[]; onClose: () => void }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [markNotificationAsRead] = useMutation(READ_NOTIFICATION_GQL);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(props.anchorEl);
  const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);
  const { onClose } = props;
  const { notifications } = props;
  const getIconByEvent = (event: any) => {
    switch (event.entityType) {
      case EventCategoryType.PROJECT:
        return <img className={clsx(classes.icon, classes.mw_18)} src={'/icons/project_selected.svg'} alt="project" />;
      case EventCategoryType.COMPANY:
      default:
        return <CheckCircleRoundedIcon className={classes.icon} />;
    }
  };

  const notificationComponents = notifications
    ?.filter((notification: any) => notification?.event?.code in EventCode)
    ?.map(({ id, read, event }: any) => {
      return (
        <ListItem
          key={id}
          className={clsx(classes.listItem, read ? '' : 'unreadItem')}
          onClick={(e: any) => e.target instanceof HTMLAnchorElement && onClose()}
          onMouseEnter={() => !read && markNotificationAsRead({ variables: { id } })}
          data-testid="notification-item"
        >
          <ListItemIcon className={classes.itemIcon}>{getIconByEvent(event)}</ListItemIcon>
          <ListItemText primary={<NotificationMessage alert={event} className={classes.notification} />} />
        </ListItem>
      );
    });

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    setAnchorEl(props.anchorEl);
  }, [props.anchorEl]);

  return (
    <ClickAwayListener onClickAway={onClose}>
      <Popper
        modifiers={{
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          },
          arrow: {
            enabled: true,
            element: arrowRef,
          },
        }}
        className={classes.popper}
        open={isMenuOpen}
        anchorEl={anchorEl}
      >
        <Paper className={classes.paper}>
          <span className={classes.arrow} ref={setArrowRef} />
          <Box className={classes.box}>
            <List component="nav" className={classes.notificationsRoot} data-testid="menu-notifications-popup-list">
              {notificationComponents?.length ? (
                notificationComponents
              ) : (
                <ListItem className={classes.listItem}>
                  <ListItemText
                    primary={
                      <Typography className={classes.notification}>
                        {t("You don't have any unread notifications")}
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
            <div className={classes.listFooter}>
              <Button
                disableRipple
                disableElevation
                color="primary"
                onClick={() => {
                  navigate('/notifications');
                  onClose();
                }}
              >
                {t('More Alerts')}
              </Button>
            </div>
          </Box>
        </Paper>
      </Popper>
    </ClickAwayListener>
  );
}

export default NotificationsPopper;
