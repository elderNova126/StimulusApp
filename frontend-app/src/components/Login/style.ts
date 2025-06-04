import { makeStyles } from '@material-ui/core';

export default makeStyles({
  media: {
    filter: 'blur(5px)',
    height: '100vh',
  },
  card: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    color: 'white',
    fontSize: '450%',
    backgroundColor: 'rgba(0, 0, 0, .7)',
    textAlign: 'center',
  },
  loginForm: {
    backgroundColor: '#F0F0F0',
    height: '100vh',
    padding: '20px',
  },
});
