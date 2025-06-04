import { makeStyles } from '@material-ui/core';

export default makeStyles({
  root: {
    height: 250,
  },
  noProjects: {
    paddingLeft: 15,
  },
  loader: {
    height: 250, // same as root
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectTitle: {
    fontFamily: 'Poppins',
    fontSize: '16px',
    lineHeight: '25px',
    color: '#0F120F',
    fontWeight: 600,
  },
  projectScore: {
    fontFamily: 'Poppins',
    fontSize: '12px',
    lineHeight: '18px',
    color: '#919482',
    fontWeight: 500,
  },
});
