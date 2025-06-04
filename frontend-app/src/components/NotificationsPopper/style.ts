import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    notificationsRoot: {
      maxWidth: 300,
      padding: 0,
      maxHeight: 400,
      overflow: 'scroll',
    },
    notification: {
      fontSize: 12,
    },
    box: {
      position: 'relative',
    },
    paper: {
      backgroundColor: 'white',
    },
    listItem: {
      webkitTransition: 'background .4s',
      mozTransition: 'background .4s',
      oTransition: 'background .4s',
      transition: 'background .4s',
      '&.unreadItem': {
        backgroundColor: '#E4FEE9',
        borderBottomColor: theme.palette.primary.main,
      },
    },
    listFooter: {
      fontSize: 12,
      position: 'sticky',
      bottom: 0,
      backgroundColor: 'white',
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      '& button': {
        paddingRight: 8,
        fontSize: 'inherit',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    mw_18: {
      maxWidth: '18px',
    },
    popper: {
      marginTop: 10,
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      zIndex: 1100,
      '&[x-placement*="bottom"] $arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.71em',
        marginLeft: 4,
        marginRight: 4,
        '&::before': {
          transformOrigin: '0 100%',
        },
      },
      '&[x-placement*="top"] $arrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.71em',
        marginLeft: 4,
        marginRight: 4,
        '&::before': {
          transformOrigin: '100% 0',
        },
      },
      '&[x-placement*="right"] $arrow': {
        left: 0,
        marginLeft: '-0.71em',
        height: '1em',
        width: '0.71em',
        marginTop: 4,
        marginBottom: 4,
        '&::before': {
          transformOrigin: '100% 100%',
        },
      },
      '&[x-placement*="left"] $arrow': {
        right: 0,
        marginRight: '-0.71em',
        height: '1em',
        width: '0.71em',
        marginTop: 4,
        marginBottom: 4,
        '&::before': {
          transformOrigin: '0 0',
        },
      },
    },
    icon: {
      fontSize: '20px',
      marginRight: '10px',
      color: theme.palette.primary.main,
    },
    itemIcon: {
      minWidth: 0,
    },
    arrow: {
      overflow: 'hidden',
      position: 'absolute',
      width: '1em',
      height: '0.71em' /* = width / sqrt(2) = (length of the hypotenuse) */,
      boxSizing: 'border-box',
      color: '#F9FEFB',
      borderBottom: '#fff',
      backgroundColor: '#fff',
      '&::before': {
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        content: '""',
        margin: 'auto',
        display: 'block',
        height: '80%',
        boxShadow: theme.shadows[1],
        transform: 'rotate(45deg)',
      },
    },
  })
);
