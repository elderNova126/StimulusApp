import { createStyles, makeStyles, Theme } from '@material-ui/core';

export default makeStyles((theme: Theme) =>
  createStyles({
    listItem: {
      cursor: 'pointer',
      padding: '2px .5rem',
      '&:hover': {
        background: '#ccc',
      },
    },
    containerItems: {
      overflow: 'scroll',
      maxHeight: '250px',
      border: 'solid .2px gray',
      borderRadius: '10px',
    },
    tag: {
      cursor: 'pointer',
    },
  })
);
