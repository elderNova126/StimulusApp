import { makeStyles } from '@material-ui/core';

export default makeStyles({
  root: {
    height: 250,
  },
  noCompanies: {
    paddingLeft: 15,
  },
  loader: {
    height: 250, // same as root
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyName: {
    fontFamily: 'Poppins',
    fontSize: '16px',
    lineHeight: '25px',
    fontWeight: 600,
  },
  score: {
    fontSize: '16px',
    lineHeight: '19px',
    color: '#919482',
  },
});
