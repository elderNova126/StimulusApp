import { makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    divider: {
      width: '100%',
      margin: '20px 0',
    },
    title: {
      color: '#0F120F',
      fontFamily: 'Poppins',
      fontSize: '14px',
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: '21px',
    },
    sliderContainer: {
      minHeight: 55,
    },
    subtitle: {
      color: '#7A7D72',
      fontFamily: 'Roboto',
      fontSize: '14px',
      letterSpacing: 0,
      lineHeight: '20px',
    },
    valueIndicator: {
      fontFamily: 'Poppins',
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: 0,
      lineHeight: '18px',
      textAlign: 'center',
    },
    exceptionalValue: {
      color: theme.palette.primary.main,
    },
    metExpectationsValue: {
      color: '#7FCFD0',
    },
    unsatisfactoryValue: {
      color: theme.palette.secondary.main,
    },
  })
);
