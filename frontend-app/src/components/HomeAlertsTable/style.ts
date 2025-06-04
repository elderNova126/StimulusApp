import { makeStyles } from '@material-ui/core';

export default makeStyles({
  root: {
    height: 250,
  },
  noAlerts: {
    paddingLeft: 15,
  },
  loader: {
    height: 250, // same as root
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#000000',
    fontFamily: 'Poppins',
    fontSize: '13px',
    fontWeight: 600,
    letterSpacing: 0,
    lineGeight: '20px',
  },
  subtitle: {
    color: '#7A7D72',
    fontFamily: 'Roboto',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: 0,
    lineGeight: '15px',
  },
});
