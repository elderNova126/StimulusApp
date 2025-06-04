import { createStyles, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    table: {
      overflow: 'hidden',
    },
    actionCell: {
      cursor: 'pointer',
      width: '16%',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    toolBar: {
      alignItems: 'flex-end',
      minHeight: 32,
      paddingRight: 0,
    },
    icon: {
      cursor: 'pointer',
    },
    coloredCell: {
      backgroundColor: '#9D9D9D',
      color: theme.palette.common.white,
    },
    simpleCell: {},
    orderIcon: {
      verticalAlign: 'bottom',
    },
    poppins: {
      fontFamily: 'Poppins',
    },
    subtitle: {
      fontSize: 12,
    },
    actionCellItem: {
      textAlign: 'center',
      marginRight: '1px',
      '&:nth-last-child(1)': {
        marginRight: 0,
      },
    },
    order: {
      color: '#1BB062',
      fontFamily: 'Poppins',
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '18px',
    },
  })
);
