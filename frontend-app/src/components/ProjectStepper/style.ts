import { createStyles, Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // width: '100%',
      border: '1px solid',
      borderColor: theme.palette.primary.main,
      backgroundColor: '#FAFEFB',
      margin: '10px 0',
    },
    activeStepIcon: {
      cursor: 'pointer',
      fontSize: 14,
    },
    stepper: {
      backgroundColor: 'transparent',
      '& .MuiStepConnector-root': {
        left: 'calc(-50% + 9px)',
        right: 'calc(50% + 9px)',
      },
    },
    quontoStepper: {
      marginBottom: 32,
    },
    label: {
      color: theme.palette.primary.main,
    },
    popoverRoot: {
      opacity: 1,
      padding: theme.spacing(2),
      borderRadius: '5px',
      background: '#F9FEFB',
    },
    popupItem: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      '&:nth-last-child(1)': {
        border: 'none',
      },
    },
    popupItemHeader: {
      display: 'flex',
      alignItems: 'center',
    },
    actionItem: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    icon: {
      fontSize: '14px',
    },
    forwardIcon: {
      color: theme.palette.primary.main,
    },
    playIcon: {
      color: '#7FCFD0',
    },
    popupItemHeaderName: {
      width: '100%',
      padding: '6px',
      fontFamily: 'Poppins',
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '18px',
    },
    changeStatusLabel: {
      fontSize: 12,
    },
    arrow: {
      overflow: 'hidden',
      position: 'absolute',
      width: '1em',
      height: '0.71em' /* = width / sqrt(2) = (length of the hypotenuse) */,
      boxSizing: 'border-box',
      color: '#F9FEFB',
      borderBottom: '#F9FEFB',
      '&::before': {
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        content: '""',
        margin: 'auto',
        display: 'block',
        width: '80%',
        height: '100%',
        boxShadow: theme.shadows[1],
        backgroundColor: 'currentColor',
        transform: 'rotate(45deg)',
      },
    },
    popper: {
      border: '1px solid',
      borderRadius: '5px',
      borderColor: theme.palette.primary.main,
      marginTop: 20,
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
    modalIcon: {
      fontSize: '7.188rem',
    },
    secondary: {
      color: theme.palette.secondary.main,
    },
    modalText: {
      textAlign: 'center',
      fontWeight: 600,
      fontFamily: 'Poppins',
    },
    warningText: {
      fontWeight: 600,
      margin: theme.spacing(2),
      marginTop: 8,
      color: '#919482',
      fontFamily: 'Roboto',
      fontSize: '14px',
      letterSpacing: '0',
      lineHeight: '16px',
    },
    updateStatusButton: {
      marginTop: '8px',
      color: '#FFFFFF',
      fontFamily: 'Poppins',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '21px',
      textAlign: 'center',
    },
    modalAction: {
      marginBottom: 15,
    },
    modalTitle: {
      margin: theme.spacing(2),
      fontFamily: 'Poppins',
      fontSize: '20px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '30px',
      textAlign: 'center',
    },
    modalSubtitle: {
      marginTop: 8,
      color: '#919482',
      fontFamily: 'Roboto',
      fontSize: '14px',
      letterSpacing: '0',
      lineHeight: '16px',
    },
    cancelAction: {
      fontFamily: 'Poppins',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '21px',
      textAlign: 'center',
    },
    backAction: {
      color: '#1BB062',
      fontFamily: 'Poppins',
      fontSize: '16px',
      letterSpacing: '0',
      lineHeight: '25px',
    },
  })
);
